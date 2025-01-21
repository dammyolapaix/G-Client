import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

class Utils {
  slugify = (string: string) =>
    string
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric characters
      .trim()
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Collapse multiple hyphens into one

  getFormData = (formData: FormData) => {
    const filteredFormData = new FormData()

    // Convert the FormData entries to an array for compatibility
    const entries = Array.from(formData.entries())

    for (const [key, value] of entries) {
      // Check if the value is a non-empty string
      // Remove NextJs Form action payload
      if (
        !key.includes('$ACTION') &&
        typeof value === 'string' &&
        value.trim() !== ''
      )
        filteredFormData.append(key, value)
    }
    return filteredFormData
  }

  formatToMoney = (amount: number): string => {
    // Convert the amount to a decimal string and format it to two decimal places
    const formattedAmount = (amount / 100).toFixed(2)

    // Split the integer and decimal parts
    const [integerPart, decimalPart] = formattedAmount.split('.')

    // Format the integer part with thousands separators
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

    // Combine them back with a comma as the decimal separator
    return `${formattedInteger}.${decimalPart}`
  }
}

const utils = new Utils()

export default utils
