import React from 'react'
import Draggable from 'react-draggable'
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import Link from "next/link"

interface DictionaryEntry {
    word: string;
    meanings: {
        partOfSpeech: string;
        definitions: {
            definition: string;
        }[];
    }[];
}

interface DraggableDictionaryProps {
    dictionaryData: DictionaryEntry[]
    onClose: () => void
}

const DraggableDictionary: React.FC<DraggableDictionaryProps> = ({ dictionaryData, onClose }) => {
    return (
        <Draggable handle=".handle">
            <div className="absolute top-4 right-4 w-80 bg-background border border-border rounded-lg shadow-lg overflow-hidden">
                <div className="handle bg-muted p-2 cursor-move flex justify-between items-center">
                    <Link
                        href={`/dictionary/${dictionaryData[0].word}`}
                        className="text-blue-500 hover:underline"
                    >
                        <h2 className="text-lg font-bold">{dictionaryData[0].word}</h2>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
                <div className="p-4 max-h-96 overflow-y-auto">
                    {dictionaryData ? (
                        <div>
                            {dictionaryData[0].meanings.map((meaning, index) => (
                                <div key={index} className="mb-4">
                                    <h4 className="text-lg font-bold">{meaning.partOfSpeech}</h4>
                                    <ul className="list-disc list-inside">
                                        {meaning.definitions.slice(0, 3).map((def, defIndex) => (
                                            <li key={defIndex} className="mb-2">{def.definition}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No dictionary data available.</p>
                    )}
                </div>
            </div>
        </Draggable>
    )
}

export default DraggableDictionary