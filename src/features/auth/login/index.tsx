import { Link, useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { object, string } from 'yup'

import { useAppDispatch } from '@/app/providers/store'
import { login } from '@/entities/user/auth-thunks'
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

const loginSchema = object({
  username: string()
    .trim()
    .email(() => i18n.t('auth.login.errors.email'))
    .required(() => i18n.t('auth.login.errors.usernameRequired')),
  password: string().required(() => i18n.t('auth.login.errors.passwordRequired')),
})

type LoginFormValues = { username: string; password: string }

export function LoginForm() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useFormWithErrorHandling<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: { username: '', password: '' },
    fallback: t('auth.login.errors.failed'),
  })

  const onSubmit = handleSubmit(async ({ username, password }) => {
    await dispatch(login({ username, password })).unwrap()
    navigate(ROUTES.home)
  })

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{t('auth.login.title')}</CardTitle>
        <CardDescription>{t('auth.login.subtitle')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="login-form" onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
          <FormInput
            control={control}
            name="username"
            label={t('auth.login.emailLabel')}
            autoComplete="username"
            autoFocus
          />
          <FormInput
            control={control}
            name="password"
            label={t('auth.login.passwordLabel')}
            type="password"
            autoComplete="current-password"
          />
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button form="login-form" type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? t('auth.login.submitting') : t('auth.login.submit')}
        </Button>
        <Button asChild variant="outline" className="w-full">
          <Link to={ROUTES.register}>{t('auth.login.createAccount')}</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
