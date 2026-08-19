import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { object, ref, string } from 'yup'

import { useAppDispatch } from '@/app/providers/store'
import { register } from '@/entities/user/auth-thunks'
import { useFormWithErrorHandling } from '@/shared/lib/use-form-with-error-handling'
import { i18n, useTranslation } from '@/shared/i18n'
import { FormInput } from '@/shared/ui/form/form-input'
import { Button } from '@/shared/ui/button'
import { ROUTES } from '@/shared/config'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card'

const registerSchema = object({
  email: string()
    .trim()
    .email(() => i18n.t('auth.register.errors.email'))
    .required(() => i18n.t('auth.register.errors.emailRequired')),
  password: string()
    .min(8, () => i18n.t('auth.register.errors.passwordMin'))
    .required(() => i18n.t('auth.register.errors.passwordRequired')),
  confirmPassword: string()
    .oneOf([ref('password')], () => i18n.t('auth.register.errors.passwordMismatch'))
    .required(() => i18n.t('auth.register.errors.confirmPasswordRequired')),
})

type RegisterFormValues = {
  email: string
  password: string
  confirmPassword: string
}

export function RegisterForm() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useFormWithErrorHandling<RegisterFormValues>({
    resolver: yupResolver(registerSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
    fallback: t('auth.register.errors.failed'),
  })

  useEffect(() => {
    if (errors.password) {
      setValue('confirmPassword', '')
    }
  }, [errors.password, setValue])

  const onSubmit = handleSubmit(async ({ email, password }) => {
    await dispatch(register({ email, password })).unwrap()
    navigate(ROUTES.login)
  })

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{t('auth.register.title')}</CardTitle>
        <CardDescription>{t('auth.register.subtitle')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="register-form" onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
          <FormInput
            control={control}
            name="email"
            label={t('auth.register.emailLabel')}
            type="email"
            autoComplete="email"
            autoFocus
          />
          <FormInput
            control={control}
            name="password"
            label={t('auth.register.passwordLabel')}
            type="password"
            autoComplete="new-password"
          />
          <FormInput
            control={control}
            name="confirmPassword"
            label={t('auth.register.confirmPasswordLabel')}
            type="password"
            autoComplete="new-password"
          />
        </form>
      </CardContent>
      <CardFooter>
        <Button form="register-form" type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? t('auth.register.submitting') : t('auth.register.submit')}
        </Button>
      </CardFooter>
    </Card>
  )
}
