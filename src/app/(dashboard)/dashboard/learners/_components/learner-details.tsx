import Image from 'next/image'

import { Eye } from 'lucide-react'

import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from '@/components/ui/sheet'
import { CourseToLearnerWithRelationships } from '@/features/courses/coursesToLearners/types'

type Props = {
  learner: CourseToLearnerWithRelationships
}

export default function LearnerDetails({
  learner: { profile, user, course },
}: Props) {
  const learnerDetails = [
    { name: 'Program', value: course.title },
    { name: 'Contact', value: profile.phone },
    { name: 'Contact', value: profile.location },
    { name: 'Bio', value: profile.bio },
  ]

  return (
    <Sheet>
      <SheetTrigger>
        <Eye className="text-primary" />
      </SheetTrigger>
      <SheetContent className="px-0 pt-0 text-sm">
        <SheetHeader className="h-1/5 bg-primary px-0"></SheetHeader>
        <div className="-mt-20 flex items-center justify-center">
          <div>
            <Image
              alt={`photo of ${profile?.name}`}
              src={profile.image!}
              width={100}
              height={100}
              className="h-[10rem] w-[10rem] rounded-full"
            />
            <div className="py-3 text-center font-semibold">
              <div className="py-1">{profile.name}</div>
              <div className="py-1">{user.email}</div>
            </div>
          </div>
        </div>
        <div className="px-5">
          <Separator />
          <div className="py-5">
            {learnerDetails.map(({ name, value }) => (
              <div key={name} className="my-5 grid grid-cols-3 gap-10">
                <div className="col-span-1 capitalize">{name}</div>
                <div className="col-span-2 font-bold">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
