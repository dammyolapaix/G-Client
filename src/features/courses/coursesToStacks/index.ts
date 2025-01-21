import CourseToStackServices from './services'
import CourseToStackValidations from './validations'

class CourseToStack {
  validations: CourseToStackValidations
  services: CourseToStackServices

  constructor() {
    this.validations = new CourseToStackValidations()
    this.services = new CourseToStackServices()
  }
}

const courseToStack = new CourseToStack()

export default courseToStack
