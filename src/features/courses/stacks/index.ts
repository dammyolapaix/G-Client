import StackServices from './services'
import StackValidations from './validations'

class Stack {
  validations: StackValidations
  services: StackServices

  constructor() {
    this.validations = new StackValidations()
    this.services = new StackServices()
  }
}

const stack = new Stack()

export default stack
