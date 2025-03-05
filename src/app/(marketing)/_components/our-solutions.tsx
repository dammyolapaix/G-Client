import Image from 'next/image'

export default function OurSolutions() {
  const solutions = [
    {
      name: 'Software Development',
      description:
        'Unlock your potential with comprehensive training in modern software development, from coding fundamentals to building complex applications.',
      icon: '/icons/software-development.svg',
      price: 'GHS 350',
    },
    {
      name: 'Data Science Mastery',
      description:
        'Equip yourself with the skills to analyze, interpret, and leverage data, becoming an expert in machine learning, AI, and data-driven decision-making.',
      icon: '/icons/data-science.svg',
      price: 'GHS 300',
    },
    {
      name: 'Cloud Computing Expertise',
      description:
        'Gain hands-on experience in cloud architecture and deployment, preparing you to design, implement, and manage scalable cloud solutions in the real world.',
      icon: '/icons/cloud.svg',
      price: 'GHS 300',
    },
  ]

  return (
    <section className="my-20">
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-bold md:text-4xl">Our solutions</h2>
        <p>
          Create your account quickly with just your email or social media
          login, then explore a wide range{' '}
        </p>
      </div>

      <div className="mx-auto grid w-10/12 grid-cols-1 gap-10 md:grid-cols-3">
        {solutions.map((solution) => (
          <SolutionItem key={solution.name} solution={solution} />
        ))}
      </div>
    </section>
  )
}

type SolutionItemProps = {
  name: string
  description: string
  icon: string
  price: string
}

function SolutionItem({
  solution: { description, icon, name, price },
}: {
  solution: SolutionItemProps
}) {
  return (
    <div className="rounded-md p-5 shadow-xl hover:shadow-2xl">
      <Image src={icon} alt="" width={100} height={100} className="h-20 w-20" />

      <h3 className="my-5 font-bold md:text-xl">{name}</h3>

      <p className="my-5">{description}</p>

      <div>
        Price: <span className="font-bold">{price}</span>
      </div>
    </div>
  )
}
