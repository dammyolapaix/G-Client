'use client'

import { Suspense, useEffect, useState } from 'react'

import { Combobox } from '@/components/ui/combobox'
import useQueryParams from '@/hooks/use-query-params'

type Props = {
  items: { id: string; name: string }[]
  query: string
  name: string
  defaultValue?: string
}

export default function ComboboxWithQueryParams({
  items,
  name,
  query,
  defaultValue,
}: Props) {
  const { deleteQueryParam, setQueryParam, getQueryParam } = useQueryParams()
  const queryId = getQueryParam(query) || defaultValue

  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')

  const onSelect = (currentValue: string) => {
    setValue(currentValue === value ? '' : currentValue)
    setOpen(false)

    if (currentValue === value) {
      deleteQueryParam(query)
    } else {
      setQueryParam(
        query,
        items.find(({ name }) => name.trim() === currentValue.trim())?.id || ''
      )
    }
  }

  useEffect(() => {
    setValue(items.find(({ id }) => id === queryId)?.name || '')
  }, [items, name, queryId])

  return (
    <Suspense fallback={<>Hello...</>}>
      <Combobox
        items={items.map(({ name }) => name)}
        name={name}
        onSelect={onSelect}
        open={open}
        setOpen={setOpen}
        value={value}
      />
    </Suspense>
  )
}
