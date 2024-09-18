import { useState, useEffect } from "react";
import ColorCard from "./components/ColorCard";
import "./App.css";
import Timeout from "./utils/Util";

function App() {
  const [isOn, setIsOn] = useState(false); // setea el estado de juego de inicio

  const colorList = ["green", "red", "yellow", "blue"]; 
  //objeto para el estado inicial del juego
  const initPlay = {
    isDisplay: false,
    colors: [],
    score: 0,
    userPlay: false,
    userColors: [],
  };
  const [play, setPlay] = useState(initPlay); // setea el estado de juego a el estado de "empezo el juego"
  const [flashColor, setFlashColor] = useState("");// setea el estado para que los colores hagan efecto flash
  //funcion para comenzar el juego
  function handleStartGame() {
    setIsOn(true);
  }
//cambia el isDisplay a true cuando isOn es true
  useEffect(() => {
    if (isOn) {
      setPlay({ ...initPlay, isDisplay: true });
    } else {
      setPlay(initPlay);
    }
  }, [isOn]);
//randomiza los colores para devolver el patron cuando isOn e isDisplay son true
  useEffect(() => {
    if (isOn && play.isDisplay) {
      let newColor = colorList[Math.floor(Math.random() * 4)];

      const copyColors = [...play.colors];
      copyColors.push(newColor);
      setPlay({ ...play, colors: copyColors });
    }
  }, [isOn, play.isDisplay]);
//cuando isOn e isDisplay son true y la longitud de colores es almenos 1, muestra el patron de colores ilumminado
  useEffect(() => {
    if (isOn && play.isDisplay && play.colors.length) {
      displayColors();
    }
  }, [isOn, play.isDisplay, play.colors.length]);
//funcion para que los colores se iluminen
  async function displayColors() {
    await Timeout(2000);
    for (let i = 0; i < play.colors.length; i++) {
      setFlashColor(play.colors[i]);
      await Timeout(1000);
      setFlashColor("");
      await Timeout(1000);

      if (i === play.colors.length - 1) {
        const copyColors = [...play.colors];
        //setea para que sea el turno del jugador
        setPlay({
          ...play,
          isDisplay: false,
          userPlay: true,
          userColors: copyColors.reverse(),
        });
      }
    }
  }
//funcion para manejar los clicks de los botones y que coincidan con el patron
  async function handleClick(color) {
    if (!play.isDisplay && play.userPlay) {
      const copyUserColors = [...play.userColors];
      const lastColor = copyUserColors.pop();
      setFlashColor(color);
      if (color === lastColor) {
        if (copyUserColors.length) {
          setPlay({ ...play, userColors: copyUserColors });
        } else {
          await Timeout(500);
          //setea para que sea el turno de la maquina
          setPlay({
            ...play,
            isDisplay: true,
            userPlay: false,
            score: play.colors.length,
            userColors: [],
          });
        }
      } else {
        await Timeout(1000);
        setPlay({ ...initPlay, score: play.colors.length });
      }

      await Timeout(1000);
      setFlashColor("");
    }
  }
//funcion para manejar el reinicio del juego
  function handleClose(){
    setIsOn(false);
  }

  return (
    <>
     <header>
      <h1 className="title">Simons Says</h1>
     </header>
      <main className="game-container">
        <div className="buttons-container">
          <ColorCard
            color="red"
            light={flashColor === "red"}
            onClick={() => {
              handleClick("red");
            }}
          />
          <ColorCard
            color="blue"
            light={flashColor === "blue"}
            onClick={() => {
              handleClick("blue");
            }}
          />
          <ColorCard
            color="yellow"
            light={flashColor === "yellow"}
            onClick={() => {
              handleClick("yellow");
            }}
          />
          <ColorCard
            color="green"
            light={flashColor === "green"}
            onClick={() => {
              handleClick("green");
            }}
          />
        </div>
        {isOn && !play.isDisplay && !play.userPlay && play.score && (
          <div className="game-over">
            <div>Final Score: {play.score}</div>
            <button onClick={handleClose}>Close</button>
          </div>
        )}
        {!isOn && !play.score && (
          <button onClick={handleStartGame} className="start-button">
            Iniciar Juego
          </button>
        )}
        {isOn && (play.isDisplay || play.userPlay) && (
          <div className="score">{play.score}</div>
        )}
      </main>
    </>
  );
}

export default App;
