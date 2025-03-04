import CoursePaymentServices from './services'

class CoursePayment {
  services: CoursePaymentServices

  constructor() {
    this.services = new CoursePaymentServices()
  }
}

const coursePayment = new CoursePayment()

export default coursePayment
