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
        currentIngredient = new Ingredient(600, 0, pizza.ingredientsList[0]);
        pizza.ingredientsList.shift() 
        clearTimeout(timeoutId)}
    ,3000);

    // Place Slots in Pizza
    timeoutId = setTimeout(()=>{
        pizza.placeSlots(2);
        clearTimeout(timeoutId)}
    ,2000);

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
    let hasCollided = false;
    for (let i = 0; i < pizza.slots.length; i++) {
        let slot = pizza.slots[i];
        
        hasCollided = collision(currentIngredient, slot)
        //calcular Area de collision 🟠
        if(hasCollided) {
            if(slot.correctPlacement(currentIngredient.type)){
                pizza.totalIngPlaced++;
                //.style.innerText = PERFECT!
            };
            //else .style.innerText = PERFECT!
            currentIngredient.removeIngredient();
            currentIngredient = null;
            break;
        }
    }

    //Ingrediente sin colocar 🟠
    if(!hasCollided){
        currentIngredient.removeIngredient();
        currentIngredient = null;
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
    //DOM Game Over

    //Change scenes
    gameViewNode.style.display = "none";
    endViewNode.style.display = "flex"

}

function resetGameState(){ //🟠
    //Remove all created nodes
    document.querySelectorAll("#game-box *:not(p)").forEach((node)=>{node.remove()});

    //Reset all variables
    pizzaNode = null;
    pizza = null;
    currentIngredient = null;
    clearInterval(timerGame);
    endViewNode.style.display = "none";
    startViewNode.style.display = "flex";
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

    if(event.key === " ") {
        checkCorrectPlacement();

        if(pizza.ingredientsList.length > 0) {
            let timerDrop = setTimeout(()=> {
                currentIngredient = new Ingredient(600, 0, pizza.ingredientsList[0]);
                pizza.ingredientsList.shift() 
                clearTimeout(timerDrop);
            }, 1000);    
        }
        else {//Pizza has completed 🟠
            let h1CompleteNode = document.createElement("h1");
            if(pizza.totalIngPlaced === pizza.slots.length) h1CompleteNode.innerText = "GOOD JOB";
            else h1CompleteNode.innerText = "MEC MEC";
            gameBoxNode.appendChild(h1CompleteNode);
            h1CompleteNode.style.zIndex = 3;
            h1CompleteNode.style.position = "absolute";
            h1CompleteNode.style.left = "400px";
            h1CompleteNode.style.top = "250px";
            let timerGameOver = setTimeout(()=> {
                gameOver();
            }, 1000);  
        }
    }
});

window.addEventListener("keyup", (event)=>{
    keyLeft = false;
    keyRight = false;
    keyDown = false;
    // currentIngredient.speedX = 0;
    // currentIngredient.speedY = 0;
});