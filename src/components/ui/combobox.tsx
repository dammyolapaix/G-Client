'use client'

import { Dispatch, SetStateAction } from 'react'

import { Check, ChevronsUpDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

type ObjectItem = {
  value: string
  label: string
}

type Props = {
  items: string[] | ObjectItem[]
  name?: string
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  value: string
  onSelect: (currentValue: string) => void
}

export function Combobox({
  items,
  name,
  onSelect,
  open,
  value,
  setOpen,
}: Props) {
  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? typeof items[0] === 'string'
              ? (items.find((item) => item === value) as string)
              : (items as ObjectItem[]).find((item) => item.value === value)
                  ?.label
            : `Select ${name}...`}

          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={`Search ${name}...`} />
          <CommandList>
            <CommandEmpty>{`No ${name} found.`}</CommandEmpty>
            <CommandGroup>
              {typeof items[0] === 'string'
                ? items.map((item) => (
                    <CommandItem
                      key={item as string}
                      value={item as string}
                      onSelect={onSelect}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          value === item ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      {item as string}
                    </CommandItem>
                  ))
                : items.map((item) => (
                    <CommandItem
                      key={(item as ObjectItem).value}
                      value={(item as ObjectItem).value}
                      onSelect={onSelect}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          value === (item as ObjectItem).value
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                      {(item as ObjectItem).label}
                    </CommandItem>
                  ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
