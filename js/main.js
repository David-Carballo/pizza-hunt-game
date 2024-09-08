/**
 * * DOM 
*/
//Views
const startViewNode = document.querySelector("#start-scene");
const gameViewNode = document.querySelector("#game-scene");
const endViewNode = document.querySelector("#end-scene");

//Buttons
const startBtnNode = document.querySelector("#start-btn");

///Nodes
const gameBoxNode = document.querySelector("#game-box");
let pizzaNode = null;


/**
 * * VARIABLES GLOBALES
*/

let timerGame = null;
let pizza = null;
let currentIngredient = null;
let placeIngredient = null;


let keyDown = null;
let keyLeft = null;
let keyRight = null;

/**
 * * FUNCIONES
*/

function startGame(){

    //Change scenes
    startViewNode.style.display = "none";
    gameViewNode.style.display = "flex";

    //Create first pizza
    pizza = new Pizza();

    //Create current ingredient
    // currentIngredient = new Ingredient(100, 0, "tomato");
    // placeIngredient = new Ingredient(100, 300, "tomato",true);


    //loop time of game
    timerGame = setInterval(()=>{
        gameLoop();
    }, Math.round(1000/60));


};

function gameLoop(){
    if(currentIngredient !== null) {
        currentIngredient.gravity();
        currentIngredient.movement();
        checkCollisionFloor();
    }
};

//Check if currentIngredient placed in slot
function checkCorrectPlacement(ingredient, slot) {
    if (ingredient.x < slot.x  + slot.w &&
        ingredient.x + ingredient.w > slot.x &&
        ingredient.y < slot.y  + slot.h &&
        ingredient.y + ingredient.h > slot.y
    ) {
        // console.log("Colocado!");
        slot.node.style.filter = "";
        ingredient.removeIngredient();
        currentIngredient = null;
    }
}

//Check if currentIngredient collision with Floor
function checkCollisionFloor(){
    if(currentIngredient.y + currentIngredient.h >= gameBoxNode.offsetHeight) {
        currentIngredient.removeIngredient();
        currentIngredient = null;
    }
}


/**
 * * EVENT LISTENERS
*/

startBtnNode.addEventListener("click", startGame);

window.addEventListener("keydown", (event)=>{
    if(event.key === "a" && !keyLeft && currentIngredient)  {
        keyLeft = true;
        currentIngredient.speedX = -3;
        currentIngredient.movement();
    }
    if(event.key === "d" && !keyRight && currentIngredient)  {
        keyRight = true;
        currentIngredient.speedX = 3;
        currentIngredient.movement();
    }
    if(event.key === "s" && !keyDown && currentIngredient){
        keyDown = true;
        currentIngredient.gravityAcc += 0.1;
        currentIngredient.movement();
    } 

    if(event.key === " ") checkCorrectPlacement(currentIngredient, placeIngredient);
    
});

window.addEventListener("keyup", (event)=>{
    keyLeft = false;
    keyRight = false;
    keyDown = false;
    
});