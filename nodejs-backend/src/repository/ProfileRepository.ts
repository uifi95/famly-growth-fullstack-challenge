import { db, query } from "../db/database";
import mysql from "mysql2/promise";

interface ParentProfile {
  id: number;
  name: string;
  child: string;
}

interface PaymentMethod {
  id: number;
  parentId: number;
  method: string;
  isActive: boolean;
}

interface Invoice {
  id: number;
  parentId: number;
  amount: number;
  date: string;
}

export class ProfileRepository {
  async listPaymentMethods(parentId: number): Promise<PaymentMethod[]> {
    const sql = "SELECT * FROM payment_methods WHERE parent_id = ?";
    const results = await query(sql, [parentId]);
    return results.map((r) => ({
      id: r.id,
      parentId: r.parent_id,
      method: r.method,
      isActive: r.is_active,
    }));
  }

  async listInvoices(parentId: number): Promise<Invoice[]> {
    const sql = "SELECT * FROM invoices WHERE parent_id = ?";
    const result = await query(sql, [parentId]);
    return result.map((r) => ({
      id: r.id,
      parentId: r.parent_id,
      amount: r.amount,
      date: r.date.toLocaleString(),
    }));
  }

  async getParentProfile(parentId: number): Promise<ParentProfile | undefined> {
    const sql = "SELECT * FROM parents WHERE id = ?";
    const results = await query(sql, [parentId]);
    if (results.length === 1) {
      return {
        id: results[0].id,
        name: results[0].name,
        child: results[0].child,
      };
    } else {
      return undefined;
    }
  }

  async addPaymentMethod(
    parentId: number,
    method: string,
  ): Promise<PaymentMethod> {
    const sql =
      "INSERT INTO payment_methods (parent_id, method, is_active) VALUES (?, ?, false)";
    const [result] = await db.execute<mysql.ResultSetHeader>(sql, [
      parentId,
      method,
    ]);
    const insertId = result.insertId;
    return { id: insertId, parentId, method, isActive: false };
  }

  async setActivePaymentMethod(
    parentId: number,
    methodId: number,
  ): Promise<PaymentMethod | undefined> {
    const deactivateSql =
      "UPDATE payment_methods SET is_active = false WHERE parent_id = ?";
    await db.query(deactivateSql, [parentId]);

    const activateSql =
      "UPDATE payment_methods SET is_active = true WHERE id = ?";
    await db.query(activateSql, [methodId]);

    const getMethodSql = "SELECT * FROM payment_methods WHERE id = ?";
    const results = await query(getMethodSql, [methodId]);
    if (results.length === 1) {
      return {
        id: results[0].id,
        parentId: results[0].parent_id,
        method: results[0].method,
        isActive: results[0].is_active,
      };
    } else {
      return undefined;
    }
  }

  async deletePaymentMethod(
    parentId: number,
    method: string,
  ): Promise<boolean> {
    const sql =
      "DELETE FROM payment_methods WHERE parent_id = ? AND method = ?";
    const [result] = await db.execute<mysql.ResultSetHeader>(sql, [
      parentId,
      method,
    ]);
    return result.affectedRows > 0;
  }
}
