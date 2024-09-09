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
    
    //Entrada pala madera
    let palaNode = document.createElement("img");
    palaNode.src = "../imgs/pala.png";
    gameBoxNode.appendChild(palaNode);
    palaNode.style.animation = ("show2 3s");
    palaNode.style.zIndex = 0.5;
    palaNode.style.position ="absolute";
    palaNode.style.top ="100px";
    palaNode.style.left ="-891px";

    //Create first pizza
    pizza = new Pizza();


    //Create current ingredient
    let timeoutId = setTimeout(()=>{
        currentIngredient = new Ingredient(600, 0, pizza.ingredientsList[0]);
        pizza.ingredientsList.shift() 
        palaNode.remove();
        clearTimeout(timeoutId)}
    ,3000);

    // Place Slots in Pizza
    timeoutId = setTimeout(()=>{
        pizza.placeSlotsCircle(10);
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
    let hasCollided = -1;
    
    for (let i = 0; i < pizza.slots.length; i++) {
        let slot = pizza.slots[i];
        
        hasCollided = collision(currentIngredient, slot)
        
        if(hasCollided) {
            if(slot.correctPlacement(currentIngredient.type)){
                pizza.totalIngPlaced++;
            };
            //else .style.innerText = PERFECT!
            currentIngredient.removeIngredient();
            currentIngredient = null;
            break;
        }
    }

    if(!hasCollided){
        currentIngredient.removeIngredient();
        currentIngredient = null;
    }

    let h2Node = document.createElement("h2");
    document.querySelector("ul").appendChild(h2Node);
    h2Node.style.position = "absolute";
    h2Node.style.width = "200px";
    h2Node.style.fontSize = "32px";
    h2Node.style.left = `${500}px`;
    h2Node.style.top = `${50}px`;   
    h2Node.style.textAlign = "center";
    h2Node.style.webkitTextStroke = "1px white";

    // puede colisionar y ser diferente type 🟠
    switch(hasCollided){
        case 4:
            h2Node.innerText = "PERFECT";
            h2Node.style.color = "#28a745";
            break;
        case 3:
            h2Node.innerText = "GREAT";
            h2Node.style.color = "#ffd700";
            break;
        case 2:
            h2Node.innerText = "GOOD";
            h2Node.style.color = "#ffeb3b";
            break;
        case 1:
            h2Node.innerText = "POOR";
            h2Node.style.color =  "#ff6f00";
            break;
        default:
            h2Node.innerText = "MISS";
            h2Node.style.color = "#dc3545";
            break;
    
    }
    h2Node.style.animation = "correct 2s";
    // console.log(h2Node.style.textAlign);

    let timerAnimation = setTimeout(()=>{
        h2Node.remove();
        clearTimeout(timerAnimation)
    }, 1880)

    
}

//Return truthy area
function collision(ingredient, slot){
    if (ingredient.x < slot.x + slot.w &&
        ingredient.x + ingredient.w > slot.x &&
        ingredient.y < slot.y + slot.h &&
        ingredient.y + ingredient.h > slot.y
    ) {
        let widthIntersection = Math.max(ingredient.x, slot.x) - Math.min(ingredient.x + ingredient.w, slot.x + slot.w);
        let heightIntersection = Math.max(ingredient.y, slot.y) - Math.min(ingredient.y + ingredient.h, slot.y + slot.h);
        let area = (widthIntersection*heightIntersection/(slot.w*slot.h)*100);

        if(area > 70) return 4;
        else if(area > 50) return 3;
        else if(area > 35) return 2;
        else return 1;
    }
    else return 0;
}

//Check if currentIngredient collision with Floor
function checkCollisionFloor(){
    if(currentIngredient.y + currentIngredient.h >= gameBoxNode.offsetHeight) {
        currentIngredient.removeIngredient();
        currentIngredient = null;
        checkPizzaCompleted();
    }
}

function checkPizzaCompleted() {
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
        checkPizzaCompleted();
    }
});

window.addEventListener("keyup", (event)=>{
    keyLeft = false;
    keyRight = false;
    keyDown = false;
    // currentIngredient.speedX = 0;
    // currentIngredient.speedY = 0;
});