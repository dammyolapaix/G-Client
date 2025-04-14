import Auth from './auth'
import UserServices from './services'

class User {
  auth: Auth
  services: UserServices

  constructor() {
    this.auth = new Auth()
    this.services = new UserServices()
  }
}

const user = new User()

export default user
