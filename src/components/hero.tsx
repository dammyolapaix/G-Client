import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { LOGIN_ROUTE } from '@/lib/routes'

import computerImage from '../../public/computer.png'

export default function Hero() {
  return (
    <div className="flex min-h-[700px] flex-col items-center justify-center bg-primary text-primary-foreground">
      <div className="mx-auto grid w-10/12 grid-cols-1 gap-10 md:grid-cols-2">
        <div className="md:order-2">
          <Image
            alt="computer image"
            src={computerImage}
            width={500}
            height={500}
            className="h-full w-full"
          />
        </div>
        <div className="flex flex-col justify-center md:order-1">
          <h1 className="text-2xl font-bold md:text-3xl lg:text-4xl">
            Unlock Your Potential with Industry-Leading Courses!
          </h1>
          <p className="my-5 font-light">
            Join thousands of learners gaining real-world skills and advancing
            their careers. Our expert-led courses are designed to empower you to
            succeed.
          </p>
          <div className="inline-block">
            <Button variant="outline" asChild>
              <Link href={LOGIN_ROUTE}>Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
