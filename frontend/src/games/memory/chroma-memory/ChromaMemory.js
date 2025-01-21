import React, { useState, useEffect } from "react";
import "./ChromaMemory.scss";
import { useNavigate } from "react-router-dom";
import GameService from "../../../services/gameService";
import ScoreService from "../../../services/scoreService";
import VerifyTokenService from "../../../services/verifyTokenService";


function ChromaMemory() {
  const [sequence, setSequence] = useState([]);
  const [timeToGuess, setTimeToGuess] = useState(false);
  const [userSequence, setUserSequence] = useState([]);
  const [round, setRound] = useState(1);
  const [message, setMessage] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [gameId, setGameId] = useState(false);

  let navigate = useNavigate();
  useEffect(()=>{
    let response = VerifyTokenService.verify(navigate)
    GameService.fetchGameIdByName('ChromaMemory').
    then((res) => {
        setGameId(res.data.id);
    })
  },[]); // eslint-disable-line react-hooks/exhaustive-deps  

  useEffect(() => {
    generateSequence();
  }, [round]);

  // Funcție pentru generarea unei noi secvențe
  const generateSequence = () => {
    const newSequence = [];
    for (let i = 0; i < round; i++) {
      newSequence.push(Math.floor(Math.random() * 4) + 1); // Numere între 1 și 4 pentru a reprezenta patru culori sau sunete
    }
    setSequence(newSequence);
    setUserSequence([]);
  };

  // Funcție pentru afișarea secvenței către jucător
  const showSequence = () => {
    setMessage("Remember the sequence");
    setTimeToGuess(false);
    setTimeout(() => {
      setMessage("Reproduce the sequence");
      setTimeToGuess(true);
    }, 1000 * round);
  };

  // Funcție pentru a verifica secvența introdusă de jucător
  const checkSequence = () => {
    if (JSON.stringify(sequence) === JSON.stringify(userSequence)) {
      setRound(round + 1);
    } else {
        setGameOver(true);
       setMessage("You Lose");
    }
  };

  useEffect(() => {
    if (sequence.length > 0) {
      showSequence();
    }
  }, [sequence]);


  useEffect(()=>{
    if(gameOver){
        ScoreService.insertScore({
            gameId: gameId,
            score:round*200
        });
    }
  },[gameOver]);

  // Funcție pentru a gestiona răspunsul jucătorului la fiecare buton
  const handleButtonClick = (number) => {
    setUserSequence([...userSequence, number]);
  };

  // Funcție pentru a reseta jocul
  const resetGame = () => {
    setGameOver(false);
    setTimeToGuess(false);
    setRound(1);
    generateSequence();

  };

  return (
    <div className="chroma-memory-container">
        <div className="chroma-memory">
            <h1>ChromaMemory</h1>
            <p>{message}</p>
            <div className="sequence-container">
                {sequence.map((number, index) => (
                <button
                    key={index}
                    className="sequence-button"
                    style={{
                    backgroundColor: !timeToGuess ? getColor(number) : getColor(0),
                    }}
                    disabled={true} // Butonul este dezactivat în timpul afișării secvenței
                />
                ))}
            </div>
            <div className="user-sequence-container">
                {sequence.length > 0 && timeToGuess && (
                <>
                    <p>Use the following buttons:</p>
                    <div className="d-flex justify-content-center mb-3">
                    {[1, 2, 3, 4].map((number) => (
                        <button
                        key={number}
                        className="user-sequence-button btn ml-1"
                        onClick={() => handleButtonClick(number)}
                        disabled={!timeToGuess}
                        style={{ backgroundColor: getColor(number) }}
                        >
                        
                        </button>
                    ))}
                    </div>
                    <div className="buttons-container d-flex justify-content-center">
                        {!gameOver && 
                        <button onClick={checkSequence} className="action-button button btn btn-color p-2 ml-1">
                            Next
                        </button>
                        }
                        <button onClick={resetGame} className="action-button button btn btn-color p-2 ml-1">
                            Reset
                        </button>
                    </div>
                </>
                )}
            </div>
            {/* <button onClick={generateSequence} className="action-button">
                Start
            </button> */}

        </div>
    </div>
  );
}

// Funcție pentru a asocia numărul cu o culoare
const getColor = (number) => {
  switch (number) {
    case 1:
      return "red";
    case 2:
      return "green";
    case 3:
      return "blue";
    case 4:
      return "yellow";
    default:
      return "gray";
  }
};

export default ChromaMemory;
