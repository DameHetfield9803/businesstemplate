'use client';

import './globals.css';
import Link from 'next/link';
import ThemeSwitch from './ThemeSwitch';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export default function Navbar() {
    return (
        <div className="sticky top-3 z-20 mb-2 backdrop-blur-lg rounded-lg bg-transparent shadow-md flex items-center w-fit mx-auto p-3.5">
            <div className="flex left-auto items-center gap-5">
                <ThemeSwitch />
                <Link href="/" className="text-gray-900 dark:text-gray-100">
                    Home
                </Link>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 dark:bg-gray-200 dark:text-black dark:hover:bg-gray-300">
                            About
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="end"
                        className="w-32 text-center bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 rounded-md"
                    >
                        <DropdownMenuItem asChild>
                            <Link href="/about" className="block hover:bg-gray-200 dark:hover:bg-gray-700">
                                About us
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link
                                className="block hover:bg-gray-200 dark:hover:bg-gray-700"
                                href="/contact"
                            >
                                Contact us
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}
