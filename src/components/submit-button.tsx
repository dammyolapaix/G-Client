'use client'

import { ButtonHTMLAttributes } from 'react'

import { Loader2 } from 'lucide-react'
import { useFormStatus } from 'react-dom'

import { Button } from './ui/button'

type Props = {
  cta: string
  className?: string
  size?: 'default' | 'sm' | 'lg' | 'icon' | null
  disabled?: boolean
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type']
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
    | null
}

export default function SubmitButton({
  cta,
  className,
  size,
  disabled = false,
  type,
  variant,
}: Props) {
  const { pending } = useFormStatus()
  return (
    <Button
      disabled={pending || disabled}
      type={type || 'submit'}
      className={className}
      size={size}
      variant={variant || 'default'}
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {cta}
        </>
      ) : (
        cta
      )}
    </Button>
  )
}
