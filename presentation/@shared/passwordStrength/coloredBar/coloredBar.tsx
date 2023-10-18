type ColoredBarProps = {
  color?: 'red' | 'orange' | 'green' | 'yellow'
}

export const ColoredBar = ({ color }: ColoredBarProps) => {
  const colorClass =
    color === 'red'
      ? 'bg-[#F64A4A]'
      : color === 'orange'
      ? 'bg-[#FB7C58]'
      : color === 'yellow'
      ? 'bg-[#F8CD65]'
      : color === 'green'
      ? 'bg-neon'
      : 'border-[2px] border-[#E6E5EA]'
  return <div className={`w-[10px] h-[28px] ${colorClass}`}></div>
}
