import { CopyIcon } from '@/presentation/@shared/icons'

export default function Home () {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-[16px]'>
      <h1 className='text-[#817D92] font-bold'>Password Generator</h1>
      <InputSection />
    </main>
  )
}

const InputSection = () => {
  return (
    <div className='text-white bg-[#24232C] p-[16px] flex justify-between w-full text-[24px] items-center'>
      <p>PTx1f5DaFX</p>
      <CopyIcon className='text-neon' />
    </div>
  )
}
