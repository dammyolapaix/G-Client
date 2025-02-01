import Image from 'next/image'

import { Button } from '@/components/ui/button'

import computerImage from '../../public/computer.png'

export default function Hero() {
  return (
    <div className="h-[500px] bg-primary text-primary-foreground">
      <div className="flex h-full flex-col justify-center">
        <div className="container mx-auto grid grid-cols-1 gap-10 md:grid-cols-2">
          <div className="flex w-2/3 flex-col justify-center">
            <h1 className="text-2xl font-bold md:text-3xl lg:text-4xl">
              Unlock Your Potential with Industry-Leading Courses!
            </h1>
            <p className="my-5 font-light">
              Join thousands of learners gaining real-world skills and advancing
              their careers. Our expert-led courses are designed to empower you
              to succeed.
            </p>
            <div className="inline-block">
              <Button variant="outline">Get Started</Button>
            </div>
          </div>
          <div className="mx-auto h-5/6 w-4/6">
            <Image
              alt="computer image"
              src={computerImage}
              width={500}
              height={500}
              className="h-full w-full"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
