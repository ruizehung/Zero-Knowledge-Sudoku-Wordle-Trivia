import React, { useEffect } from 'react'
import useWordle from './hooks/useWordle'

// components
import Grid from './Grid'
import Keypad from './Keypad'
import { Typography } from '@mui/material'

export default function Wordle({ solution }) {
  const { currentGuess, guesses, turn, isCorrect, usedKeys, handleKeyup } = useWordle(solution)
  
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
      <div>solution - {solution}</div>
      <Typography variant="body1">Use your keyboard to type in gusses!</Typography>
      <Grid guesses={guesses} currentGuess={currentGuess} turn={turn} />
      <Keypad usedKeys={usedKeys} />
    </div>
  )
}
