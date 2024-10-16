'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Gamepad2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface WordData {
    word: string;
    phonetic: string;
    meanings: {
        partOfSpeech: string;
        definitions: {
            definition: string;
            example?: string;
        }[];
    }[];
}

export default function WordPage() {
    const { word } = useParams()
    const [wordData, setWordData] = useState<WordData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchWordData() {
            try {
                const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
                if (!response.ok) {
                    throw new Error('Word not found')
                }
                const data = await response.json()
                setWordData(data[0])
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred')
            } finally {
                setLoading(false)
            }
        }

        fetchWordData()
    }, [word])

    if (loading) {
        return <div className="container mx-auto p-4">Loading...</div>
    }

    if (error) {
        return <div className="container mx-auto p-4">Error: {error}</div>
    }

    if (!wordData) {
        return <div className="container mx-auto p-4">No data available for this word.</div>
    }

    return (
        <div className="container mx-auto p-4">
            <Link href="/" className="mb-4 inline-block">
                <Button isBackButton>Go Back</Button>
            </Link>
            <Link href="/" className="mb-4 inline-block ml-2">
                <Button variant="outline">
                    <Gamepad2 className="mr-2 h-4 w-4" />
                    Play h_ngm_n
                </Button>
            </Link>
            <h1 className="text-4xl font-bold mb-4">{wordData.word}</h1>
            <p className="text-xl mb-4">{wordData.phonetic}</p>

            {wordData.meanings.map((meaning, index) => (
                <div key={index} className="mb-6">
                    <h2 className="text-2xl font-semibold mb-2">{meaning.partOfSpeech}</h2>
                    <ol className="list-decimal list-inside">
                        {meaning.definitions.map((def, defIndex) => (
                            <li key={defIndex} className="mb-2">
                                <p>{def.definition}</p>
                                {def.example && (
                                    <p className="text-gray-600 italic mt-1">Example: {def.example}</p>
                                )}
                            </li>
                        ))}
                    </ol>
                </div>
            ))}
        </div>
    )
}