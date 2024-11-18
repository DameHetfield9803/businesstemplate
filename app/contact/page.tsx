'use client'
import '../globals.css'
import { TypeAnimation } from 'react-type-animation'
export default function page() {
    return (
        <div className='mx-auto text-center p-3 pt-32 space-y-3'>
            <h1 className='text-3xl'>
                <TypeAnimation className='text-violet-500' sequence={["Contact us on our following platforms!"]} wrapper='span' />
            </h1>
            <ul className='flex flex-col p-2'>
                <li><a href="mailto:example@blah.com">Email: Example@blah.com</a></li>
                <li><a href='tel:+65 8882 8883'>Contact no: +65 8882 8883</a></li>
            </ul>
        </div>
    )
}
