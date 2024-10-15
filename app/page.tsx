'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Heart } from "lucide-react"
import { generate } from 'random-words'
import DraggableDictionary from '@/components/DraggableDictionary'

interface DictionaryEntry {
  word: string;
  meanings: {
    partOfSpeech: string;
    definitions: {
      definition: string;
    }[];
  }[];
}

const Hangman = () => {
  // State variables
  const [word, setWord] = useState('')
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set())
  const [wrongLetters, setWrongLetters] = useState<Set<string>>(new Set())
  const [lives, setLives] = useState(5)
  const [inputLetter, setInputLetter] = useState('')
  const [gameOver, setGameOver] = useState(false)
  const [message, setMessage] = useState('')
  const [animatingHeart, setAnimatingHeart] = useState(-1)
  const [dictionaryData, setDictionaryData] = useState<DictionaryEntry[] | null>(null)
  const [showDictionary, setShowDictionary] = useState(false)

  // Function to get a random word
  const getRandomWord = useCallback(() => {
    try {
      const newWord = generate({ exactly: 1, minLength: 5 })[0]
      return newWord.toLowerCase()
    } catch (error) {
      console.error('Error getting random word:', error)
      return 'default' // default word in case of error
    }
  }, [])

  // Function to fetch dictionary data
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

  // Function to start or restart the game
  const startGame = useCallback(() => {
    const newWord = getRandomWord()
    setWord(newWord)
    setGuessedLetters(new Set())
    setWrongLetters(new Set())
    setLives(5)
    setGameOver(false)
    setMessage('')
    // We don't reset the dictionary data or visibility here
  }, [getRandomWord])

  // Function to check the guessed letter
  const checkLetter = useCallback((letter: string) => {
    if (gameOver) return
    setInputLetter('')
    if (word.includes(letter)) {
      const newGuessedLetters = new Set(guessedLetters)
      newGuessedLetters.add(letter)
      setGuessedLetters(newGuessedLetters)
      // Check if all letters have been guessed
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
      setAnimatingHeart(newLives)
      // Check if the player has lost
      if (newLives === 0) {
        setGameOver(true)
        setMessage(`You lost! The word was: ${word}`)
        fetchDictionaryData(word)
      }
    }
  }, [gameOver, guessedLetters, wrongLetters, word, lives, fetchDictionaryData])

  // Start the game when the component mounts
  useEffect(() => {
    startGame()
  }, [startGame])

  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground p-4">
      <div className="w-full max-w-2xl flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-8">h_ngman</h1>
        {/* Hearts representing lives */}
        <div className="flex mb-8">
          {[...Array(5)].map((_, index) => (
            <Heart
              key={index}
              className={`w-8 h-8 ${index < lives ? 'text-destructive' : 'text-muted'} ${animatingHeart === index ? 'animate-heartbeat' : ''}`}
              fill={index < lives ? 'currentColor' : 'gray'}
            />
          ))}
        </div>
        {/* Word display */}
        <div className="text-4xl mb-8">
          {word.split('').map((letter, index) => (
            <span key={index} className="mr-2">
              {guessedLetters.has(letter) ? letter : '_'}
            </span>
          ))}
        </div>
        {/* Input form or game over message */}
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
        {/* Guessed and wrong letters display */}
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
        {/* Start/Restart game button */}
        <Button onClick={startGame} className="mt-4">
          {gameOver ? 'Play again' : 'Restart game'}
        </Button>
      </div>
      {/* Draggable Dictionary */}
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