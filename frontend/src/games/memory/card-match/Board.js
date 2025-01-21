import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "./Card";
import './Board.scss';
import GameService from "../../../services/gameService";
import ScoreService from "../../../services/scoreService";
import VerifyTokenService from "../../../services/verifyTokenService";


const uniqueCardsArray = [
    {
      type: "apple",
      image: require(`./images2/apple.jpg`)
    },
    {
      type: "ball",
      image: require(`./images2/ball.jpeg`)
    },
    {
      type: "car",
      image: require(`./images2/car.jpg`)
    },
    {
      type: "cat",
      image: require(`./images2/cat.png`)
    },
    {
      type: "dog",
      image: require(`./images2/dog.png`)
    },
    {
      type: "house",
      image: require(`./images2/house.png`)
    },
    // {
    //   type: "house2",
    //   image: require(`./images/pokeball.png`)
    // }
  ];

  const shuffleCards = (cards) =>{
    const length = cards.length;
    for(let i = length; i> 0; i--){
        const randomIndex = Math.floor(Math.random() * i);
        const currentIndex = i-1;
        const temp = cards[currentIndex];

        cards[currentIndex] = cards[randomIndex];
        cards[randomIndex] = temp;
    }
    return cards;

  }
  
  const Board = () => {

    const [cards, setCards] = useState(() => shuffleCards(uniqueCardsArray.concat(uniqueCardsArray)));
    const [openCards, setOpenCards] = useState([]);
    const [clearedCards, setClearedCards] = useState({});
    const [shouldDisableAllCards, setShouldDisableAllCards] = useState(false);
    const [moves, setMoves] = useState(0);
    const [gameId, setGameId] = useState(null);
    const[beginningTimestamp, setBeginningTimestamp] = useState(Math.floor(Date.now()/1000));
    const timeout = useRef(null);


    let navigate = useNavigate();
    useEffect(()=>{
      let response = VerifyTokenService.verify(navigate)
      GameService.fetchGameIdByName('RecallRush').
      then((res) => {
          setGameId(res.data.id);
      })
    },[]); // eslint-disable-line react-hooks/exhaustive-deps  
  

    const disable = () => {
        setShouldDisableAllCards(true);
    }
    const enable = () => {
        setShouldDisableAllCards(false);
    }

    const checkCompletion = () => {
        if(Object.keys(clearedCards).length === uniqueCardsArray.length){
            console.log("Completed");
            console.log(Math.floor(Date.now()/1000) - beginningTimestamp);

            const score = 100000 / ((Math.floor(Date.now()/1000) - beginningTimestamp) * moves);
            ScoreService.insertScore({
                gameId:gameId,
                score:score
            })
        }
    }

    const evaluate = () => {
        console.log("Evaluate");
        const [first, second ] = openCards;
        enable();
        if(cards[first].type === cards[second].type){
            console.log("IN IF")
            setClearedCards((prev) => ({...prev, [cards[first].type]:true}));
            setOpenCards([]);
        }
        //flip back the open cards after 500ms
        timeout.current = setTimeout(() => {
            setOpenCards([]);
        }, 500);

    }
    console.log(clearedCards)

    const handleCardClick = (index) => {
        //there is already a card opened
        console.log("OPENED A CARD");
        console.log(index)
        if(openCards.length === 1){
            setOpenCards((prev) => [...prev, index]);
            setMoves((moves) => moves + 1);
            disable();
        }else{
            clearTimeout(timeout.current);
            setOpenCards([index]);
        }
        console.log(openCards)
    };

    

    useEffect(() => {
        let timeout = null;
        if(openCards.length === 2){
            console.log("EVV");
            timeout = setTimeout(evaluate,300);
        }

        return () => {
            clearTimeout(timeout);
        }

    },[openCards]);

    useEffect(() => {
        checkCompletion();
    },[clearedCards]);

    const checkIsFlipped = (index) => {
        return openCards.includes(index);
    }

    const checkIsInactive = (card) => {
        return Boolean(clearedCards[card.type]);
    }

    const handleRestart = () => {
        setClearedCards({});
        setOpenCards([]);
        setMoves(0);
        setBeginningTimestamp(Math.floor(Date.now()/1000));
        setShouldDisableAllCards(false);
        setCards(shuffleCards(uniqueCardsArray.concat(uniqueCardsArray)));
    }


    return (
        <div className="Board">
            <header>
                <h3>Play the Flip card memory game</h3>
                <div>
                    Select two cards with same content consequtively to make them vanish
                </div>
            </header>
            <div className="container">
                {cards.map((card,index) => {
                    // console.log(cards);
                    return (
                        <Card
                            key={index}
                            card={card}
                            index={index}
                            isDisabled={shouldDisableAllCards}
                            isInactive={checkIsInactive(card)}
                            isFlipped={checkIsFlipped(index)}
                            onClick = {handleCardClick}
                        />
                    )
                })}
            </div>
            <footer>
                <div className="score">
                <div className="moves">
                    <span className="bold">Moves:</span> {moves}
                </div>
                </div>
                <div className="restart">
                <button onClick={handleRestart} className="button btn btn-color p-2 mb-3" variant="contained">
                    Restart
                </button>
                </div>
            </footer>
        
        </div>
    )
  }
  
  export default Board
  