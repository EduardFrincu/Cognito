import React, { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import "./MathMistery.scss";

import GameService from "../../../services/gameService";
import VerifyTokenService from "../../../services/verifyTokenService";
import ScoreService from "../../../services/scoreService";

const generatePattern = (level) => {
  const length = 5 + parseInt(level/10);
  const start = Math.floor(Math.random() * 10);
  const step = Math.floor(Math.random() * 5) + 1;

  const pattern = [];


  for (let i = 0; i < length; i++) {
    pattern.push(start + i * step);
  }

  const correctAnswer = start + length * step;

  // Generate multiple choice answers
  const options = new Set();
  options.add(correctAnswer);
  while (options.size < 4) {
    options.add(correctAnswer + Math.floor(Math.random() * 10) - 5);
  }

  return {
    pattern,
    correctAnswer,
    options: Array.from(options).sort(() => Math.random() - 0.5),
  };
};

const MathMistery = () => {
  const [level, setLevel] = useState(1);
  const [gameData, setGameData] = useState(generatePattern(1));
  const [message, setMessage] = useState("");
  const [timer, setTimer] = useState(10);
  const [gameOver, setGameOver] = useState(false);
  const [gameId, setGameId] = useState(false);

  let navigate = useNavigate();
  useEffect(()=>{
    let response = VerifyTokenService.verify(navigate)
    GameService.fetchGameIdByName('MathMistery').
    then((res) => {
        setGameId(res.data.id);
    })
  },[]); // eslint-disable-line react-hooks/exhaustive-deps  

  

  useEffect(() => {
    if (timer === 0) {
      setMessage(
        `Time is up! The correct answer was ${gameData.correctAnswer}.`);
      setGameOver(true);

    }
    if(gameOver){
        ScoreService.insertScore({
            gameId: gameId,
            score: level*100 
          })
    
    }

    if (!gameOver) {
      const countdown = setInterval(() => {
        setTimer((prev) => (prev > 0 ? prev - 0.1 : 0));
      }, 100);

      return () => clearInterval(countdown);
    }
  }, [timer, gameOver, gameData.correctAnswer]);

  useEffect(() => {
    setGameData(generatePattern(level));
    setTimer(10 - parseInt(level/5)); // Reset timer for new level
  }, [level]);

  const handleOptionClick = (option) => {
    if (option === gameData.correctAnswer) {
      setMessage("Correct! Proceeding to the next level.");
      setLevel((prev) => prev + 1);
    } else {
      setMessage("Incorrect. Try again.");
    }
  };

  const handleRestart = () => {
    setLevel(1);
    setGameData(generatePattern(1));
    setMessage("");
    setTimer(10);
    setGameOver(false);
  };

//   console.log(gameData.pattern);

  return (
    <div className="math-mistery-container">
        <div className="math-mistery">
        <div
            className="progress-bar"
            style={{
            width: timer <= 1 && timer > 0 ? "1%" : `${(timer / 10) * 100}%`,
            }}
        >
        </div>
        <h1>Math Mistery</h1>
        <p>Guess the next number in the pattern!</p>
        <div className="pattern">
            {gameData.pattern.map((number, index) => (
            <button key={index} className="pattern-button">
                {number}
            </button>
            ))}
            <button className="pattern-button question">?</button>
        </div>
        <div className="options">
            {gameData.options.map((option, index) => (
            <button
                key={index}
                onClick={() => handleOptionClick(option)}
                disabled={gameOver}
            >
                {option}
            </button>
            ))}
        </div>
        <p>{message}</p>
        <p>Level: {level}</p>
        {gameOver && <button onClick={handleRestart}>Restart</button>}
        </div>
    </div>
  );
};

export default MathMistery;
