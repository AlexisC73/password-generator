import { ColoredBar } from './coloredBar/coloredBar'

export const PasswordStrength = ({ strength }: { strength: number }) => {
  const color =
    strength === 1
      ? 'red'
      : strength === 2
      ? 'orange'
      : strength === 3
      ? 'yellow'
      : 'green'
  const strengthText =
    strength === 1
      ? 'TOO WEAK!'
      : strength === 2
      ? 'WEAK'
      : strength === 3
      ? 'MEDIUM'
      : strength >= 4
      ? 'STRONG'
      : ''

  return (
    <div className='flex justify-between w-full bg-[#18171F] px-[16px] md:px-8 py-[14px] md:py-[20px] items-center'>
      <p className='text-[#817D92] text-[16px] md:text-[18px] font-bold'>
        STRENGTH
      </p>
      <div className='flex gap-x-4 items-center'>
        <p className='text-[18px] min-h-[36px] md:text-[24px] font-bold text-[#E6E5EA]'>
          {strengthText}
        </p>
        <div className='flex gap-x-2'>
          {[...Array(Math.min(strength, 4))].map((_, index) => (
            <ColoredBar key={index} color={color} />
          ))}
          {[...Array(4 - Math.min(strength, 4))].map((_, index) => (
            <ColoredBar key={index} />
          ))}
        </div>
      </div>
    </div>
  )
}
