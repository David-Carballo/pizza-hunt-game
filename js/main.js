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
const audioBtnNode = document.querySelector("#audio-btn");

///Nodes
const gameBoxNode = document.querySelector("#game-box");
const timerNode = document.querySelector("#timer");
const scoreNode = document.querySelector("#score");

//Audios
const audioElement = new Audio("audio/roma-italian.mp3");

let chefNode = null;
let pizzaNode = null;


/**
 * * VARIABLES GLOBALES
*/
let audioOn = true;
let timerGame = null;
let pizza = null;
let currentIngredient = null;
let lifes = 3;


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

    //Iniciar audio
    audioElement.loop = true;
    audioElement.play();
    audioElement.volume = 0.05;
    
    //Entrada pala madera
    let palaNode = document.createElement("img");
    palaNode.src = "imgs/pala.png";
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
        pizza.placeSlotsCircle(5);
        pizza.startPizzaTime();
        addChef(); //🔵
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
    let maxSlotArea = 0;
    let slotOnCollision = null;

    let newSlots = pizza.slots.filter((slot)=>{
        if( slot.correctType(currentIngredient.type) &&
            collision(currentIngredient, slot) && 
            !slot.active
        ) return slot;
    })

    if(newSlots.length>0){
        //Ingrediente mas cercano
        maxSlotArea = collision(currentIngredient, newSlots[0]);
        slotOnCollision = newSlots[0];
        
        for (let i = 1; i < newSlots.length; i++) {
            let slotArea = collision(currentIngredient, newSlots[i]);
            if(slotArea > maxSlotArea) {
                maxSlotArea = slotArea;
                slotOnCollision = newSlots[i];
            }
        }
    }

    if(maxSlotArea) {
        pizza.totalIngPlaced++;
        slotOnCollision.setPlaced();
        currentIngredient.removeIngredient();
        currentIngredient = null;
    }
    else{
        updateLifes();
        currentIngredient.removeIngredient();
        currentIngredient = null;
    }

    pizza.setScore(maxSlotArea);
    createTextOnCollision(maxSlotArea);

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
        else if(area > 30) return 2;
        else return 1;
    }
    else return 0;
}

//Crear texto al colocar ingrediente
function createTextOnCollision(area){
    chefNode.style.animation = "chef 2s"; //🔵

    let h2Node = document.createElement("h2");
    document.querySelector("#slots-list").appendChild(h2Node);
    h2Node.style.position = "absolute";
    h2Node.style.width = "200px";
    h2Node.style.fontSize = "32px";
    h2Node.style.left = `${25}px`;
    h2Node.style.top = `${350}px`;   
    h2Node.style.textAlign = "center";
    h2Node.style.webkitTextStroke = "1px white";
    h2Node.style.zIndex = 4;

    // puede colisionar y ser diferente type 🟠
    switch(area){
        case 4:
            h2Node.innerText = "PERFECT";
            h2Node.style.color = "#28a745"; 
            break;
        case 3:
            h2Node.innerText = "GREAT";
            h2Node.style.color = "#00BCD4";
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
    h2Node.style.animation = "correct 1.5s";

    let timerAnimation = setTimeout(()=>{
        h2Node.remove();
        chefNode.style.animation = ""; //🔵
        clearTimeout(timerAnimation)
    }, 1200)
}

//Check if currentIngredient collision with Floor
function checkCollisionFloor(){
    if(currentIngredient.y + currentIngredient.h >= gameBoxNode.offsetHeight) {
        updateLifes();
        currentIngredient.removeIngredient();
        currentIngredient = null;
        checkPizzaCompleted();
    }
}

//Check if all ingredients has been placed
function checkPizzaCompleted() {
    if(pizza.ingredientsList.length > 0 && lifes > 0) {
        let timerDrop = setTimeout(()=> {
            currentIngredient = new Ingredient(600, 0, pizza.ingredientsList[0]);
            pizza.ingredientsList.shift() 
            clearTimeout(timerDrop);
        }, 1000);    
    }
    else { //When finish🟠
        let minimumScore = (100/pizza.slots.length/4) * 2 * pizza.slots.length;

        let h1CompleteNode = document.createElement("h1");
        if(pizza.scorePizza >= minimumScore) h1CompleteNode.innerText = "GOOD JOB";
        else {
            h1CompleteNode.innerText = "Do Better";
            h1CompleteNode.style.color = "darkred";
        }
        gameBoxNode.appendChild(h1CompleteNode);
        h1CompleteNode.style.zIndex = 3;
        h1CompleteNode.style.position = "absolute";
        h1CompleteNode.style.width = "200px";
        h1CompleteNode.style.left = "50%";
        h1CompleteNode.style.top = "250px";
        h1CompleteNode.style.fontSize ="80px";

        let timerGameOver = setTimeout(()=> {
            pizza.stopPizzaTime();
            gameOver();
            clearTimeout(timerGameOver);
        }, 2000);  
    }
}

//Update lifes when collison or bad pizza
function updateLifes(){
    lifes--;
    console.log(lifes)
    let heartsNodeList = document.querySelectorAll("#hearts img");
    if(lifes === 2) heartsNodeList[0].src = "imgs/heart_empty.png";
    else if (lifes === 1) heartsNodeList[1].src = "imgs/heart_empty.png";
    else heartsNodeList[2].src = "imgs/heart_empty.png";

}

function gameOver() { //🟠
    audioElement.muted = true;
    //DOM Game Over

    //Change scenes
    gameViewNode.style.display = "none";
    endViewNode.style.display = "flex"

    timerNode.style.color = "white";
    scoreNode.innerText = "Score: 0 %"
}

function resetGameState(){ //🟠
    //Remove all created nodes
    document.querySelectorAll("#game-box *:not(p)").forEach((node)=>{node.remove()});
    // timerNode.innerText = "";
    // timerNode.style.color = "white";
    // scoreNode.innerText = "Score: 0 %"
    //Reset all variables
    lifes = 3;
    let heartsNodeList = document.querySelectorAll("#hearts img");
    heartsNodeList.forEach((node)=>{node.src = "imgs/heart.png";})

    pizzaNode = null;
    pizza = null;
    currentIngredient = null;

    clearInterval(timerGame);
    timerGame = null;

    endViewNode.style.display = "none";
    startViewNode.style.display = "flex";
}

function addChef() {
    chefNode = document.createElement("img");
    chefNode.src = "imgs/pizzero1.png";
    gameBoxNode.append(chefNode);
    chefNode.style.position = "relative";
    chefNode.style.zIndex = 3;
    chefNode.style.top = "-150px";
    chefNode.style.left = "-190px";
}

function audioState(){
    if(audioOn) {
        audioBtnNode.style.backgroundImage = "url(imgs/audio_off.png)";
        audioElement.muted = true;

    }
    else {
        audioBtnNode.style.backgroundImage = "url(imgs/audio_on.png)";
        audioElement.muted = false;
    }
    audioOn = !audioOn;
}


/**
 * * EVENT LISTENERS
*/

startBtnNode.addEventListener("click", startGame);
resetBtnNode.addEventListener("click", resetGameState);
audioBtnNode.addEventListener("click", audioState);

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