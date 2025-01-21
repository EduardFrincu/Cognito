import React, { useState, useEffect } from "react";
import "./SortSprint.scss";
import { useNavigate } from "react-router-dom";
import VerifyTokenService from "../../../services/verifyTokenService";
import GameService from "../../../services/gameService";
import ScoreService from "../../../services/scoreService";

const generateNumbers = (level) => {
  const numbers = [];
  for (let i = 0; i < level + 2; i++) {
    numbers.push(Math.floor(Math.random() * 100));
  }
  return numbers.sort(() => Math.random() - 0.5); // Shuffle numbers
};

const SortSprint = () => {
  const [level, setLevel] = useState(1);
  const [numbers, setNumbers] = useState(generateNumbers(1));
  const [message, setMessage] = useState("");
  const [timer, setTimer] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [gameId, setGameId] = useState(false);

 
  let navigate = useNavigate();
  useEffect(()=>{
    let response = VerifyTokenService.verify(navigate)
    GameService.fetchGameIdByName('SortSprint').
    then((res) => {
        setGameId(res.data.id);
    })
  },[]); // eslint-disable-line react-hooks/exhaustive-deps  


  useEffect(() => {
    if (timer === 0) {
      setMessage("Time is up! Restarting the game.");
      setGameOver(true);

    }

    if (!gameOver) {
      const countdown = setInterval(() => {
        setTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      return () => clearInterval(countdown);
    }
  }, [timer]);

  useEffect(() => {
    if(gameOver){
        ScoreService.insertScore({
            gameId: gameId, 
            score: level*100 
          })
    }
  }, [gameOver]);

  useEffect(() => {
    setNumbers(generateNumbers(level));
    setTimer(30); // Reset timer for new level
  }, [level]);

  const handleDragStart = (event, index) => {
    event.dataTransfer.setData("dragIndex", index);
  };

  const handleDrop = (event, dropIndex) => {
    const dragIndex = event.dataTransfer.getData("dragIndex");
    const newNumbers = [...numbers];
    const draggedNumber = newNumbers[dragIndex];

    newNumbers.splice(dragIndex, 1);
    newNumbers.splice(dropIndex, 0, draggedNumber);

    setNumbers(newNumbers);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const checkOrder = () => {
    for (let i = 0; i < numbers.length - 1; i++) {
      if (numbers[i] > numbers[i + 1]) {
        return false;
      }
    }
    return true;
  };

  const handleCheck = () => {
    if (checkOrder()) {
      setMessage("Correct! Proceeding to the next level.");
      setLevel((prev) => prev + 1);
    } else {
      setMessage("Incorrect order. Try again.");
    }
  };

  const handleRestart = () => {
    setLevel(1);
    setNumbers(generateNumbers(1));
    setMessage("");
    setTimer(30);
    setGameOver(false);
  };

  return (
    <div className="sort-sprint-container">
        <div className="sort-sprint">
            <div
                className="progress-bar"
                style={{
                    width: timer <= 1 && timer > 0 ? "1%" : `${(timer / 30) * 100}%`,
                  }}
            ></div>
            <h1>Sort Sprint</h1>
            <p>Arrange the numbers in ascending order!</p>
            <div className="numbers-container">
                {numbers.map((number, index) => (
                    <div
                    key={index}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragOver={handleDragOver}
                    className="number"
                    >
                    {number}
                    </div>
                ))}
            </div>
            <button onClick={handleCheck} disabled={gameOver}>
            Check Order
            </button>
            <p>{message}</p>
            <p>Level: {level}</p>
            {gameOver && <button onClick={handleRestart}>Restart</button>}
        </div>
    </div>
  );
};

export default SortSprint;
