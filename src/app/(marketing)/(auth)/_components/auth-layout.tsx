import Image from 'next/image'
import { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export default function AuthLayout({ children }: Props) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden bg-muted lg:block">
        <Image
          src="/black-female-image-studying.jpg"
          width={600}
          height={450}
          alt="African marketplace products"
          priority
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="mx-auto w-full md:w-1/2">{children}</div>
        </div>
      </div>
    </div>
  )
}
