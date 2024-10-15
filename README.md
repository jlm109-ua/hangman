# Hangman Game with Dictionary

This project is a modern implementation of the classic Hangman game, built with React and Next.js. It features a sleek user interface, real-time feedback, and an integrated dictionary feature that provides definitions for the words used in the game.

## Features

- Classic Hangman gameplay
- Responsive design using Tailwind CSS
- Real-time feedback on guessed letters
- Visual representation of remaining lives
- Integrated dictionary feature
- Draggable dictionary component for better user experience

## How to Play

1. The game starts with a hidden word represented by underscores.
2. Guess a letter by typing it into the input field and clicking "Check" or pressing Enter.
3. If the letter is in the word, it will be revealed in its correct position(s).
4. If the letter is not in the word, you lose a life (represented by hearts).
5. Keep guessing letters until you either guess the entire word or run out of lives.
6. You can start a new game at any time by clicking the "Restart game" button.

## Dictionary Feature

- When a game ends (win or lose), a draggable dictionary component will appear with the definition of the word.
- The dictionary will remain visible until you choose to close it by clicking the X button.
- You can drag the dictionary around the screen for better visibility.
- Starting a new game will not affect the dictionary's visibility.

## Technologies Used

- React
- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui components
- react-draggable

## API Used

This project uses the [Free Dictionary API](https://dictionaryapi.dev/) to fetch word definitions.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).
