import type { ComponentProps } from 'react'
import { useController, type Control, type FieldPath, type FieldValues } from 'react-hook-form'

import { Rating } from '@/shared/ui/rating'

type FormRatingProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = Omit<ComponentProps<typeof Rating>, 'rate' | 'onChange'> & {
  control: Control<TFieldValues>
  name: TName
}

function FormRating<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({
  control,
  name,
  ...ratingProps
}: FormRatingProps<TFieldValues, TName>) {
  const { field } = useController({ control, name })

  return <Rating {...ratingProps} rate={field.value as number} onChange={field.onChange} />
}

export { FormRating }
