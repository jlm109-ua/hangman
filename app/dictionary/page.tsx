'use client'

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import { Gamepad2 } from "lucide-react"

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function DictionaryPage() {
    const [words, setWords] = useState<string[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedLetter, setSelectedLetter] = useState<string | null>(null)

    useEffect(() => {
        fetchWords()
    }, [])

    async function fetchWords() {
        const { data, error } = await supabase
            .from('hangman_words')
            .select('word')
            .order('word')

        if (error) {
            console.error('Error fetching words:', error)
        } else {
            setWords(data.map(item => item.word))
        }
    }

    const filteredWords = words.filter(word =>
        word.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (!selectedLetter || word.toLowerCase().startsWith(selectedLetter.toLowerCase()))
    )

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-4xl font-bold mb-8">h_ngm_n dictionary</h1>
            <Link href="/" className="mb-4 inline-block">
                <Button variant="outline">
                    <Gamepad2 className="mr-2 h-4 w-4" />
                    Play h_ngm_n
                </Button>
            </Link>
            <div className="mb-8">
                <Input
                    type="text"
                    placeholder="Search words..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mb-4"
                />
                <div className="flex flex-wrap gap-2 mb-4">
                    {alphabet.map(letter => (
                        <Button
                            key={letter}
                            onClick={() => setSelectedLetter(letter === selectedLetter ? null : letter)}
                            variant={letter === selectedLetter ? "default" : "outline"}
                        >
                            {letter}
                        </Button>
                    ))}
                </div>
            </div>

            <div>
                {alphabet.map(letter => {
                    const wordsForLetter = filteredWords.filter(word => word.toLowerCase().startsWith(letter.toLowerCase()))
                    if (wordsForLetter.length === 0) return null
                    return (
                        <div key={letter} id={letter} className="mb-8">
                            <h2 className="text-2xl font-bold mb-4">{letter}</h2>
                            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {wordsForLetter.map(word => (
                                    <li key={word}>
                                        <Link href={`/dictionary/${word}`} className="text-blue-500 hover:underline">
                                            {word}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}