import React, { useState, useEffect } from 'react';
import './MathBlitz.scss';
import { useNavigate } from 'react-router-dom';
import VerifyTokenService from '../../../services/verifyTokenService';
import GameService from '../../../services/gameService';
import ScoreService from '../../../services/scoreService';


const generateProblem = (level) => {
  const maxNumber = level * 10;
  const num1 = Math.floor(Math.random() * maxNumber) + 1;
  const num2 = Math.floor(Math.random() * maxNumber) + 1;
  const operatorIndex = Math.floor(Math.random() * 3);
  const operators = ['+', '-', '*'];
  const operator = operators[operatorIndex];
  let correctAnswer;

  switch (operator) {
    case '+':
      correctAnswer = num1 + num2;
      break;
    case '-':
      correctAnswer = num1 - num2;
      break;
    case '*':
      correctAnswer = num1 * num2;
      break;
    default:
      correctAnswer = num1 + num2;
  }

  return { num1, num2, operator, correctAnswer };
};

const generateOptions = (correctAnswer) => {
  const options = new Set([correctAnswer]);
  while (options.size < 4) {
    options.add(correctAnswer + Math.floor(Math.random() * 10) - 5);
  }
  return Array.from(options).sort(() => Math.random() - 0.5);
};

const MathBlitz = () => {
  const [level, setLevel] = useState(1);
  const [problem, setProblem] = useState(generateProblem(1));
  const [options, setOptions] = useState(generateOptions(problem.correctAnswer));
  const [message, setMessage] = useState('');
  const [timer, setTimer] = useState(10);
  const [gameOver, setGameOver] = useState(false);
  const [gameId, setGameId] = useState(false);

  let navigate = useNavigate();
  useEffect(()=>{
    let response = VerifyTokenService.verify(navigate)
    GameService.fetchGameIdByName('MathBlitz').
    then((res) => {
        setGameId(res.data.id);
        console.log(res.data.id);
    })
  },[]); // eslint-disable-line react-hooks/exhaustive-deps  

  useEffect(() => {
    if (timer === 0) {
      setMessage(`Time is up! The correct answer was ${problem.correctAnswer}.`);
      setGameOver(true);
    }

    if (!gameOver) {
      const countdown = setInterval(() => {
        setTimer((prev) => (prev > 0 ? prev - 0.1 : 0));
      }, 100);

      return () => clearInterval(countdown);
    }
  }, [timer, problem.correctAnswer]);

  useEffect(() =>{

    if(gameOver){
        ScoreService.insertScore({
            gameId: gameId,
            score: level*100
        })
    }

  }, [gameOver])

  const handleOptionClick = (option) => {
    if (option === problem.correctAnswer) {
      setMessage('Correct! Next level.');
      setLevel((prev) => prev + 1);
      const newProblem = generateProblem(level + 1);
      setProblem(newProblem);
      setOptions(generateOptions(newProblem.correctAnswer));
      setTimer(10); // Reset the timer to 10 seconds for the new level
    } else {
      setMessage('Incorrect. Try again.');
    }
  };

  const handleRestart = () => {
    setLevel(1);
    const newProblem = generateProblem(1);
    setProblem(newProblem);
    setOptions(generateOptions(newProblem.correctAnswer));
    setMessage('');
    setTimer(10);
    setGameOver(false);
  };

  return (
    <div className='math-blitz-container'>
        <div className="math-blitz">
        <div className="progress-bar" 
             style={{
                 width: timer <= 1 && timer > 0 ? "1%" : `${(timer / 10) * 100}%`,
             }}></div>
        <h1>Math Blitz</h1>
        <p>Solve the problem before the time runs out!</p>
        <div className="problem">
            <span>{problem.num1}</span>
            <span> {problem.operator} </span>
            <span>{problem.num2}</span>
            <span> = ?</span>
        </div>
        <div className="options">
            {options.map((option, index) => (
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
        {gameOver && <button className=' button btn btn-color p-2 mb-3' onClick={handleRestart}>Restart</button>}
        </div>
    </div>
  );
};

export default MathBlitz;