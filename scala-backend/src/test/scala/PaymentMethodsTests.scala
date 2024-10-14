import domain._
import org.scalatest.freespec.AnyFreeSpec
import org.scalatest.matchers._

class PaymentMethodsTests extends AnyFreeSpec with should.Matchers {
  private val parentProfileBackend =
    ParentProfileBackend(
      allParentProfiles = Nil,
      allInvoices = Nil,
      allPaymentMethods = Nil)

  "Parent profile" - {
    "When no parent profile exists yet, there should be none" in {
      parentProfileBackend.parentProfile(1) shouldBe None
    }

    "When the first parent is created, it should be there with the id of 1, because the id's are incremented every time a parent is created" in {
      parentProfileBackend
        .createParentProfile(parent = "Alice", child = "Bob")
        .parentProfile(1) shouldBe Some(ParentProfile(id = 1, name = "Alice", child = "Bob"))
    }

    "When a parent is created, and there is a parent already, the new one should have an id of 2" in {
      parentProfileBackend
        .createParentProfile(parent = "Alice", child = "Bob")
        .createParentProfile(parent = "Charlie", child = "David")
        .parentProfile(2) shouldBe Some(ParentProfile(id = 2, name = "Charlie", child = "David"))
    }
  }

  "Invoices" - {
    "When no invoices are created yet, there should be none" in {
      parentProfileBackend
        .createParentProfile(parent = "Alice", child = "Bob")
        .invoices(1) shouldBe empty
    }

    "When the first invoice is created, it should be there with the id of 1, because the id's are incremented every time an invoice is created" in {
      parentProfileBackend
        .createParentProfile(parent = "Alice", child = "Bob")
        .createInvoice(parentId = 1, amount = 100.0, date = "2021-10-01")
        .invoices(1) should contain(Invoice(id = 1, parentId = 1, amount = 100.0, date = "2021-10-01"))
    }

    "When an invoices is created, and there is an invoice already, the new one should have an id of 2" in {
      parentProfileBackend
        .createParentProfile(parent = "Alice", child = "Bob")
        .createInvoice(parentId = 1, amount = 100.0, date = "2021-10-01")
        .createInvoice(parentId = 1, amount = 200.0, date = "2021-11-01")
        .invoices(1) should contain(Invoice(id = 2, parentId = 1, amount = 200.0, date = "2021-11-01"))
    }
  }

  "Payment methods" - {
    "When no payment methods are created yet, there should be none" in {
      parentProfileBackend.paymentMethods(1) shouldBe empty
    }

    "When the first payment method is created, it should be there with the id of 1, because the id's are incremented every time a payment method is created" in {
      parentProfileBackend
        .createParentProfile(parent = "Alice", child = "Bob")
        .createPaymentMethod(parentId = 1, method = "Credit Card", isActive = true)
        .paymentMethods(1) should contain(PaymentMethod(id = 1, parentId = 1, method = "Credit Card", isActive = true))
    }

    "When a payment method is created, and there is a payment method already, the new one should have an id of 2" in {
      parentProfileBackend
        .createParentProfile(parent = "Alice", child = "Bob")
        .createPaymentMethod(parentId = 1, method = "Credit Card", isActive = false)
        .createPaymentMethod(parentId = 1, method = "Debit Card", isActive = true)
        .paymentMethods(1) should contain(PaymentMethod(id = 2, parentId = 1, method = "Debit Card", isActive = true))
    }

    "When a payment method is deleted it should go away, because we don't want to keep payment methods around due to privacy concerns" in {
      parentProfileBackend
        .createParentProfile(parent = "Alice", child = "Bob")
        .createPaymentMethod(parentId = 1, method = "Credit Card", isActive = true)
        .deletePaymentMethod(parentId = 1, method = "Credit Card")
        .paymentMethods(1) should (not contain(PaymentMethod(id = 1, parentId = 1, method = "Credit Card", isActive = true)))
    }

    "When setting a payment method active, it should deactivate the current active one and activate the new one, so that we don't have multiple active payment methods" in {
      parentProfileBackend
        .createParentProfile(parent = "Alice", child = "Bob")
        .createPaymentMethod(parentId = 1, method = "Credit Card", isActive = false)
        .createPaymentMethod(parentId = 1, method = "Debit Card", isActive = true)
        .setActivePaymentMethod(parentId = 1, methodId = 1)
        .paymentMethods(1) should contain(PaymentMethod(id = 1, parentId = 1, method = "Credit Card", isActive = true))
    }

    "When a payment method is added, we should be able to get it by id, so what we can show the newly added payment method" in {
      parentProfileBackend
        .createParentProfile(parent = "Alice", child = "Bob")
        .createParentProfile(parent = "Charlie", child = "David")
        .createPaymentMethod(parentId = 2, method = "Credit Card", isActive = true)
        .paymentMethod(1) shouldBe Some(PaymentMethod(id = 1, parentId = 2, method = "Credit Card", isActive = true))
    }
  }
}
