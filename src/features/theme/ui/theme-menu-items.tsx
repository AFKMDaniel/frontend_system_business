import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { useTranslation } from '@/shared/i18n'
import {
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/shared/ui/dropdown-menu'

const THEME_OPTIONS = [
  { value: 'light', labelKey: 'light', icon: Sun },
  { value: 'dark', labelKey: 'dark', icon: Moon },
  { value: 'system', labelKey: 'system', icon: Monitor },
] as const

export function ThemeMenuItems() {
  const { t } = useTranslation()
  const { theme, setTheme } = useTheme()

  return (
    <>
      <DropdownMenuLabel>{t('themeSwitch.label')}</DropdownMenuLabel>
      <DropdownMenuRadioGroup
        value={theme ?? 'system'}
        onValueChange={(value) => setTheme(value as (typeof THEME_OPTIONS)[number]['value'])}
      >
        {THEME_OPTIONS.map(({ value, labelKey, icon: Icon }) => (
          <DropdownMenuRadioItem key={value} value={value}>
            <Icon className="size-4" />
            {t(`themeSwitch.${labelKey}`)}
          </DropdownMenuRadioItem>
        ))}
      </DropdownMenuRadioGroup>
    </>
  )
}
