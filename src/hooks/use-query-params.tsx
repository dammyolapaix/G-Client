'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export default function useQueryParams() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const getQueryParam = (param: string): string | null => {
    return searchParams.get(param)
  }

  const getQueryParams = (param: string): string[] => {
    return searchParams.getAll(param)
  }

  const setQueryParam = (param: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    params.set(param, value)
    replace(`${pathname}?${params.toString()}`)
  }

  const setQueryParams = (param: string, values: string[]) => {
    const params = new URLSearchParams(searchParams)
    params.delete(param)
    values.forEach((value) => params.append(param, value))
    replace(`${pathname}?${params.toString()}`)
  }

  const deleteQueryParam = (param: string) => {
    const params = new URLSearchParams(searchParams)
    params.delete(param)
    replace(`${pathname}?${params.toString()}`)
  }

  return {
    getQueryParam,
    getQueryParams,
    setQueryParam,
    setQueryParams,
    deleteQueryParam,
  }
}
