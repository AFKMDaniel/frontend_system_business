import type { ComponentProps } from 'react'
import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form'

import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'

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
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        aria-invalid={fieldState.invalid}
        {...inputProps}
        {...field}
      />
      {fieldState.error ? (
        <p className="text-sm text-destructive">{fieldState.error.message}</p>
      ) : null}
    </div>
  )
}

export { FormInput }
