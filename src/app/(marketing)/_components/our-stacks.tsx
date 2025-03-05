export default function OurStacks() {
  const stacks = [
    {
      name: 'ReactJs',
      borderColor: 'border-white',
    },
    {
      name: 'NextJs',
      borderColor: 'border-[#28ACE2]',
    },
    {
      name: 'NodeJs',
      borderColor: 'border-[#77C053]',
    },
    {
      name: 'Django',
      borderColor: 'border-[#A61D24]',
    },
    {
      name: 'MongoDB',
      borderColor: 'border-[#D89614]',
    },
    {
      name: 'VueJs',
      borderColor: 'border-[#999999]',
    },
    {
      name: 'PowerBI',
      borderColor: 'border-white',
    },
    {
      name: 'Python',
      borderColor: 'border-[#28ACE2]',
    },
    {
      name: 'Excel',
      borderColor: 'border-[#77C053]',
    },
    {
      name: 'Tableau',
      borderColor: 'border-[#A61D24]',
    },
    {
      name: 'AWS',
      borderColor: 'border-[#D89614]',
    },
    {
      name: 'Azure',
      borderColor: 'border-[#999999]',
    },
  ]

  return (
    <section className="bg-primary py-20 text-primary-foreground">
      <div className="mx-auto mb-10 w-1/3 text-center">
        <h2 className="my-5 text-2xl font-bold md:text-4xl">
          What will be next step
        </h2>
        <p>
          Discover our diverse stack of solutions, including software
          development, data science, and cloud tools. Sign up today and
          kickstart your journey!
        </p>
      </div>

      <div className="mx-auto flex w-2/5 flex-wrap gap-5">
        {stacks.map((stack) => (
          <StackItem key={stack.name} stack={stack} />
        ))}
      </div>
    </section>
  )
}

type StackItemProps = {
  name: string
  borderColor: string
}

function StackItem({
  stack: { borderColor, name },
}: {
  stack: StackItemProps
}) {
  return (
    <div className={`rounded-md border px-5 py-3 ${borderColor}`}>{name}</div>
  )
}
