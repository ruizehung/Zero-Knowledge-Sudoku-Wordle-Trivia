import { useState, useContext } from 'react'
import { ZKProvider } from '../context/ZKProvider'
import { ExpressBackendPort, ZK_FRAMEWORK, WordleVerifierNoirContractAddress } from '../../../constant'
import { ethers } from "ethers";
import WordleVerifierABI from "../../../abi/WordleVerifier.json";
import { Buffer } from 'buffer';
import { SolutionHashProvider } from '../context/SolutionHashProvider';

const useWordle = () => {
  const [turn, setTurn] = useState(0)
  const [currentGuess, setCurrentGuess] = useState('')
  const [guesses, setGuesses] = useState([...Array(6)]) // each guess is an array
  const [history, setHistory] = useState([]) // each guess is a string
  const [isCorrect, setIsCorrect] = useState(false)
  const [usedKeys, setUsedKeys] = useState({}) // {a: 'grey', b: 'green', c: 'yellow'} etc
  const [isWaiting, setIsWaiting] = useState(false)
  const zkContext = useContext(ZKProvider);
  const solutionHashContext = useContext(SolutionHashProvider);

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
    setHistory((prevHistory) => {
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
      let guess_results = [];
      setIsWaiting(true);
      if (zkContext.zkFramework === ZK_FRAMEWORK.ALEO) {
        const guess_array = [];
        for (let i = 0; i < currentGuess.length; i++) {
          guess_array.push(currentGuess.charCodeAt(i) - "a".charCodeAt(0));
        }
        const response = await fetch(`http://127.0.0.1:${ExpressBackendPort}/aleo/wordle/guess`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            guess: guess_array,
            player_address: zkContext.aleoAddress
          })
        });
        const data = await response.json();
        guess_results = data["guess_results"];
      } else {
        const response = await fetch(`http://127.0.0.1:${ExpressBackendPort}/noir/wordle/guess`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            guess: currentGuess
          })
        });
        const data = await response.json();

        guess_results = data["guess_results"];
        const proof = data["proof"];
        
        // Verify that solution hash in proof doesn't change
        if (!Buffer.from(proof).toString("hex").includes(solutionHashContext.solutionHash.substring(2))) {
          alert(`Server is be cheating by changing the solution! Initial solution hash: ${solutionHashContext.solutionHash}.\n Current solution hash: 0x${Buffer.from(proof).toString("hex").substring(0, solutionHashContext.solutionHash.length)}`);
        }

        const bytes = Buffer.from(proof);
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const wordleVerifier = new ethers.Contract(WordleVerifierNoirContractAddress, WordleVerifierABI["abi"], signer);
        try {
          await wordleVerifier.verify(bytes);
        } catch (error) {
          alert(`Server is be cheating! Error from proof verifier smart contract: ${error.message}`);
        }
      }
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
      const formatted = formatGuessFromAleoResult(guess_results);
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