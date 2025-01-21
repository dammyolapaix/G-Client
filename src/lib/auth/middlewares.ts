import { z } from 'zod'

import { User } from '@/features/users/types'

import auth from '.'
import {
  UNAUTHENTICATED_ERROR_MESSAGE,
  UNAUTHORIZE_ERROR_MESSAGE,
} from '../constants'
import utils from '../utils'

type FormState<State> = {
  errors?: {
    [Key in keyof State]?: string[]
  }
  error?: string
  form?: State
}

type ValidatedActionWithUserFunction<State> = (
  state: State,
  formData: FormData,
  user: User
) => Promise<FormState<State>>

type ValidatedActionFunction<State> = (
  state: State,
  formData: FormData
) => Promise<FormState<State>>

export default class AuthMiddlewares {
  validatedAction = <Schema extends z.ZodType<State>, State>(
    schema: Schema,
    action: ValidatedActionFunction<State>
  ) => {
    return async (
      prevState: FormState<State>,
      formData: FormData
    ): Promise<FormState<State>> => {
      const form = Object.fromEntries(utils.getFormData(formData)) as State

      const result = schema.safeParse(form)

      if (!result.success) {
        return {
          form,
          errors: result.error.flatten()
            .fieldErrors as FormState<State>['errors'],
        }
      }

      return action(result.data, formData)
    }
  }

  validatedActionWithUser = <Schema extends z.ZodType<State>, State>(
    schema: Schema,
    roles: User['role'][],
    action: ValidatedActionWithUserFunction<State>
  ) => {
    return async (
      prevState: FormState<State>,
      formData: FormData
    ): Promise<FormState<State>> => {
      const authUser = await auth.utils.getAuthUser()
      if (!authUser) throw new Error(UNAUTHENTICATED_ERROR_MESSAGE)

      const isAuthorized = roles.includes(authUser.role)
      if (!isAuthorized) throw new Error(UNAUTHORIZE_ERROR_MESSAGE)

      const form = Object.fromEntries(utils.getFormData(formData)) as State

      const result = schema.safeParse(form)

      if (!result.success) {
        return {
          form,
          errors: result.error.flatten()
            .fieldErrors as FormState<State>['errors'],
        }
      }

      return action(result.data, formData, authUser)
    }
  }
}
