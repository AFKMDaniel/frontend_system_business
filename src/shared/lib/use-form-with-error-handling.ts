import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import type {
  FieldValues,
  Path,
  SubmitErrorHandler,
  SubmitHandler,
  UseFormProps,
  UseFormReturn,
  UseFormSetError,
} from 'react-hook-form'
import { toast } from 'sonner'

import { isValidationError } from '@/shared/api/error'

interface UseFormWithErrorHandlingOptions<
  TFieldValues extends FieldValues,
  TContext,
> extends UseFormProps<TFieldValues, TContext> {
  fallback?: string
}

function extractMessage(error: unknown, fallback: string): string {
  if (typeof error === 'string' && error.trim()) return error

  if (typeof error === 'object' && error !== null && 'message' in error) {
    const message = (error as { message: unknown }).message
    if (typeof message === 'string' && message.trim()) return message
  }

  return fallback
}

function setServerError<TFieldValues extends FieldValues>(
  setError: UseFormSetError<TFieldValues>,
  field: string,
  message: string,
) {
  setError(field as Path<TFieldValues>, { type: 'server', message })
}

export function useFormWithErrorHandling<TFieldValues extends FieldValues, TContext = any>({
  fallback = 'Something went wrong',
  ...formOptions
}: UseFormWithErrorHandlingOptions<TFieldValues, TContext>): UseFormReturn<TFieldValues, TContext> {
  const form = useForm<TFieldValues, TContext>(formOptions)
  const { handleSubmit, setError } = form

  const handleSubmitWithErrors = useCallback(
    <TResult>(
      onValid: SubmitHandler<TFieldValues, TResult>,
      onInvalid?: SubmitErrorHandler<TFieldValues>,
    ) =>
      handleSubmit(async (values, event) => {
        try {
          const result = await onValid(values, event)
          return result
        } catch (error) {
          if (isValidationError(error)) {
            for (const [field, message] of Object.entries(error.fields)) {
              setServerError(setError, field, message)
            }
          } else {
            toast.error(extractMessage(error, fallback))
          }
        }
      }, onInvalid),
    [handleSubmit, setError, fallback],
  )

  return {
    ...form,
    handleSubmit: handleSubmitWithErrors,
  }
}
