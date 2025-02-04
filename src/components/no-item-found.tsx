import Link from 'next/link'

import { PlusCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { NoItemFoundProps } from '@/types'

export default function NoItemFound(props: NoItemFoundProps) {
  const { description, title, ctaType, className } = props
  return (
    <div
      className={`flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm ${className || ''}`}
    >
      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="text-2xl font-bold tracking-tight">
          {title || 'No item found'}
        </h3>
        <p className="text-sm text-muted-foreground">
          {description || 'Consider adding new items'}
        </p>

        {ctaType === 'link' && (
          <Button className="mt-4 gap-1" asChild>
            <Link href={props.href}>
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                {props.cta}
              </span>
            </Link>
          </Button>
        )}

        {ctaType === 'modal' && props.cta}

        {ctaType === 'none' && <></>}
      </div>
    </div>
  )
}
