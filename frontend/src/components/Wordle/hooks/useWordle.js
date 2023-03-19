import { useState, useContext } from 'react'
import { AleoAccountProvider } from '../context/AleoAccountProvider'

const useWordle = () => {
  const [turn, setTurn] = useState(0)
  const [currentGuess, setCurrentGuess] = useState('')
  const [guesses, setGuesses] = useState([...Array(6)]) // each guess is an array
  const [history, setHistory] = useState([]) // each guess is a string
  const [isCorrect, setIsCorrect] = useState(false)
  const [usedKeys, setUsedKeys] = useState({}) // {a: 'grey', b: 'green', c: 'yellow'} etc
  const [isWaiting, setIsWaiting] = useState(false)
  const aleoAccount = useContext(AleoAccountProvider);

  // format a guess into an array of letter objects 
  // e.g. [{key: 'a', color: 'yellow'}]
  const formatGuess = (solution) => {
    let solutionArray = [...solution]
    let formattedGuess = [...currentGuess].map((l) => {
      return { key: l, color: 'grey' }
    })

    // find any green letters
    formattedGuess.forEach((l, i) => {
      if (solution[i] === l.key) {
        formattedGuess[i].color = 'green'
        solutionArray[i] = null
      }
    })

    // find any yellow letters
    formattedGuess.forEach((l, i) => {
      if (solutionArray.includes(l.key) && l.color !== 'green') {
        formattedGuess[i].color = 'yellow'
        solutionArray[solutionArray.indexOf(l.key)] = null
      }
    })

    return formattedGuess
  }

  const formatGuessFromAleoResult = (guessResult) => {
    let formattedGuess = [...currentGuess].map((l) => {
      return { key: l, color: 'grey' }
    })

    for (let i = 0; i < guessResult.length; i++) {
      if (guessResult[i] === 2) {
        formattedGuess[i].color = 'yellow';
      } else if (guessResult[i] === 3) {
        formattedGuess[i].color = 'green';
      }
    }

    return formattedGuess;
  }

  // add a new guess to the guesses state
  // update the isCorrect state if the guess is correct
  // add one to the turn state
  const addNewGuess = (formattedGuess) => {
    let correct = true;
    for (let i = 0; i < formattedGuess.length; i++) {
      if (formattedGuess[i].color !== 'green') {
        correct = false;
        break;
      }
    }
    if (correct) {
      setIsCorrect(true)
    }
    setGuesses(prevGuesses => {
      let newGuesses = [...prevGuesses]
      newGuesses[turn] = formattedGuess
      return newGuesses
    })
    setHistory(prevHistory => {
      return [...prevHistory, currentGuess]
    })
    setTurn(prevTurn => {
      return prevTurn + 1
    })
    setUsedKeys(prevUsedKeys => {
      formattedGuess.forEach(l => {
        const currentColor = prevUsedKeys[l.key]

        if (l.color === 'green') {
          prevUsedKeys[l.key] = 'green'
          return
        }
        if (l.color === 'yellow' && currentColor !== 'green') {
          prevUsedKeys[l.key] = 'yellow'
          return
        }
        if (l.color === 'grey' && currentColor !== ('green' || 'yellow')) {
          prevUsedKeys[l.key] = 'grey'
          return
        }
      })

      return prevUsedKeys
    })
    setCurrentGuess('')
  }

  // handle keyup event & track current guess
  // if user presses enter, add the new guess
  const handleKeyup = async ({ key }) => {
    if (key === 'Enter') {
      const guess_array = [];
      for (let i = 0; i < currentGuess.length; i++) {
        guess_array.push(currentGuess.charCodeAt(i) - "a".charCodeAt(0));
      }
      setIsWaiting(true);
      const response = await fetch("http://127.0.0.1:3456/wordle/guess", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          guess: guess_array,
          player_address: aleoAccount.address,
          player_view_key: aleoAccount.view_key
        })
      });
      const data = await response.json();
      const guess_results_from_aleo = data["guess_results"];
      setIsWaiting(false);

      // only add guess if turn is less than 5
      if (turn > 5) {
        console.log('you used all your guesses!')
        return
      }
      // do not allow duplicate words
      if (history.includes(currentGuess)) {
        console.log('you already tried that word.')
        return
      }
      // check word is 5 chars
      if (currentGuess.length !== 5) {
        console.log('word must be 5 chars.')
        return
      }
      
      // const formatted = formatGuess()
      const formatted = formatGuessFromAleoResult(guess_results_from_aleo);
      addNewGuess(formatted)
    }

    if (key === 'Backspace') {
      setCurrentGuess(prev => prev.slice(0, -1))
      return
    }

    if (/^[A-Za-z]$/.test(key)) {
      if (currentGuess.length < 5) {
        setCurrentGuess(prev => prev + key)
      }
    }
  }

  return { turn, currentGuess, guesses, isCorrect, usedKeys, handleKeyup, isWaiting }
}

export default useWordle