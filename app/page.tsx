'use client'
import './globals.css'
import { TypeAnimation } from 'react-type-animation';
export default function Home() {
  return (
    <div className='min-w-full flex-col container mx-auto p-2'>
      <TypeAnimation sequence={["Hello, we are xyz... We blah blah..."]} wrapper='span' className='text-emerald-500 text-3xl' />
      <p className='mt-1.5 text-wrap'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos quo odit ex numquam aperiam aliquid ut. Impedit, aperiam! Iste nesciunt minima corrupti placeat minus odio?</p>
    </div>
  );
}
