'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { generate } from 'random-words'
import DraggableDictionary from '@/components/DraggableDictionary'
import { HangmanSVG } from '@/components/HangmanSVG'

interface DictionaryEntry {
  word: string;
  meanings: {
    partOfSpeech: string;
    definitions: {
      definition: string;
    }[];
  }[];
}

const fallbackWords = ['react', 'javascript', 'typescript', 'component', 'function', 'state', 'effect', 'props'];

const Hangman = () => {
  const [word, setWord] = useState('')
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set())
  const [wrongLetters, setWrongLetters] = useState<Set<string>>(new Set())
  const [lives, setLives] = useState(6)
  const [inputLetter, setInputLetter] = useState('')
  const [gameOver, setGameOver] = useState(false)
  const [message, setMessage] = useState('')
  const [dictionaryData, setDictionaryData] = useState<DictionaryEntry[] | null>(null)
  const [showDictionary, setShowDictionary] = useState(false)

  const getRandomWord = useCallback(() => {
    try {
      const newWord = generate({ exactly: 1, minLength: 5 })[0]
      if (typeof newWord === 'string' && newWord.length >= 5) {
        return newWord.toLowerCase()
      } else {
        throw new Error('Invalid word generated')
      }
    } catch (error) {
      console.error('Error getting random word:', error)
      return fallbackWords[Math.floor(Math.random() * fallbackWords.length)]
    }
  }, [])

  const fetchDictionaryData = useCallback(async (word: string) => {
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
      const data: DictionaryEntry[] = await response.json()
      setDictionaryData(data)
      setShowDictionary(true)
    } catch (error) {
      console.error('Error fetching dictionary data:', error)
      setDictionaryData(null)
    }
  }, [])

  const startGame = useCallback(() => {
    const newWord = getRandomWord()
    console.log('New word:', newWord) // For debugging
    setWord(newWord)
    setGuessedLetters(new Set())
    setWrongLetters(new Set())
    setLives(6)
    setGameOver(false)
    setMessage('')
    setShowDictionary(false)
  }, [getRandomWord])

  const checkLetter = useCallback((letter: string) => {
    if (gameOver) return
    setInputLetter('')
    if (guessedLetters.has(letter) || wrongLetters.has(letter)) return
    if (word.includes(letter)) {
      const newGuessedLetters = new Set(guessedLetters)
      newGuessedLetters.add(letter)
      setGuessedLetters(newGuessedLetters)
      const allLettersGuessed = word.split('').every(l => newGuessedLetters.has(l))
      if (allLettersGuessed) {
        setGameOver(true)
        setMessage('You won!')
        fetchDictionaryData(word)
      }
    } else {
      const newWrongLetters = new Set(wrongLetters)
      newWrongLetters.add(letter)
      setWrongLetters(newWrongLetters)
      const newLives = lives - 1
      setLives(newLives)
      console.log(lives) // For debugging
      if (newLives === 0) {
        setGameOver(true)
        setMessage(`You lost! The word was: ${word}`)
        fetchDictionaryData(word)
      }
    }
  }, [gameOver, guessedLetters, wrongLetters, word, lives, fetchDictionaryData])

  useEffect(() => {
    startGame()
  }, [startGame])

  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground p-4">
      <div className="w-full max-w-2xl flex flex-col items-center justify-center">
        <HangmanSVG lives={lives} className="mb-8" />
        <h1 className="text-4xl font-bold mb-8">h_ngm_n</h1>
        <div className="text-4xl mb-8">
          {word.split('').map((letter, index) => (
            <span key={index} className="mr-2">
              {guessedLetters.has(letter) ? letter : '_'}
            </span>
          ))}
        </div>
        {!gameOver ? (
          <form onSubmit={(e) => {
            e.preventDefault()
            checkLetter(inputLetter.toLowerCase())
          }} className="flex gap-2 mb-4">
            <Input
              type="text"
              maxLength={1}
              value={inputLetter}
              onChange={(e) => setInputLetter(e.target.value)}
              className="w-16 text-center text-2xl"
              aria-label="Enter a letter"
            />
            <Button type="submit">Check</Button>
          </form>
        ) : (
          <div className={`text-2xl font-bold mb-4 ${message.includes('lost') ? 'text-destructive' : 'text-primary'}`}>
            {message}
          </div>
        )}
        <div className="flex gap-4 mb-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">Correct</h2>
            <div className="flex flex-wrap gap-2">
              {Array.from(guessedLetters).map((letter) => (
                <span key={letter} className="px-2 py-1 bg-green-300 font-bold rounded">{letter}</span>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Wrong</h2>
            <div className="flex flex-wrap gap-2">
              {Array.from(wrongLetters).map((letter) => (
                <span key={letter} className="px-2 py-1 bg-red-400 font-bold text-black rounded">{letter}</span>
              ))}
            </div>
          </div>
        </div>
        <Button onClick={startGame} className="mt-4">
          {gameOver ? 'Play again' : 'Restart game'}
        </Button>
      </div>
      {showDictionary && dictionaryData && (
        <DraggableDictionary
          dictionaryData={dictionaryData}
          onClose={() => setShowDictionary(false)}
        />
      )}
    </div>
  )
}

export default Hangman