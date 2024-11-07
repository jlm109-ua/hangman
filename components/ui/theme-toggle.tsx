'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Switch } from '@headlessui/react'

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [enabled, setEnabled] = React.useState(theme === 'light')

    React.useEffect(() => {
        setEnabled(theme === 'light')
    }, [theme])

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light')
    }

    return (
        <div className="flex items-center space-x-2">
            <Sun className="h-[1.2rem] w-[1.2rem]" />
            <Switch
                checked={enabled}
                onChange={toggleTheme}
                className={`${enabled ? 'bg-gray-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
            >
                <span className="sr-only">Toggle theme</span>
                <span
                    className={`${enabled ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
            </Switch>
            <Moon className="h-[1.2rem] w-[1.2rem] text-gray-900 dark:text-gray-100" />
        </div>
    )
}