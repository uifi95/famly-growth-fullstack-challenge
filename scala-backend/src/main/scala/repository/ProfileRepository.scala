package repository

import scala.util.chaining._

import domain._
import slick.jdbc.MySQLProfile.api._
import scala.concurrent.{Future, ExecutionContext}

class ProfileRepository(db: Database)(implicit ec: ExecutionContext) {

  private class ParentsTable(tag: Tag) extends Table[ParentProfile](tag, "parents") {
    def id = column[Long]("id", O.PrimaryKey, O.AutoInc)
    def name = column[String]("name")
    def child = column[String]("child")
    def * = (id, name, child) <> (ParentProfile.tupled, ParentProfile.unapply)
  }

  private class PaymentMethodsTable(tag: Tag) extends Table[PaymentMethod](tag, "payment_methods") {
    def id = column[Long]("id", O.PrimaryKey, O.AutoInc)
    def parentId = column[Long]("parent_id")
    def method = column[String]("method")
    def isActive = column[Boolean]("is_active")
    def * = (id, parentId, method, isActive) <> (PaymentMethod.tupled, PaymentMethod.unapply)
  }

  private class InvoicesTable(tag: Tag) extends Table[Invoice](tag, "invoices") {
    def id = column[Long]("id", O.PrimaryKey, O.AutoInc)
    def parentId = column[Long]("parent_id")
    def amount = column[Double]("amount")
    def date = column[String]("date")
    def * = (id, parentId, amount, date) <> (Invoice.tupled, Invoice.unapply)
  }

  private val parents = TableQuery[ParentsTable]
  private val paymentMethods = TableQuery[PaymentMethodsTable]
  private val invoices = TableQuery[InvoicesTable]

  def createPaymentMethod(paymentMethod: PaymentMethod): Future[Either[String, PaymentMethod]] =
    db.run((paymentMethods returning paymentMethods.map(_.id)
        into ((method, id) => method.copy(id = id))) += paymentMethod)
      .map(Right(_))
      .recover { case ex => Left(s"Failed to add payment method: ${ex.getMessage}") }

  def retrievePaymentMethods(parentId: Long): Future[Seq[PaymentMethod]] =
    db.run(paymentMethods.filter(_.parentId === parentId).result)

  def retrieveInvoices(parentId: Long): Future[Seq[Invoice]] =
    db.run(invoices.filter(_.parentId === parentId).result)

  def retrieveParentProfiles(parentId: Long): Future[Seq[ParentProfile]] =
    db.run(parents.filter(_.id === parentId).result)

  def updatePaymentMethods(updatedPaymentMethods: Seq[PaymentMethod]): Future[Seq[Int]] =
    updatedPaymentMethods
      .map(paymentMethod => paymentMethods.filter(_.id === paymentMethod.id).update(paymentMethod))
      .pipe(DBIO.sequence(_).transactionally)
      .pipe(db.run)

  def deletePaymentMethod(methodId: Long): Future[Either[String, Int]] =
    db.run(paymentMethods.filter(pm => pm.id === methodId).delete)
      .map {
        case rowsDeleted if rowsDeleted > 0 => Right(rowsDeleted)
        case _ => Left(s"Payment method with id $methodId not deleted, because it wasn't there")
      }
      .recover { case ex => Left(s"Failed to delete payment method: ${ex.getMessage}") }
}
