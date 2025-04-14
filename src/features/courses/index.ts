import CourseServices from './services'
import CourseValidations from './validations'

class Course {
  validations: CourseValidations
  services: CourseServices

  constructor() {
    this.validations = new CourseValidations()
    this.services = new CourseServices()
  }
}

const course = new Course()

export default course
