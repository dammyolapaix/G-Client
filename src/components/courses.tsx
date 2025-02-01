import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import course from '@/features/courses'
import { CourseWithRelationships } from '@/features/courses/types'
import utils from '@/lib/utils'

export default async function Courses() {
  const courses = await course.services.list()

  return (
    <div className="mx-auto w-10/12 py-10">
      <div className="pb-8">
        <h2 className="py-3 text-2xl font-bold md:text-3xl lg:text-4xl">
          All the skills you need in one place
        </h2>
        <p>
          From critical skills to technical topics, G-Client supports your
          professional development.
        </p>
      </div>
      {courses.length === 0 ? (
        <>No course found</>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {courses.map((course) => (
            <CourseItem key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  )
}

type CourseItemProps = {
  course: CourseWithRelationships
}

function CourseItem({
  course: { title, image, price, duration, instructor },
}: CourseItemProps) {
  return (
    <Card>
      <CardHeader className="px-0 py-0">
        <Image
          alt=""
          src={image}
          width={1000}
          height={1000}
          className="h-60 w-full"
        />
      </CardHeader>
      <CardContent className="mt-5">
        <div className="font-semibold">{title}</div>
        <div className="my-5 flex justify-between border-b">
          <div>Price</div>
          <div className="font-semibold">GHS {utils.formatToMoney(price)}</div>
        </div>
        <div className="my-5 flex justify-between border-b">
          <div>Duration</div>
          <div className="font-semibold">{duration} weeks</div>
        </div>
        <div className="my-5 flex justify-between border-b">
          <div>Instructor</div>
          <div className="font-semibold">{instructor.profile?.name}</div>
        </div>

        <Button>Purchase Course</Button>
      </CardContent>
    </Card>
  )
}
