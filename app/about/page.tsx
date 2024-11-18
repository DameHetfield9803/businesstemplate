'use client'
import '../globals.css'
import Image from 'next/image'
import testImg from '../.././public/download.jpeg';
import { TypeAnimation } from 'react-type-animation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
export default function About() {
    return (
        <div>
            <h1 className='pb-2 text-3xl'>About us</h1>
            <TypeAnimation className='text-pink-500 text-lg dark:text-blue-50' sequence={["We are xxx, [problem...]?, [solution]. Why use us? because xyz."]} wrapper='span' />
            <Card className='dark:bg-slate-200 dark:text-black mt-2 bg-black text-blue-50 w-fit px-1.5 mx-auto text-left'>
                <CardHeader>
                    <CardTitle>Silly cat</CardTitle>
                    <CardDescription className='dark:font-bold dark:text-black text-blue-50'>Here's an image of a silly cat</CardDescription>
                    <hr />
                </CardHeader>
                <CardContent>
                    <Image className='mx-auto rounded-xl dark:shadow-blue-50' src={testImg} alt='Cat' width={180} height={50} />
                </CardContent>
                <CardFooter>
                    <p>Cute, isn't it?</p>
                </CardFooter>
            </Card>
        </div>
    )
}