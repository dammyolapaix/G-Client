import { TableCell, TableRow } from '@/components/ui/table'
import ViewItems from '@/components/view-items'
import courseToLearner from '@/features/courses/coursesToLearners'
import { CourseToLearnerWithRelationships } from '@/features/courses/coursesToLearners/types'
import utils from '@/lib/utils'

export default async function Learners() {
  const learners = await courseToLearner.services.list()

  return (
    <ViewItems
      items={{
        length: learners.length,
        type: 'table',
        tableHeads: [{ name: 'Learner' }, { name: 'Course' }, { name: 'Date' }],
        tableBody: learners.map((learner) => (
          <LearnerItem
            key={`${learner.learnerId}${learner.courseId}`}
            learner={learner}
          />
        )),
      }}
    />
  )
}

type LearnerItemProps = {
  learner: CourseToLearnerWithRelationships
}

function LearnerItem({
  learner: { course, learner, date, amount },
}: LearnerItemProps) {
  return (
    <TableRow>
      <TableCell className="font-medium">{learner.profile?.name}</TableCell>
      <TableCell>{course.title}</TableCell>
      <TableCell>{learner.email}</TableCell>
      <TableCell>{date}</TableCell>
      <TableCell>{utils.formatToMoney(amount)}</TableCell>
    </TableRow>
  )
}
