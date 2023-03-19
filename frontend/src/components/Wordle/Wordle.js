import React, { useEffect } from 'react'
import useWordle from './hooks/useWordle'

// components
import WordleGrid from './WordleGrid'
import { Typography, CircularProgress, Stack } from '@mui/material'

export default function Wordle() {
  const { currentGuess, guesses, turn, isCorrect, handleKeyup, isWaiting } = useWordle()

  useEffect(() => {
    window.addEventListener('keyup', handleKeyup)

    if (isCorrect) {
      console.log('congrats, you win')
      window.removeEventListener('keyup', handleKeyup)
    }
    if (turn > 5) {
      console.log('unlucky, out of guesses')
      window.removeEventListener('keyup', handleKeyup)
    }

    return () => window.removeEventListener('keyup', handleKeyup)
  }, [handleKeyup, isCorrect, turn])

  return (
    <div>
      <Typography variant="body1">Use your keyboard to type in your gusses!</Typography>
      <Typography variant="body1">Press Enter to submit!</Typography>
      {
        isWaiting && <Stack alignItems="center">
          <CircularProgress sx={{marginTop: 1}} />
        </Stack> 
      }
      <WordleGrid guesses={guesses} currentGuess={currentGuess} turn={turn} />
    </div>
  )
}
