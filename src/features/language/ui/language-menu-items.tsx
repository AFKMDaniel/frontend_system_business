import { SUPPORTED_LANGUAGES } from '@/shared/i18n/languages'
import { useTranslation } from '@/shared/i18n'
import {
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/shared/ui/dropdown-menu'

export function LanguageMenuItems() {
  const { t, i18n } = useTranslation()

  return (
    <>
      <DropdownMenuLabel>{t('languageSwitch.label')}</DropdownMenuLabel>
      <DropdownMenuRadioGroup
        value={i18n.resolvedLanguage ?? i18n.language.split('-')[0]}
        onValueChange={(value) => {
          void i18n.changeLanguage(value)
        }}
      >
        {SUPPORTED_LANGUAGES.map(({ value, label }) => (
          <DropdownMenuRadioItem key={value} value={value}>
            {label}
          </DropdownMenuRadioItem>
        ))}
      </DropdownMenuRadioGroup>
    </>
  )
}
