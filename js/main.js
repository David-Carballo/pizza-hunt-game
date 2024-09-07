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
let placeIngredient = null;


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
    ingredient = new Ingredient("bacon");
    placeIngredient = new Ingredient("bacon",true);
    placeIngredient.y = 300;
    placeIngredient.updatePos();

    //loop time of game
    timerGame = setInterval(()=>{
        gameLoop();
    }, Math.round(1000/60));


};

function gameLoop(){
    
    ingredient.gravity();
    ingredient.movement();

    checkCollisionFloor();
    checkCorrectPlacement(ingredient, placeIngredient);
};

function checkCorrectPlacement(object, place) {
    if ( object.x < place.x + place.w &&
        object.x + object.w > place.x &&
        object.y < place.y + place.h &&
        object.y + object.h > place.y
      ) {
        // Collision detected!
        console.log(place.node);
        place.node.style.filter = "";
        object.removeIngredient();
      }
}

function checkCollisionFloor(){
    if(ingredient.y + ingredient.h >= gameBoxNode.offsetHeight) {
        ingredient.removeIngredient();
    }
}


/**
 * * EVENT LISTENERS
*/

startBtnNode.addEventListener("click", startGame);
window.addEventListener("keydown", (event)=>{
    if(event.key === "a")  keyLeft = true;
    if(event.key === "d")  keyRight = true;
    if(event.key === "s")  keyDown = true;
});

window.addEventListener("keyup", (event)=>{
    keyLeft = false;
    keyRight = false;
    keyDown = false;
});