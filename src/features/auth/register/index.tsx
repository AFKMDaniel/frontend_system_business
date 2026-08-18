import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { object, ref, string } from 'yup'

import { useAppDispatch } from '@/app/providers/store'
import { register } from '@/entities/user/auth-thunks'
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

const registerSchema = object({
  email: string().trim().email('Enter a valid email').required('Email is required'),
  password: string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  confirmPassword: string()
    .oneOf([ref('password')], 'Passwords do not match')
    .required('Confirm your password'),
})

type RegisterFormValues = {
  email: string
  password: string
  confirmPassword: string
}

export function RegisterForm() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useFormWithErrorHandling<RegisterFormValues>({
    resolver: yupResolver(registerSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
    fallback: 'Registration failed',
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
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Enter your details to join the workspace</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="register-form" onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
          <FormInput
            control={control}
            name="email"
            label="Email"
            type="email"
            autoComplete="email"
            autoFocus
          />
          <FormInput
            control={control}
            name="password"
            label="Password"
            type="password"
            autoComplete="new-password"
          />
          <FormInput
            control={control}
            name="confirmPassword"
            label="Confirm password"
            type="password"
            autoComplete="new-password"
          />
        </form>
      </CardContent>
      <CardFooter>
        <Button form="register-form" type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </Button>
      </CardFooter>
    </Card>
  )
}
