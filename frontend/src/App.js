import React from "react";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import './App.css';
import Board from "./games/memory/card-match/Board";
import MathBlitz from "./games/math/result-guesser/MathBlitz";
import SortSprint from "./games/math/sort-sprint/SortSprint";
import MathMistery from "./games/math/math-mistery/MathMistery";
import ChromaMemory from "./games/memory/chroma-memory/ChromaMemory";
import Home from "./components/home/Home";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="register" element={<Register/>}/>
        <Route path="/" element={<Home/>}/>
        <Route path="login" element={<Login/>}/>
        <Route path="memory/RecallRush" element={<Board/>}/>
        <Route path="math/MathBlitz" element={<MathBlitz/>}/>
        <Route path="math/SortSprint" element={<SortSprint/>}/>
        <Route path="math/MathMistery" element={<MathMistery/>}/>
        <Route path="memory/ChromaMemory" element={<ChromaMemory/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
