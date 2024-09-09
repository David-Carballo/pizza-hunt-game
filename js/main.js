/**
 * * DOM 
*/
//Views
const startViewNode = document.querySelector("#start-scene");
const gameViewNode = document.querySelector("#game-scene");
const endViewNode = document.querySelector("#end-scene");

//Buttons
const startBtnNode = document.querySelector("#start-btn");
const resetBtnNode = document.querySelector("#reset-btn");

///Nodes
const gameBoxNode = document.querySelector("#game-box");
let pizzaNode = null;


/**
 * * VARIABLES GLOBALES
*/

let timerGame = null;
let pizza = null;
let currentIngredient = null;


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
    let timeoutId = setTimeout(()=>{
        currentIngredient = new Ingredient(100, 0, "mushroom"); 
        clearTimeout(timeoutId)},3000);

    timeoutId = setTimeout(()=>{
        pizza.placeIngredients(4);
        clearTimeout(timeoutId)},2000);
    // currentIngredient = new Ingredient(100, 0, "mushroom");


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
function checkCorrectPlacement() {
    console.log("space");
    const slotsNodeList = gameBoxNode.querySelectorAll("#slots-list img");

    for (let i = 0; i < pizza.slots.length; i++) {
        let slot = pizza.slots[i];
        console.log(slot);

        //calcular Area de collision 🟠
        if(collision(currentIngredient, slot)) {
            slot.node.style.filter = "";
            currentIngredient.removeIngredient();
            currentIngredient = null;

            break;
        }
    }
}

function collision(ingredient, slot){
    if (ingredient.x < slot.x + slot.w &&
        ingredient.x + ingredient.w > slot.x &&
        ingredient.y < slot.y + slot.h &&
        ingredient.y + ingredient.h > slot.y
    ) return true;
    else return false;
}

//Check if currentIngredient collision with Floor
function checkCollisionFloor(){
    if(currentIngredient.y + currentIngredient.h >= gameBoxNode.offsetHeight) {
        currentIngredient.removeIngredient();
        currentIngredient = null;
        // gameOver(); 🟠
    }
}

function gameOver() {
    resetGameState();

    //DOM Game Over

    //Change scenes
    gameViewNode.style.display = "none";
    endViewNode.style.display = "flex"

}

function resetGameState(){ //🟠

}


/**
 * * EVENT LISTENERS
*/

startBtnNode.addEventListener("click", startGame);
resetBtnNode.addEventListener("click", resetGameState);

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

    if(event.key === " ") checkCorrectPlacement();
    
});

window.addEventListener("keyup", (event)=>{
    keyLeft = false;
    keyRight = false;
    keyDown = false;
    // currentIngredient.speedX = 0;
    // currentIngredient.speedY = 0;
});