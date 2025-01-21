import course from '@/features/courses'

export default async function Courses() {
  const courses = await course.services.list()

  console.log(courses)
  return <div>courses</div>
}
