import InvoiceServices from './services'

class Invoice {
  services: InvoiceServices

  constructor() {
    this.services = new InvoiceServices()
  }
}

const invoice = new Invoice()

export default invoice
