import { useEffect, useId, useState } from 'react'
import type { ComponentProps } from 'react'
import { format, isValid, parse } from 'date-fns'
import { CalendarIcon, XIcon } from 'lucide-react'
import type { DateRange } from 'react-day-picker'

import { cn } from '@/shared/lib/utils'
import { Calendar } from '@/shared/ui/calendar'
import { FieldLabel } from '@/shared/ui/field'
import { getDateLocale, useTranslation } from '@/shared/i18n'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/shared/ui/input-group'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover'

const DATE_FORMAT = 'dd.MM.yyyy'
const DATE_DIGIT_COUNT = 8

function formatDate(date?: Date): string {
  return date ? format(date, DATE_FORMAT) : ''
}

function parseDate(value: string): Date | undefined {
  const trimmed = value.trim()
  if (!trimmed) {
    return undefined
  }
  const parsed = parse(trimmed, DATE_FORMAT, new Date())
  return isValid(parsed) ? parsed : undefined
}

function formatDateInput(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, DATE_DIGIT_COUNT)
  return [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean).join('.')
}

type DateMaskInputProps = Omit<ComponentProps<'input'>, 'value' | 'onChange'> & {
  value: Date | undefined
  onCommit: (date: Date | undefined) => void
}

function DateMaskInput({ value, onCommit, ...inputProps }: DateMaskInputProps) {
  const [text, setText] = useState(() => formatDate(value))

  useEffect(() => {
    setText(formatDate(value))
  }, [value])

  return (
    <InputGroupInput
      {...inputProps}
      value={text}
      onChange={(event) => {
        const masked = formatDateInput(event.target.value)
        setText(masked)
        const digits = masked.replace(/\D/g, '')
        if (!digits) {
          onCommit(undefined)
          return
        }
        if (digits.length === DATE_DIGIT_COUNT) {
          onCommit(parseDate(masked))
        }
      }}
    />
  )
}

type DatePickerBaseProps = {
  label?: string
  className?: string
}

type SingleDatePickerProps = DatePickerBaseProps & {
  mode: 'single'
  value?: Date
  onSelect?: (date: Date | undefined) => void
  placeholder?: string
}

type RangeDatePickerProps = DatePickerBaseProps & {
  mode: 'range'
  value?: DateRange
  onSelect?: (range: DateRange | undefined) => void
  fromPlaceholder?: string
  toPlaceholder?: string
}

type DatePickerProps = SingleDatePickerProps | RangeDatePickerProps

const DEFAULT_PLACEHOLDER = '__.__.____'

function DatePicker(props: DatePickerProps) {
  if (props.mode === 'range') {
    return <RangeDatePicker {...props} />
  }

  return <SingleDatePicker {...props} />
}

function SingleDatePicker({
  value,
  onSelect,
  label,
  className,
  placeholder = DEFAULT_PLACEHOLDER,
}: SingleDatePickerProps) {
  const [open, setOpen] = useState(false)
  const [month, setMonth] = useState<Date | undefined>(value)
  const inputId = useId()
  const { t, i18n } = useTranslation()

  const handleCommit = (date: Date | undefined) => {
    if (date) {
      setMonth(date)
    }
    onSelect?.(date)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          className={cn('flex flex-col gap-1.5', className)}
          onClick={(event) => {
            event.preventDefault()
            setOpen(true)
          }}
        >
          {label ? <FieldLabel htmlFor={inputId}>{label}</FieldLabel> : null}
          <InputGroup className="w-40">
            <DateMaskInput
              id={inputId}
              value={value}
              onCommit={handleCommit}
              placeholder={placeholder}
              onFocus={() => setOpen(true)}
              onKeyDown={(event) => {
                if (event.key === 'ArrowDown') {
                  event.preventDefault()
                  setOpen(true)
                }
              }}
            />
            <InputGroupAddon align="inline-end">
              {value ? (
                <InputGroupButton
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  aria-label={t('datePicker.clearDate')}
                  onClick={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    onSelect?.(undefined)
                  }}
                >
                  <XIcon />
                </InputGroupButton>
              ) : (
                <InputGroupButton
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  aria-label={t('datePicker.selectDate')}
                >
                  <CalendarIcon />
                </InputGroupButton>
              )}
            </InputGroupAddon>
          </InputGroup>
        </div>
      </PopoverTrigger>
      <PopoverContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="w-auto p-0"
        sideOffset={4}
      >
        <Calendar
          mode="single"
          locale={getDateLocale(i18n.language)}
          selected={value}
          month={month}
          onMonthChange={setMonth}
          onSelect={(date) => {
            setMonth(date)
            onSelect?.(date)
            setOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

function RangeDatePicker({
  value,
  onSelect,
  label,
  className,
  fromPlaceholder = DEFAULT_PLACEHOLDER,
  toPlaceholder = DEFAULT_PLACEHOLDER,
}: RangeDatePickerProps) {
  const [open, setOpen] = useState(false)
  const [month, setMonth] = useState<Date | undefined>(value?.from)
  const inputId = useId()
  const { t, i18n } = useTranslation()

  const handleFromCommit = (date: Date | undefined) => {
    if (date) {
      setMonth(date)
    }
    onSelect?.({ from: date, to: value?.to })
  }

  const handleToCommit = (date: Date | undefined) => {
    if (date) {
      setMonth(date)
    }
    onSelect?.({ from: value?.from, to: date })
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          className={cn('flex flex-col gap-1.5', className)}
          onClick={(event) => {
            event.preventDefault()
            setOpen(true)
          }}
        >
          {label ? <FieldLabel htmlFor={inputId}>{label}</FieldLabel> : null}
          <div className="flex items-center gap-2">
            <InputGroup className="w-40">
              <DateMaskInput
                id={inputId}
                value={value?.from}
                onCommit={handleFromCommit}
                placeholder={fromPlaceholder}
                onFocus={() => setOpen(true)}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowDown') {
                    event.preventDefault()
                    setOpen(true)
                  }
                }}
              />
              <InputGroupAddon align="inline-end">
                {value?.from ? (
                  <InputGroupButton
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    aria-label={t('datePicker.clearStartDate')}
                    onClick={(event) => {
                      event.preventDefault()
                      event.stopPropagation()
                      handleFromCommit(undefined)
                    }}
                  >
                    <XIcon />
                  </InputGroupButton>
                ) : (
                  <InputGroupButton
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    aria-label={t('datePicker.selectStartDate')}
                  >
                    <CalendarIcon />
                  </InputGroupButton>
                )}
              </InputGroupAddon>
            </InputGroup>

            <InputGroup className="w-40">
              <DateMaskInput
                value={value?.to}
                onCommit={handleToCommit}
                placeholder={toPlaceholder}
                onFocus={() => setOpen(true)}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowDown') {
                    event.preventDefault()
                    setOpen(true)
                  }
                }}
              />
              <InputGroupAddon align="inline-end">
                {value?.to ? (
                  <InputGroupButton
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    aria-label={t('datePicker.clearEndDate')}
                    onClick={(event) => {
                      event.preventDefault()
                      event.stopPropagation()
                      handleToCommit(undefined)
                    }}
                  >
                    <XIcon />
                  </InputGroupButton>
                ) : (
                  <InputGroupButton
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    aria-label={t('datePicker.selectEndDate')}
                  >
                    <CalendarIcon />
                  </InputGroupButton>
                )}
              </InputGroupAddon>
            </InputGroup>
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="w-auto p-0"
        sideOffset={4}
      >
        <Calendar
          mode="range"
          locale={getDateLocale(i18n.language)}
          selected={value}
          month={month}
          onMonthChange={setMonth}
          onSelect={(range) => {
            setMonth(range?.from)
            onSelect?.(range)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

export { DatePicker }
