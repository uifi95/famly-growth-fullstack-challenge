package domain

case class ParentProfileBackend(allParentProfiles: Seq[ParentProfile], allInvoices: Seq[Invoice], allPaymentMethods: Seq[PaymentMethod]) {

  def createParentProfile(parent: String, child: String) = this.copy(allParentProfiles = allParentProfiles :+ ParentProfile(allParentProfiles.length + 1, parent, child))

  def parentProfile(id: Long) = allParentProfiles.find(_.id == id)

  def createInvoice(parentId: Int, amount: Double, date: String) = this.copy(allInvoices = allInvoices :+ Invoice(allInvoices.length + 1, parentId, amount, date))

  def invoices(id: Long) = allInvoices.filter(_.parentId == id)

  def createPaymentMethod(parentId: Int, method: String, isActive: Boolean) = this.copy(allPaymentMethods = allPaymentMethods :+ PaymentMethod(allPaymentMethods.length + 1, parentId, method, isActive))

  def deletePaymentMethod(parentId: Long, method: String) =
    this.copy(allPaymentMethods = allPaymentMethods.filterNot(pm => pm.parentId == parentId && pm.method == method))

  def paymentMethods(parentId: Long) = allPaymentMethods.filter(_.parentId == parentId).toList

  def paymentMethod(id: Long)= allPaymentMethods.find(_.id == id)

  def setActivePaymentMethod(parentId: Long, methodId: Long) =
    this.copy(allPaymentMethods = allPaymentMethods.map(paymentMethod =>
      paymentMethod.copy(isActive = paymentMethod.parentId == parentId && paymentMethod.id == methodId)))
}