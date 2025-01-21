import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import course from '@/features/courses'
import { DASHBOARD_COURSES_ROUTE } from '@/lib/routes'
import utils from '@/lib/utils'

export default async function Courses() {
  const courses = await course.services.list()

  return (
    <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
      {courses.map(({ id, image, title, price, duration, instructor }) => (
        <Card key={id}>
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
              <div className="font-semibold">
                GHS {utils.formatToMoney(price)}
              </div>
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
      ))}
    </div>
  )
}
