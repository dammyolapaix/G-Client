import InvoiceServices from './services'
import InvoiceValidations from './validations'

class Invoice {
  services: InvoiceServices
  validations: InvoiceValidations

  constructor() {
    this.services = new InvoiceServices()
    this.validations = new InvoiceValidations()
  }
}

const invoice = new Invoice()

export default invoice
