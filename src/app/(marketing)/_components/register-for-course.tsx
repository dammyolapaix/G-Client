import Image from 'next/image'

import course from '@/features/courses'
import { UserWithRelationships } from '@/features/users/types'
import auth from '@/lib/auth'
import { INTERNAL_ERROR_MESSAGE } from '@/lib/constants'

import { RegisterForm } from '../(auth)/_components/register-form'
import RegisterCourseForm from './register-course-form'

export default async function RegisterForCourse() {
  const [authUser, courses] = await Promise.all([
    auth.utils.getAuthUser({ with: { profile: true } }),
    course.services.list(),
  ])

  if (!courses) throw new Error(INTERNAL_ERROR_MESSAGE)

  const steps = [
    {
      title: 'Sign Up and Choose Your Course',
      description:
        'Create your account quickly with just your email or social media login, then explore a wide range ',
    },
    {
      title: 'Onboarding',
      description:
        'Create your account quickly with just your email or social media login, then explore a wide range ',
    },
    {
      title: 'Start Learning',
      description:
        'Create your account quickly with just your email or social media login, then explore a wide range ',
    },
  ]

  return (
    <div className="mx-auto my-20 w-10/12">
      <div className="grid gap-20 lg:grid-cols-12">
        <div className="flex gap-3 lg:col-span-5">
          <div className="hidden lg:block">
            <Image
              src={'/step.png'}
              alt=""
              width={50}
              height={100}
              className="h-auto w-auto"
            />
          </div>
          <div>
            {steps.map(({ description, title }) => (
              <div key={title} className="mb-10">
                <h3 className="mb-3 font-bold">{title}</h3>
                <p>{description}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-7">
          {authUser ? (
            <RegisterCourseForm
              authUser={authUser as UserWithRelationships}
              courses={courses}
            />
          ) : (
            <RegisterForm />
          )}
        </div>
      </div>
    </div>
  )
}
