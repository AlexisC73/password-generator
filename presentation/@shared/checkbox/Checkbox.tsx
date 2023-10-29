import { CheckIcon } from '../icons'

export const Checkbox = ({
  checked = false,
  onClickAction
}: {
  checked?: boolean
  onClickAction?: () => void
}) => {
  const content = checked ? <CheckIcon /> : null
  return (
    <div
      className={`h-5 w-5 flex items-center justify-center text-[16px] ${
        checked ? 'bg-neon' : 'border-[#E6E5EA] border-[2px] hover:border-neon'
      }`}
      onClick={onClickAction}
    >
      {content}
    </div>
  )
}
