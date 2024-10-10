package api

import scala.concurrent.ExecutionContext
import scala.util.chaining._

import domain._
import repository.ProfileRepository
import sangria.schema._
import sangria.macros.derive._

object GraphQLSchema {

  implicit val PaymentMethodType: ObjectType[Unit, PaymentMethod] = deriveObjectType[Unit, PaymentMethod]()
  implicit val InvoiceType: ObjectType[Unit, Invoice] = deriveObjectType[Unit, Invoice]()
  implicit val ParentProfileType: ObjectType[Unit, ParentProfile] = deriveObjectType[Unit, ParentProfile]()

  def QueryType(implicit ec: ExecutionContext) = ObjectType(
    "Query",
    fields[ProfileRepository, Unit](
      Field("parentProfile", OptionType(ParentProfileType), 
        arguments = Argument("parentId", LongType) :: Nil,
        resolve = ctx => ctx.arg[Long]("parentId").pipe(parentId =>
          ctx.ctx.retrieveParentProfiles(parentId).map(ParentProfileBackend(_, Nil, Nil).parentProfile(parentId)))
      ),
      Field("paymentMethods", ListType(PaymentMethodType),
        arguments = Argument("parentId", LongType) :: Nil,
        resolve = ctx => ctx.arg[Long]("parentId").pipe(parentId =>
          ctx.ctx.retrievePaymentMethods(parentId).map(ParentProfileBackend(Nil, Nil, _).paymentMethods(parentId)))
      ),
      Field("invoices", ListType(InvoiceType),
        arguments = Argument("parentId", LongType) :: Nil,
        resolve = ctx => ctx.arg[Long]("parentId").pipe(parentId =>
          ctx.ctx.retrieveInvoices(parentId).map(ParentProfileBackend(Nil, _, Nil).invoices(parentId)))
      )
    )
  )

  def MutationType(implicit ec: ExecutionContext) = ObjectType(
    "Mutation",
    fields[ProfileRepository, Unit](
      Field("addPaymentMethod", OptionType(PaymentMethodType),
        arguments = Argument("parentId", LongType) :: Argument("method", StringType) :: Nil,
        resolve = ctx => (ctx.arg[Long]("parentId"), ctx.arg[String]("method")).pipe {
          case (parentId, method) =>
            ctx.ctx.createPaymentMethod(PaymentMethod(0, parentId, method, isActive = false))
              .map(_.map(paymentMethod => ParentProfileBackend(Nil, Nil, Seq(paymentMethod)).paymentMethod(paymentMethod.id)))
        }.map(_.toOption.flatten)
      ),
      Field("setActivePaymentMethod", OptionType(PaymentMethodType),
        arguments = Argument("parentId", LongType) :: Argument("methodId", LongType) :: Nil,
        resolve = ctx =>
          (ctx.arg[Long]("parentId"), ctx.arg[Long]("methodId")).pipe {
            case (parentId, method) =>
              ctx.ctx.retrievePaymentMethods(parentId)
                .map(ParentProfileBackend(Nil, Nil, _).setActivePaymentMethod(parentId, method))
                .flatMap(parentProfileBackend => ctx.ctx.updatePaymentMethods(parentProfileBackend.allPaymentMethods).map(_ => parentProfileBackend.paymentMethod(method)))
          }
      ),
      Field("deletePaymentMethod", BooleanType,
        arguments = Argument("parentId", LongType) :: Argument("method", StringType) :: Nil,
        resolve = ctx =>
          (ctx.arg[Long]("parentId"), ctx.arg[String]("method")).pipe {
              case (parentId, method) =>
                ctx.ctx.retrievePaymentMethods(parentId).map { paymentMethods =>
                  ParentProfileBackend(Nil, Nil, paymentMethods).pipe { initialParentProfileBackend =>
                    val parentProfileBackend = initialParentProfileBackend.deletePaymentMethod(parentId, method)

                    (initialParentProfileBackend.allPaymentMethods.toSet -- parentProfileBackend.allPaymentMethods).map(paymentMethod => ctx.ctx.deletePaymentMethod(paymentMethod.id))
                  }
                }
            }.map(_ => true)
      )
    )
  )

  def schema(implicit ec: ExecutionContext): Schema[ProfileRepository, Unit] = Schema(QueryType, Some(MutationType))
}
