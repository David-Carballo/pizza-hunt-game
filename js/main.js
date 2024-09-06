/**
 * * DOM 
*/

const startViewNode = document.querySelector("#start-scene");
const gameViewNode = document.querySelector("#game-scene");
const endViewNode = document.querySelector("#end-scene");
const startBtnNode = document.querySelector("#start-btn");


/**
 * * VARIABLES GLOBALES
*/

let timerGame = null;
let pizza = null;

/**
 * * FUNCIONES
*/

function startGame(){

    //change scenes
    startViewNode.style.display = "none";
    gameViewNode.style.display = "flex";

    //create objects

    //loop time of game
    timerGame = setInterval(()=>{
        gameLoop();

    },Math.round(1000/60));


};

function gameLoop(){

};



/**
 * * EVENT LISTENERS
*/

startBtnNode.addEventListener("click", startGame);