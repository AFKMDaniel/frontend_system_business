import { Combobox as ComboboxPrimitive } from '@base-ui/react'
import { useController, type Control, type FieldPath, type FieldValues } from 'react-hook-form'

export type ComboboxOption<TOptionValue = string> = {
  value: TOptionValue
  label: string
}

type FormComboboxProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
  TOption extends ComboboxOption,
> = Omit<ComboboxPrimitive.Root.Props<TOption>, 'value' | 'onValueChange' | 'items'> & {
  control: Control<TFieldValues>
  name: TName
  items?: readonly TOption[]
}

function isOptionEqualToValue<TOption extends ComboboxOption>(a: TOption, b: TOption): boolean {
  return a.value === b.value
}

function FormCombobox<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
  TOption extends ComboboxOption,
>({ control, name, isItemEqualToValue, ...comboboxProps }: FormComboboxProps<TFieldValues, TName, TOption>) {
  const { field } = useController({ control, name })

  return (
    <ComboboxPrimitive.Root
      {...comboboxProps}
      value={field.value as TOption | null}
      onValueChange={field.onChange}
      isItemEqualToValue={isItemEqualToValue ?? isOptionEqualToValue<TOption>}
    />
  )
}

export { FormCombobox }
