import AuthValidations from './validations'

export default class Auth {
  validations: AuthValidations

  constructor() {
    this.validations = new AuthValidations()
  }
}
