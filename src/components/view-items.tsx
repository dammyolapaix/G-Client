import Link, { LinkProps } from 'next/link'
import React, { ReactNode } from 'react'

import { PlusCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { NoItemFoundProps } from '@/types'

import NoItemFound from './no-item-found'

type Props = {
  button?: LinkButton | ModalButton
  searchFilter?: ReactNode
  items: {
    length: number
  } & (CardItem | TableItemProps)
  noItemFound?: NoItemFoundProps
}

type CardItem = {
  type: 'card'
  content: React.ReactNode
}

type TableItemProps = {
  type: 'table'
  tableHeads: {
    name: string
    className?: string
    srOnly?: true
  }[]
  tableBody: React.ReactNode
}

type LinkButton = {
  ctaType: 'link'
  cta: string
  href: LinkProps<string>['href']
}

type ModalButton = {
  ctaType: 'modal'
  cta: React.ReactNode
}

export default function ViewItems(props: Props) {
  const { button, items, searchFilter, noItemFound } = props

  return (
    <>
      <div className="flex items-center justify-between gap-5">
        {searchFilter}

        {button && (
          <div className="ml-auto flex items-center gap-2">
            {button.ctaType === 'link' ? (
              <Button className="gap-1" asChild>
                <Link href={button.href}>
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    {button.cta}
                  </span>
                </Link>
              </Button>
            ) : (
              button.cta
            )}
          </div>
        )}
      </div>

      {items.length === 0 ? (
        noItemFound ? (
          <NoItemFound {...noItemFound} />
        ) : (
          <NoItemFound ctaType="none" title="You have no item" />
        )
      ) : (
        <>
          {items.type === 'table' && (
            <Card>
              <CardContent>
                <TableItem
                  tableBody={items.tableBody}
                  tableHeads={items.tableHeads}
                />
              </CardContent>
            </Card>
          )}
          {items.type === 'card' && <>{items.content}</>}
        </>
      )}
    </>
  )
}

function TableItem({ tableBody, tableHeads }: Omit<TableItemProps, 'type'>) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {tableHeads
            .filter(({ srOnly }) => srOnly === undefined)
            .map(({ name, className }, index) => (
              <TableHead key={index} className={className}>
                {name}
              </TableHead>
            ))}

          {tableHeads
            .filter(({ srOnly }) => srOnly === true)
            .map(({ name }, index) => (
              <TableHead key={index} className="sr-only">
                <span className="sr-only">{name}</span>
              </TableHead>
            ))}
        </TableRow>
      </TableHeader>
      <TableBody>{tableBody}</TableBody>
    </Table>
  )
}
