import { db } from '../db/database';
import mysql from 'mysql2/promise';
import { Log, PaymentMethod } from '../parentProfileBackend';

export class Logger {
    async log(logInstance: Log): Promise<Log> {
        const query =
            'INSERT INTO logs (parent_id, log_type, message) VALUES (?, ?, ?)';
        const [result] = await db.execute<mysql.ResultSetHeader>(query, [
            logInstance.parentId,
            logInstance.logType,
            logInstance.message,
        ]);

        return { ...logInstance, id: result.insertId };
    }

    formatPaymentMethod(paymentMethod: PaymentMethod): string {
        return `${paymentMethod.id}|${paymentMethod.method}|${
            paymentMethod.isActive ? 'Active' : 'Inactive'
        }`;
    }
}
