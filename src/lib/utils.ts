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

  removeEmptyStringFromFormData = (formData: FormData) => {
    const filteredFormData = new FormData()

    // Convert the FormData entries to an array for compatibility
    const entries = Array.from(formData.entries())

    for (const [key, value] of entries) {
      // Include NextJs Form action payload
      if (key.includes('$ACTION')) filteredFormData.append(key, value)

      // Check if the value is a non-empty string
      if (
        !key.includes('$ACTION') &&
        typeof value === 'string' &&
        value.trim() !== ''
      )
        filteredFormData.append(key, value)
    }
    return filteredFormData
  }
}

const utils = new Utils()

export default utils
