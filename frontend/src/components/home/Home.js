import React, {useEffect, useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import "./Home.scss";
import gameService from "../../services/gameService";
import VerifyTokenService from "../../services/verifyTokenService";
import { useNavigate, Link } from "react-router-dom";
import MathImage from "./images/mat.png";
import MemoryImage from "./images/mem.png";
import { Carousel } from "primereact/carousel";
import { Chart } from 'primereact/chart';
import CategoryScoreService from "../../services/categoryScoreService";
import Spinner from "react-bootstrap/Spinner";

const Home = () => {
  // Scoruri maxime pentru fiecare joc
    const [categories, setCategories] = useState(null);
    const [lastGames, setLastGames] = useState(null);
    const [highestScores, setHighestScore] = useState(null);
    const [user, setUser] = useState(null);
    const [carouselData, setCarouselData] = useState(null);

    let navigate = useNavigate();

    useEffect(()=>{
    let response = VerifyTokenService.verify(navigate).then((res) => {setUser(res); console.log(res)})  
    let categories = gameService.fetchCategoriesAndGames()
        .then(res => {
            setCategories(res.data);
        });


    gameService.getHighestScores()
        .then(res => {
            setHighestScore(res.data);
        })
    CategoryScoreService.insertCategoryScore()
    .then(res=>{
      console.log(res.data);
    })
    
    CategoryScoreService.getCategoriesEvolutions()
    .then(res =>{
      console.log("EVOLUTIONS")
      console.log(res.data);
      setCarouselData(res.data);
    })

    gameService.getLastGames()
    .then(res => {
      console.log("LAST GAMES")
        console.log(res.data)
        setLastGames(res.data)
    })
    },[]); // eslint-disable-line react-hooks/exhaustive-deps  


    const formatDate = (date) => {
        let newDate = new Date(date);
        return `${newDate.getDate()}/${newDate.getMonth() + 1}/${newDate.getFullYear()}`;
    }

  const options = {
    height:180
};

  return (
    <Container fluid className="p-5">
        
        {user && 
        <div class="welcome">
            <img src="https://t4.ftcdn.net/jpg/05/89/93/27/360_F_589932782_vQAEAZhHnq1QCGu5ikwrYaQD0Mmurm0N.webp" alt="Avatar"/>
            <h1 className="text-center mb-4">Welcome, {user.firstName}</h1>
        </div>
        }

        
      <Row>
        <Col md={6} lg={4} className="mb-4 ">
          <Card className="h-100 homepage-container">
            <Card.Body>
              <Card.Title>Last Games</Card.Title>
              {/* <Card.Text> */}
                {lastGames && lastGames.map((element, index) => {
                    return(
                        <p key = {index}> {element.Game.name} : {element.score} points, {formatDate(element.createdAt)} </p>
                    )
                })}
                {Array.isArray(lastGames) && lastGames.length == 0 && <p style={{textAlign:"center"}}>No records found.</p>}
                {lastGames == null && <div className="spinner-container"><Spinner animation="grow" variant="success" size="lg"/></div>}
              {/* </Card.Text> */}
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={4} className="mb-4">
          <Card className="h-100 homepage-container">
            <Card.Body>
              <Card.Title>Highest Scores</Card.Title>
              <Card.Text>
                {highestScores && highestScores.map((element,index) => {
                    return(
                        <p key = {index}> {element.Game.name} : {element.score} points, {formatDate(element.createdAt)} </p>
                    )
                })}
                {Array.isArray(highestScores) && highestScores.length == 0 && <p style={{textAlign:"center"}}>No records found.</p>}
                {highestScores == null && <div className="spinner-container"><Spinner animation="grow" variant="success" size="lg"/></div>}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={12} lg={4} className="mb-4">
          <Card className="h-100 homepage-container">
            <Card.Body>
              <Card.Title>Your evolution</Card.Title>
              <Card.Text>
                {carouselData && carouselData.length > 0 &&<Carousel value={carouselData} numVisible={1} numScroll={1} autoplayInterval={3000} orientation="vertical" verticalViewPortHeight="170px" itemTemplate={(obj) => {
                  return(
                    <div>
                      <Chart type="line" data={obj} options={options} height="170px" width="400px"/>
                    </div>
                  )
                }} />}
                {Array.isArray(carouselData) && carouselData.length == 0 && <p style={{textAlign:"center"}}>No records found.</p>}
                {carouselData == null && <div className="spinner-container"><Spinner animation="grow" variant="success" size="lg"/></div>}

              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col lg={12} className="mb-4">
          <Card className="h-100 homepage-container">
            <Card.Body>
              <Card.Title>Your Games</Card.Title>

                <Row>
                    {categories && categories.map((category, index) => {
                        console.log(category.Games)
                        return (
                            <>
                                <Col md={12} className="mb-4" key={`category-${index}`}>
                                    <h4 className="text-success">{category.name}</h4>
                                </Col>
                                {   
                                    category.Games.map((game, index) =>{
                                        return (
                                            <Col lg={2} md={3} sm={5} className="mb-4" key={`game-${index}`} >
                                                <Card className="h-100">
                                                <Card.Img variant="top" src={category.name == 'Math' ? MathImage : MemoryImage} />
                                                <Card.Body>
                                                    <Card.Title>{game.name}</Card.Title>
                                                    <Link to = {`/${category.name}/${game.name}`}>
                                                        <Button variant="success" className="w-100">
                                                        Play
                                                        </Button>
                                                    </Link>
                                                </Card.Body>
                                                </Card>
                                            </Col>
                                            

                                        )
                                    })
                                }
                            
                            </>
                        )
                    })}

                </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
