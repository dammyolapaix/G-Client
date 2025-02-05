import Image from 'next/image'
import Link from 'next/link'

import CustomFormInput from '@/components/custom-form-inputs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import ViewItems from '@/components/view-items'
import course from '@/features/courses'
import { CourseWithRelationships } from '@/features/courses/types'
import {
  DASHBOARD_COURSES_CREATE_ROUTE,
  DASHBOARD_COURSES_ROUTE,
} from '@/lib/routes'
import utils from '@/lib/utils'

export default async function Courses() {
  const courses = await course.services.list()

  return (
    <>
      <ViewItems
        title="Courses"
        searchFilter={<SearchFilter />}
        button={{
          ctaType: 'link',
          cta: 'Add Course',
          href: DASHBOARD_COURSES_CREATE_ROUTE,
        }}
        items={{
          length: courses.length,
          type: 'card',
          content: (
            <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
              {courses.map((course) => (
                <CourseItem key={course.id} course={course}></CourseItem>
              ))}
            </div>
          ),
        }}
        noItemFound={{
          ctaType: 'link',
          cta: 'Add Course',
          href: DASHBOARD_COURSES_CREATE_ROUTE,
          title: 'No course found',
          description: 'You can add a new course by clicking on the link below',
        }}
      />
    </>
  )
}

type CourseItemProps = {
  course: CourseWithRelationships
}

function CourseItem({
  course: { id, image, title, price, duration, instructor },
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

        <Button asChild>
          <Link href={`${DASHBOARD_COURSES_ROUTE}/${id}`}>View more</Link>
        </Button>
      </CardContent>
    </Card>
  )
}

function SearchFilter() {
  return (
    <div className="w-1/5">
      <CustomFormInput
        inputType="text"
        formElement="input"
        name="title"
        placeholder="Search courses..."
        isSearch
      />
    </div>
  )
}
