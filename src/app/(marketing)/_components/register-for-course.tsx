import Image from 'next/image'

export default function RegisterForCourse() {
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
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="flex gap-3 lg:col-span-4">
          <div className="">
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
        <div className="lg:col-span-8">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repudiandae,
          voluptatum quibusdam. Voluptatem suscipit maiores debitis veniam?
          Architecto, eius! Delectus fugit voluptate iusto odio enim. Assumenda
          dolorem reiciendis ut velit doloremque!
        </div>
      </div>
    </div>
  )
}
