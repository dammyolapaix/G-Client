import CourseToLearnerServices from './services'

class CourseToLearner {
  services: CourseToLearnerServices

  constructor() {
    this.services = new CourseToLearnerServices()
  }
}

const courseToLearner = new CourseToLearner()

export default courseToLearner
