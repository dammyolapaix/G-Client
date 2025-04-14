import AuthMiddlewares from './middlewares'
import AuthUtils from './utils'

class Auth {
  utils: AuthUtils
  middlewares: AuthMiddlewares

  constructor() {
    this.utils = new AuthUtils()
    this.middlewares = new AuthMiddlewares()
  }
}

const auth = new Auth()

export default auth
