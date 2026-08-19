import type { ComponentProps } from 'react'
import { useController, type Control, type FieldPath, type FieldValues } from 'react-hook-form'

import { DatePicker } from '@/shared/ui/date-picker'

type FormDatePickerProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = Omit<ComponentProps<typeof DatePicker>, 'value' | 'onSelect'> & {
  control: Control<TFieldValues>
  name: TName
}

function FormDatePicker<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({
  control,
  name,
  ...datePickerProps
}: FormDatePickerProps<TFieldValues, TName>) {
  const { field } = useController({ control, name })

  return <DatePicker {...datePickerProps} value={field.value} onSelect={field.onChange} />
}

export { FormDatePicker }
