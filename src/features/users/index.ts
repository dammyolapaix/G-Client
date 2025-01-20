import UserServices from './services'

class User {
  services: UserServices

  constructor() {
    this.services = new UserServices()
  }
}

const user = new User()

export default user
