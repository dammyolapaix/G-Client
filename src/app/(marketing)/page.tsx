import Hero from '@/components/hero'

import OurSolutions from './_components/our-solutions'
import OurStacks from './_components/our-stacks'
import RegisterForCourse from './_components/register-for-course'

export default function Home() {
  return (
    <main>
      <Hero />
      <OurSolutions />
      <OurStacks />
      <RegisterForCourse />
    </main>
  )
}
