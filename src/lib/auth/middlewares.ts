import { z } from 'zod'

import { User } from '@/features/users/types'

import auth from '.'
import utils from '../utils'

type FormState<State> = {
  errors?: {
    [Key in keyof State]?: string[]
  }
  error?: string
}

type ValidatedActionWithUserFunction<State> = (
  state: State,
  formData: FormData,
  user: User
) => Promise<FormState<State>>

export default class AuthMiddlewares {
  validatedActionWithUser = <Schema extends z.ZodType<State>, State>(
    schema: Schema,
    action: ValidatedActionWithUserFunction<State>
  ) => {
    return async (
      prevState: FormState<State>,
      formData: FormData
    ): Promise<FormState<State>> => {
      const authUser = await auth.utils.getAuthUser()
      if (!authUser) throw new Error('User is not authenticated')

      const result = schema.safeParse(
        Object.fromEntries(utils.removeEmptyStringFromFormData(formData))
      )

      if (!result.success) {
        return {
          errors: result.error.flatten()
            .fieldErrors as FormState<State>['errors'],
        }
      }

      return action(result.data, formData, authUser)
    }
  }
}
