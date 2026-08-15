import type { ComponentProps } from 'react'
import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form'

import {
  Field,
  FieldError,
  FieldLabel,
} from '@/shared/ui/field'
import { Input } from '@/shared/ui/input'

interface FormInputProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> extends Omit<ComponentProps<typeof Input>, 'name'> {
  control: Control<TFieldValues>
  name: TName
  label: string
}

function FormInput<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  ...inputProps
}: FormInputProps<TFieldValues, TName>) {
  const { field, fieldState } = useController({ control, name })

  return (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      <Input
        id={name}
        aria-invalid={fieldState.invalid}
        {...inputProps}
        {...field}
      />
      <FieldError errors={fieldState.error ? [fieldState.error] : []} />
    </Field>
  )
}

export { FormInput }
