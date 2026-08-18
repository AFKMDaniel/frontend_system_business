import { Link, useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { object, string } from 'yup'

import { useAppDispatch } from '@/app/providers/store'
import { login } from '@/entities/user/auth-thunks'
import { useFormWithErrorHandling } from '@/shared/lib/use-form-with-error-handling'
import { FormInput } from '@/shared/ui/form-input'
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
  username: string().trim().email('Enter a valid email').required('Username is required'),
  password: string().required('Password is required'),
})

type LoginFormValues = { username: string; password: string }

export function LoginForm() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useFormWithErrorHandling<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: { username: '', password: '' },
    fallback: 'Login failed',
  })

  const onSubmit = handleSubmit(async ({ username, password }) => {
    await dispatch(login({ username, password })).unwrap()
    navigate(ROUTES.home)
  })

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Enter your credentials to access the workspace</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="login-form" onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
          <FormInput
            control={control}
            name="username"
            label="Email"
            autoComplete="username"
            autoFocus
          />
          <FormInput
            control={control}
            name="password"
            label="Password"
            type="password"
            autoComplete="current-password"
          />
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button form="login-form" type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </Button>
        <Button asChild variant="outline" className="w-full">
          <Link to={ROUTES.register}>Create account</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
