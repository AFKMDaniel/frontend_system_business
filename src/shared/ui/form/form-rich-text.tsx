import { useController, type Control, type FieldPath, type FieldValues } from 'react-hook-form'

import { RichTextEditor } from '@/shared/ui/rich-text'

type FormRichTextProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = Omit<React.ComponentProps<typeof RichTextEditor>, 'value' | 'onChange'> & {
  control: Control<TFieldValues>
  name: TName
}

function FormRichText<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({
  control,
  name,
  ...richTextProps
}: FormRichTextProps<TFieldValues, TName>) {
  const { field } = useController({ control, name })

  return <RichTextEditor {...richTextProps} value={field.value} onChange={field.onChange} />
}

export { FormRichText }
