import Image from 'next/image'

import { format } from 'date-fns'

import CustomFormInput from '@/components/custom-form-inputs'
import { TableCell, TableRow } from '@/components/ui/table'
import ViewItems from '@/components/view-items'
import course from '@/features/courses'
import courseToLearner from '@/features/courses/coursesToLearners'
import { CourseToLearnerWithRelationships } from '@/features/courses/coursesToLearners/types'
import utils from '@/lib/utils'

type Props = {
  searchParams: { learnerName?: string; courseId?: string }
}

export default async function Learners({
  searchParams: { learnerName, courseId },
}: Props) {
  const [learners, courses] = await Promise.all([
    courseToLearner.services.list({
      learnerName,
      courseId,
    }),
    course.services.list({ columns: { id: true, title: true } }),
  ])

  const searchFilterCourses = courses.map(({ id, title: name }) => ({
    id,
    name,
  }))

  return (
    <ViewItems
      title="Learners"
      searchFilter={<SearchFilter courses={searchFilterCourses} />}
      button={{ ctaType: 'link', cta: 'Add Learner', href: '#' }}
      items={{
        length: learners.length,
        type: 'table',
        tableHeads: [
          { name: 'Learner' },
          { name: 'Course' },
          { name: 'Amount' },
          { name: 'Date' },
        ],
        tableBody: learners.map((learner) => (
          <LearnerItem
            key={`${learner.learnerId}${learner.courseId}`}
            learner={learner}
          />
        )),
      }}
      noItemFound={{
        ctaType: 'link',
        cta: 'Add Learner',
        href: '#',
        title: 'No Learner Enrolled',
        description: 'You can add a new learner by clicking on the link below',
      }}
    />
  )
}

type LearnerItemProps = {
  learner: CourseToLearnerWithRelationships
}

function LearnerItem({ learner: { course, profile, date } }: LearnerItemProps) {
  return (
    <TableRow>
      <TableCell className="flex items-center gap-3 font-medium">
        <Image
          alt={`photo of ${profile?.name}`}
          src={profile?.image!}
          width={100}
          height={100}
          className="h-10 w-10 rounded-full"
        />
        {profile?.name}
      </TableCell>
      <TableCell>{course.title}</TableCell>
      <TableCell>GHS {utils.formatToMoney(course.price)}</TableCell>
      <TableCell>{format(date, 'PP')}</TableCell>
    </TableRow>
  )
}

type SearchFilterProps = {
  courses: { id: string; name: string }[]
}

function SearchFilter({ courses }: SearchFilterProps) {
  return (
    <div className="flex gap-5">
      <CustomFormInput
        inputType="text"
        formElement="input"
        name="learnerName"
        placeholder="Search learners..."
        isSearch
      />

      <CustomFormInput
        formElement="combobox"
        items={courses}
        query="courseId"
        name="Course"
      />
    </div>
  )
}
