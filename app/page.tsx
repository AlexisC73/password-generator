'use client'

import { ArrowRightIcon, CopyIcon } from '@/presentation/@shared/icons'
import { Checkbox } from '@/presentation/@shared/checkbox/Checkbox'
import { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { PasswordStrength } from '@/presentation/@shared/passwordStrength/PasswordStrength'

interface Options {
  uppercase: boolean
  lowercase: boolean
  numbers: boolean
  symbols: boolean
}

const PASSWORD_MIN_FOR_STRONG = 14 //Amount of characters needed at least to be considered strong

const OPTIONS: Options = {
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true
}

const UPPERCASE_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const LOWERCASE_LETTERS = 'abcdefghijklmnopqrstuvwxyz'
const NUMBERS = '0123456789'
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,./<>?'

export default function Home () {
  const [options, setOptions] = useState<Options>(OPTIONS)
  const [passwordLength, setPasswordLength] = useState<number>(14)
  const [password, setPassword] = useState<string>('')
  const [passwordStrength, setPasswordStrength] = useState<number>(0)
  const [copied, setCopied] = useState<boolean>(false)

  const progressBar = document.querySelector('.progressBar') as HTMLDivElement
  const inputProgress = document.querySelector(
    '.customInput'
  ) as HTMLInputElement

  const [possibleLetters, setPossibleLetters] = useState<string>(
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  )
  const toggleOption = useCallback(
    (option: keyof Options) => {
      const newOptions = { ...options }
      newOptions[option] = !newOptions[option]
      if (Object.values(newOptions).some(v => v === true)) {
        setOptions(prev => ({ ...prev, ...newOptions }))
      }
    },
    [options]
  )

  const updatePossibleLetters = () => {
    let possibleLetters = ''
    if (options.uppercase) possibleLetters += UPPERCASE_LETTERS
    if (options.lowercase) possibleLetters += LOWERCASE_LETTERS
    if (options.numbers) possibleLetters += NUMBERS
    if (options.symbols) possibleLetters += SYMBOLS
    setPossibleLetters(possibleLetters)
  }

  const updateProgressFillWidth = () => {
    if (!progressBar || !inputProgress) return
    const progressTotalWidth = inputProgress.clientWidth - 28
    const barWidth = (progressTotalWidth / 20) * (20 - passwordLength) + 27
    progressBar.setAttribute('style', `right: ${barWidth}px;`)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password)
    setCopied(true)
  }

  useEffect(() => {
    updatePossibleLetters()
  }, [options])
  useEffect(() => {
    calculatePasswordStrength()
  }, [password])

  useEffect(() => {
    updateProgressFillWidth()
  }, [passwordLength])

  useEffect(() => {
    updatePossibleLetters()
    generatePassword()
  }, [])

  useLayoutEffect(() => {
    updateProgressFillWidth()
    window.addEventListener('resize', updateProgressFillWidth)
    return () => {
      window.removeEventListener('resize', updateProgressFillWidth)
    }
  })

  const generatePassword = () => {
    setCopied(false)
    const password = []
    for (let i = 0; i < passwordLength; i++) {
      const randomIndex = Math.floor(Math.random() * possibleLetters.length)
      password.push(possibleLetters[randomIndex])
    }
    setPassword(password.join(''))
  }

  const calculatePasswordStrength = () => {
    const hasUppercase = /[A-Z]/.test(password)
    const hasLowercase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSymbols = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
    const complexity =
      (hasUppercase ? 1 : 0) +
      (hasLowercase ? 1 : 0) +
      (hasNumbers ? 1 : 0) +
      (hasSymbols ? 1 : 0)

    const strength = Math.floor(
      (passwordLength * complexity) / PASSWORD_MIN_FOR_STRONG
    )
    setPasswordStrength(strength)
  }

  return (
    <main className='flex min-h-screen flex-col items-center gap-y-4 justify-center p-[16px] max-w-[540px] mx-auto'>
      <h1 className='text-[#817D92] font-bold'>Password Generator</h1>
      <div className='text-white bg-[#24232C] p-[16px] flex justify-between w-full text-[24px] items-center'>
        <p>{password}</p>
        <div className='text-neon hover:text-white cursor-pointer flex gap-x-4 items-center'>
          {copied ? <p className='text-[18px]'>COPIED</p> : null}
          <CopyIcon onClick={() => copyToClipboard()} />
        </div>
      </div>
      <div className='text-white bg-[#24232C] p-[16px] flex flex-col justify-between w-full text-[24px] items-center gap-y-4'>
        <div className='w-full mb-4 gap-y-2'>
          <div className='flex justify-between w-full items-center'>
            <p className='font-bold text-[18px]'>Character Length</p>
            <p className='text-neon font-bold text-[32px]'>{passwordLength}</p>
          </div>
          <div className='field pb-4'>
            <div className='progressBar'></div>

            <input
              className='customInput'
              type='range'
              min={0}
              max={20}
              defaultValue={passwordLength}
              onChange={e => {
                setPasswordLength(Number(e.target.value))
              }}
            />
          </div>
        </div>

        <ul className='flex flex-col gap-y-4 self-start mb-4'>
          <OptionsGroup
            activated={options.uppercase}
            label='Include Uppercase Letters'
            onClickAction={() => toggleOption('uppercase')}
          />
          <OptionsGroup
            activated={options.lowercase}
            label='Include Lowercase Letters'
            onClickAction={() => toggleOption('lowercase')}
          />
          <OptionsGroup
            activated={options.numbers}
            label='Include Numbers'
            onClickAction={() => toggleOption('numbers')}
          />
          <OptionsGroup
            activated={options.symbols}
            label='Include Symbols'
            onClickAction={() => toggleOption('symbols')}
          />
        </ul>

        <PasswordStrength strength={passwordStrength} />
        <button
          className='flex text-[#24232C] font-bold text-[16px] items-center gap-x-4 bg-neon w-full h-[65px] justify-center'
          onClick={() => generatePassword()}
        >
          <p>GENERATE</p>
          <ArrowRightIcon className='-mt-[2px]' />
        </button>
      </div>
    </main>
  )
}

type OptionProps = {
  label: string
  activated: boolean
  onClickAction?: () => void
}
const OptionsGroup = ({ label, activated, onClickAction }: OptionProps) => {
  return (
    <li className='flex self-start items-center gap-x-5'>
      <div onClick={onClickAction} className='cursor-pointer'>
        <Checkbox checked={activated} />
      </div>
      <p className='text-[16px]'>{label}</p>
    </li>
  )
}
