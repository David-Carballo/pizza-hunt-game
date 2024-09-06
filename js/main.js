/**
 * * DOM 
*/

const startViewNode = document.querySelector("#start-scene");
const gameViewNode = document.querySelector("#game-scene");
const endViewNode = document.querySelector("#end-scene");
const startBtnNode = document.querySelector("#start-btn");

const gameBoxNode = document.querySelector("#game-box");

/**
 * * VARIABLES GLOBALES
*/

let timerGame = null;
let pizza = null;
let ingredient = null;

let keyDown = null;
let keyLeft = null;
let keyRight = null;

/**
 * * FUNCIONES
*/

function startGame(){

    //change scenes
    startViewNode.style.display = "none";
    gameViewNode.style.display = "flex";

    //create objects
    ingredient = new Ingredient();

    //loop time of game
    timerGame = setInterval(()=>{
        gameLoop();

        checkCollisionFloor(); //

    }, Math.round(1000/60));


};

function gameLoop(){
    ingredient.gravity();
    ingredient.movement();
};

function checkCollisionFloor(){
    if(ingredient.y + ingredient.h >= gameBoxNode.offsetHeight) {
        console.log("SUELOOO")
        //❓❓❓
    }
}


/**
 * * EVENT LISTENERS
*/

startBtnNode.addEventListener("click", startGame);
window.addEventListener("keydown", (event)=>{
    switch(event.key){
        case "a":
            keyLeft = true;
            break;
        case "d":
            keyRight = true;
            break;
        case "s":
            keyDown = true;
            break;
        default:
            break;
    }
});

window.addEventListener("keyup", (event)=>{
    keyDown = false;
    keyLeft = false;
    keyRight = false;
});