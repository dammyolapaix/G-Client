'use client'

import {
  ChangeEvent,
  HTMLAttributes,
  HTMLInputTypeAttribute,
  useEffect,
  useState,
} from 'react'

import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useDebouncedCallback } from 'use-debounce'

import ComboboxWithQueryParams from '@/components/combobox-with-query-params'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PhoneInput } from '@/components/ui/phone-input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import useQueryParams from '@/hooks/use-query-params'
import { cn } from '@/lib/utils'

type FormElementType =
  | 'input'
  | 'textarea'
  | 'button'
  | 'fieldset'
  | 'legend'
  | 'datalist'
  | 'output'
  | 'option'
  | 'optgroup'

type ComboboxType = {
  formElement: 'combobox'
  items: { id: string; name: string }[]
  query: string
  defaultValue?: HTMLAttributes<HTMLInputElement>['defaultValue']
}

type SelectFormElementType = {
  formElement: 'select'
  selectItems: string[]
  selectValue?: string
  selectOnValueChange?: (value: string) => void
  isQuery?: true
}

type InputFormElementType = {
  formElement: FormElementType
  inputType: HTMLInputTypeAttribute
  defaultValue?: HTMLAttributes<HTMLInputElement>['defaultValue']
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  isSearch?: true
}

type CustomFormFieldProps = {
  name: string
  label?: string
  placeholder?: string
  disabled?: boolean
  required?: true
  errors?: string[]
  isSinglePage?: boolean
  description?: string
} & (SelectFormElementType | InputFormElementType | ComboboxType)

function InputField(props: CustomFormFieldProps) {
  const { formElement, name, disabled, placeholder, required, isSinglePage } =
    props

  const { getQueryParam, setQueryParam, deleteQueryParam } = useQueryParams()

  let queryId: string | undefined | null = null

  if (formElement === 'combobox') {
    queryId = getQueryParam(props.query)
  } else {
    queryId = getQueryParam(name)
  }

  const [date, setDate] = useState<Date>()

  const handleSearch = useDebouncedCallback((term: string) => {
    if (term) {
      setQueryParam(name, term)
    } else {
      deleteQueryParam(name)
    }
  }, 300)

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleSearch(e.target.value)
  }

  const [selectValue, setSelectValue] = useState(queryId || undefined)

  const onSelectValueChange = (currentSelectValue: string) => {
    setSelectValue(currentSelectValue === selectValue ? '' : currentSelectValue)

    if (currentSelectValue === selectValue) {
      deleteQueryParam(name)
    } else {
      setQueryParam(name, currentSelectValue)
    }
  }

  useEffect(() => {
    if (
      props.formElement === 'input' &&
      props.inputType === 'date' &&
      props.defaultValue
    ) {
      setDate(new Date(props.defaultValue as string))
    }
  }, [props])

  switch (formElement) {
    case 'input':
      switch (props.inputType) {
        case 'tel':
          return (
            <PhoneInput
              defaultCountry="GH"
              disabled={disabled}
              id={name}
              placeholder={placeholder}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              value={props.defaultValue || undefined}
              name={name}
              international
              required={required}
            />
          )

        case 'date':
          return (
            <>
              {!isSinglePage && (
                <Popover modal={true}>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !date && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}

              <Input
                type="text"
                name={name}
                value={
                  isSinglePage
                    ? format(props.defaultValue as string, 'PPP')
                    : date?.toISOString().split('T')[0] || undefined
                }
                disabled={isSinglePage ? true : undefined}
                className={`${!isSinglePage ? 'hidden' : ''}`}
              />
            </>
          )

        default:
          break
      }

      return (
        <Input
          type={props.inputType}
          name={name}
          disabled={disabled}
          id={name}
          placeholder={placeholder}
          defaultValue={
            props.isSearch
              ? (queryId as string)?.toString() || undefined
              : props.defaultValue || undefined
          }
          min={props.inputType === 'number' ? 0 : undefined}
          required={required}
          onChange={props.isSearch ? onChange : props.onChange}
        />
      )

    case 'select':
      return (
        <Select
          name={name}
          required={required}
          value={props.isQuery ? selectValue : props.selectValue}
          onValueChange={
            props.isQuery ? onSelectValueChange : props.selectOnValueChange
          }
          disabled={disabled}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {props.selectItems.map((item) => (
              <SelectItem value={item} key={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )

    case 'combobox':
      return (
        <>
          {!isSinglePage && (
            <ComboboxWithQueryParams
              items={props.items}
              query={props.query}
              name={props.name}
              defaultValue={props.defaultValue as string | undefined}
            />
          )}
          <Input
            type="text"
            name={props.query}
            defaultValue={props.defaultValue || queryId || undefined}
            disabled={isSinglePage ? true : undefined}
            className={`${!isSinglePage ? 'hidden' : ''}`}
          />
        </>
      )

    case 'textarea':
      return (
        <Textarea
          name={name}
          disabled={disabled}
          id={name}
          placeholder={placeholder}
          defaultValue={props.defaultValue || undefined}
          required={required}
        />
      )

    default:
      break
  }
}

function ErrorMessage({ errors }: { errors?: CustomFormFieldProps['errors'] }) {
  return (
    <>
      {errors &&
        errors.map((error, index) => (
          <p key={index} className="text-destructive text-sm font-medium">
            {error}
          </p>
        ))}
    </>
  )
}

export default function CustomFormInput(props: CustomFormFieldProps) {
  const { name, required, label, errors, formElement, description } = props

  return (
    <div className="grid w-full items-center gap-1.5">
      {((formElement !== 'select' &&
        formElement !== 'combobox' &&
        props.inputType !== 'checkbox') ||
        formElement === 'select' ||
        formElement === 'combobox') &&
        label && (
          <Label htmlFor={name}>
            {label} {required && '*'}
          </Label>
        )}

      <InputField {...props} />
      {description && (
        <p className="text-muted-foreground text-sm">{description}</p>
      )}

      <ErrorMessage errors={errors} />
    </div>
  )
}
