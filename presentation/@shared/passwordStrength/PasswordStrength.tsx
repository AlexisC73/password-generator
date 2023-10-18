import { ColoredBar } from './coloredBar/coloredBar'

export const PasswordStrength = ({
  strength
}: {
  strength: 0 | 1 | 2 | 3 | 4
}) => {
  const color =
    strength === 1
      ? 'red'
      : strength === 2
      ? 'orange'
      : strength === 3
      ? 'yellow'
      : 'green'
  const strengthText =
    strength === 2
      ? 'WEAK'
      : strength === 3
      ? 'MEDIUM'
      : strength === 4
      ? 'STRONG'
      : 'TOO WEAK!'
  return (
    <div className='flex justify-between w-full bg-[#18171F] px-[32px] py-[20px] items-center'>
      <p className='text-[#817D92] text-[16px] font-bold'>STRENGTH</p>
      <div className='flex gap-x-4 items-center'>
        <p className='text-[18px] font-bold text-[#E6E5EA]'>{strengthText}</p>
        <div className='flex gap-x-2'>
          {[...Array(strength)].map((_, index) => (
            <ColoredBar key={index} color={color} />
          ))}
          {[...Array(4 - strength)].map((_, index) => (
            <ColoredBar key={index} />
          ))}
        </div>
      </div>
    </div>
  )
}
