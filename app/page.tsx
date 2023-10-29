'use client'

import { ArrowRightIcon, CopyIcon } from '@/presentation/@shared/icons'
import { Checkbox } from '@/presentation/@shared/checkbox/Checkbox'
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from 'react'
import { PasswordStrength } from '@/presentation/@shared/passwordStrength/PasswordStrength'

interface Options {
  uppercase: boolean
  lowercase: boolean
  numbers: boolean
  symbols: boolean
}

const PASSWORD_MIN_FOR_STRONG = 14 //Amount of characters needed at least to be considered strong

const OPTIONS: Options = {
  uppercase: false,
  lowercase: false,
  numbers: false,
  symbols: false
}

const UPPERCASE_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const LOWERCASE_LETTERS = 'abcdefghijklmnopqrstuvwxyz'
const NUMBERS = '0123456789'
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,./<>?'

export default function Home () {
  const [options, setOptions] = useState<Options>(OPTIONS)
  const [passwordLength, setPasswordLength] = useState<number>(0)
  const [password, setPassword] = useState<string>('')
  const [passwordStrength, setPasswordStrength] = useState<number>(0)
  const [copied, setCopied] = useState<boolean>(false)

  const progressBar = useRef<HTMLDivElement>(null)
  const inputProgress = useRef<HTMLInputElement>(null)

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

  const updateProgressFillWidth = useCallback(() => {
    if (!progressBar.current || !inputProgress.current) return
    const progressTotalWidth = inputProgress.current.clientWidth - 28
    const barWidth = (progressTotalWidth / 20) * (20 - passwordLength) + 27
    progressBar.current.setAttribute('style', `right: ${barWidth}px;`)
  }, [passwordLength, progressBar, inputProgress])

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

  useLayoutEffect(() => {
    updateProgressFillWidth()
    window.addEventListener('resize', updateProgressFillWidth)
    return () => {
      window.removeEventListener('resize', updateProgressFillWidth)
    }
  }, [passwordLength])

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
    <main className='flex min-h-screen flex-col items-center justify-center gap-y-[14px] md:gap-y-[27px] p-[16px] md:p-0 md:w-[540px] mx-auto'>
      <h1 className='text-[#817D92] text-[16px] md:text-[24px] font-bold'>
        Password Generator
      </h1>
      <div className='flex flex-col w-full gap-y-4 md:gap-y-[24px]'>
        <div className='bg-[#24232C] flex justify-between w-full items-center h-[64px] md:h-[80px]'>
          <p
            className={`font-bold text-[24px] text-[#E6E5EA] md:text-[32px] pl-4 md:pl-8 mt-[1px] ${
              password.length <= 0 ? 'opacity-25' : 'opacity-100'
            }`}
          >
            {password || 'P4$5W0rD!'}
          </p>
          <div className='text-neon text-[20px] md:text-[24px] pr-[14px] md:pr-[32px] hover:text-white cursor-pointer flex gap-x-4 items-center '>
            {copied ? <p className='text-[18px]'>COPIED</p> : null}
            <CopyIcon onClick={() => copyToClipboard()} />
          </div>
        </div>

        <div className='text-white bg-[#24232C] p-4 md:px-8 md:pt-[24px] flex flex-col justify-between w-full text-[24px] items-center'>
          <div className='flex justify-between w-full items-center'>
            <label
              htmlFor='password-length'
              className='font-bold text-[16px] md:text-[18px] -mt-[5px]'
            >
              Character Length
            </label>
            <p className='text-neon font-bold text-[24px] md:text-[32px] align-text-top'>
              {passwordLength}
            </p>
          </div>
          <div className='w-full field relative h-[28px] md:mt-[10px]'>
            <div className='progressBar' ref={progressBar}></div>
            <input
              id='password-length'
              name='password-length'
              className='customInput'
              ref={inputProgress}
              type='range'
              min={0}
              max={20}
              defaultValue={passwordLength}
              onChange={e => {
                setPasswordLength(Number(e.target.value))
              }}
            />
          </div>

          <ul className='flex flex-col gap-y-4 self-start mt-9 md:mt-[32px] md:gap-y-[23px]'>
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

          <div className='w-full flex flex-col gap-y-4 md:gap-y-8 pt-[30px] md:pt-[32px] md:pb-[16px]'>
            <PasswordStrength strength={passwordStrength} />
            <button
              className='flex text-[#24232C] hover:text-neon border-neon border-2 hover:bg-[#24232C] items-center gap-x-4 bg-neon w-full h-[56px] md:h-[65px] justify-center'
              onClick={() => generatePassword()}
            >
              <span className='font-bold text-base md:text-lg'>GENERATE</span>
              <ArrowRightIcon className='text-[16px]' />
            </button>
          </div>
        </div>
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
    <li className='flex self-start items-center h-[21px] gap-x-5 md:gap-x-6'>
      <div onClick={onClickAction} className='cursor-pointer'>
        <Checkbox checked={activated} />
      </div>
      <p className='text-[16px] md:text-[18px]'>{label}</p>
    </li>
  )
}
