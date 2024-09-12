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
const nameNode = document.querySelector("#chef-name");
const rankingNode = document.querySelector("#ranking");
const canvasNode = document.querySelector("#canvas");
const context = canvasNode.getContext("2d");
context.canvas.width = 500;
context.canvas.height = 500;

//Audios
const globalAudio = new Audio("audio/roma-italian.mp3");
const placeAudio = new Audio("audio/place_ing.mp3");
const errorAudio = new Audio("audio/error.mp3");
const gameoverAudio = new Audio("audio/final_game.mp3");
const startAudio = new Audio("audio/start_button_door.mp3");
const palaAudio = new Audio("audio/take_pizza.mp3");
const newPizzaAudio = new Audio("audio/time_new_pizza.mp3");

let chefNode = null;
let ketchupNode = document.createElement("img");
let pizzaNode = null;


/**
 * * VARIABLES GLOBALES
*/
let audioOn = true;
let timerGame = null;

let pizza = null;
let currentIngredient = null;
let pizzaFinished = false;

let chefName = "";

let lifes = 3;
let totalScore = 0;

let gravity = 0.25;
let totalSlots = 6;

let drawing = false;

let keyDown = null;
let keyLeft = null;
let keyRight = null;

let initialX;
let initialY;

/**
 * * FUNCIONES
*/

function startGame(){
    startAudio.currentTime = 0;
    startAudio.volume = 0.2;
    startAudio.play();
    //Change scenes
    startViewNode.style.display = "none";
    gameViewNode.style.display = "flex";

    //Iniciar audio
    
    let audioTime = setTimeout(()=>{
        globalAudio.loop = true;
        globalAudio.currentTime = 0;
        globalAudio.muted = false;
        globalAudio.play();
        globalAudio.volume = 0.03;
        clearTimeout(audioTime);
    },1000);
    
    //Entrada pala madera
    let palaNode = document.createElement("img");
    palaNode.src = "imgs/pala.png";
    gameBoxNode.appendChild(palaNode);
    palaNode.style.animation = ("show-pala 3s");
    palaNode.style.zIndex = 0.5;
    palaNode.style.position ="absolute";
    palaNode.style.top ="100px";
    palaNode.style.left ="-891px";

    //Create first pizza
    pizza = new Pizza();


    //Create current ingredient
    let timeoutId = setTimeout(()=>{
        currentIngredient = new Ingredient(540, 0, pizza.ingredientsList[0]);
        pizza.ingredientsList.shift() 
        palaNode.remove();
        clearTimeout(timeoutId)}
    ,3000);

    // Place Slots in Pizza
    timeoutId = setTimeout(()=>{
        pizza.placeSlotsCircle(totalSlots);
        pizza.startPizzaTime();
        pizza.node.style.animation = "";
        addChef();
        addKetchup();
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
    chefNode.style.animation = "chef 2s";

    let h2Node = document.createElement("h2");
    document.querySelector("#slots-list").appendChild(h2Node);
    h2Node.style.position = "absolute";
    h2Node.style.width = "200px";
    h2Node.style.fontSize = "32px";
    h2Node.style.left = "25px";
    h2Node.style.left = "25px";
    h2Node.style.top = "300px";   
    if(area===10) {
        h2Node.width = "400px"
        h2Node.style.left = "400px";
        h2Node.style.top = "200px";   
    }
    h2Node.style.textAlign = "center";
    h2Node.style.webkitTextStroke = "1px white";
    h2Node.style.zIndex = 4;

    // puede colisionar y ser diferente type
    switch(area){
        case 10:
            h2Node.innerText = "Sign your PIZZA";
            h2Node.style.color = "darkred";
            break;
        case 4:
            h2Node.innerText = "PERFECT";
            h2Node.style.color = "#28a745";
            chefNode.style.filter = "brightness(1.15)"
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
            chefNode.style.filter = "saturate(0%)";
            break;
    
    }
    h2Node.style.animation = "correct 1.5s";

    let timerAnimation = setTimeout(()=>{
        h2Node.remove();
        chefNode.style.animation = "";
        chefNode.style.filter = "";
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
            currentIngredient = new Ingredient(540, 0, pizza.ingredientsList[0]);
            pizza.ingredientsList.shift() 
            clearTimeout(timerDrop);
        }, 1000);    
    }
    else{
        totalScore += pizza.timePizza; 
        scoreNode.innerText = "Score:" + totalScore;
        let minimumScore = (100/pizza.slots.length/4) * 2 * pizza.slots.length;
        if(pizza.scorePizza < minimumScore && lifes > 0) {
            updateLifes();//Pizza mal completada
        }

        if(lifes === 0){
            gameBoxNode.style.filter = "saturate(0%)"
            gameoverAudio.volume = 0.3;
            gameoverAudio.currentTime = 0;
            gameoverAudio.play();
            let timerGameOver = setTimeout(()=> {
                pizza.stopPizzaTime();
                gameOver();
                clearTimeout(timerGameOver);
            }, 2000);  
        }
        else {
            startDraw();
            createTextOnCollision(10)
            let signNode = document.createElement("h1");
            let timeoutId = setTimeout (()=>{
                takeCompletedPizza();
                clearTimeout(timeoutId);
            }, 3000);
        }
    }
}

//Take completed pizza and drop new one
function takeCompletedPizza(){
    let palaNode = document.createElement("img");
    palaNode.src = "imgs/pala.png";
    gameBoxNode.appendChild(palaNode);
    palaNode.style.animation = ("show-pala 3s");
    palaNode.style.zIndex = 0;
    palaNode.style.position ="absolute";
    palaNode.style.top ="100px";
    palaNode.style.left ="-891px";

    palaAudio.volume = 0.2;
    palaAudio.currentTime = 0;
    palaAudio.play();
    pizzaNode.style.animation = ("show-pizza 0.6s ease-in 2s reverse");
    pizza.slots.forEach((slot)=>{
        slot.node.style.left = "-200px";
        slot.node.style.transition = ("left 0.6s 2s");
    })
    pizza.stopPizzaTime();
    canvasNode.style.left = "-500px";
    canvasNode.style.transition = ("left 0.6s 2s");
    ketchupNode.style.filter = "";
    ketchupNode.style.top = "600px";
    
    drawing = false;
    //Timeout
    let timerOut = setTimeout(()=>{
        pizzaNode.style.left = "-500px";
        pizza.removePizza();
        palaNode.remove();
        gameBoxNode.querySelector("ul").remove();
        pizza = null;
        pizzaNode = null;
        let timerDrop = setTimeout(()=>{
            dropNewPizza();
            palaAudio.volume = 0.2;
            palaAudio.currentTime = 0;
            palaAudio.play();
            clearTimeout(timerDrop);
        } ,800);
        clearTimeout(timerOut);
    } ,2590);

}

//Drop new pizza
function dropNewPizza(){
       //Entrada pala madera
       let palaNode = document.createElement("img");
       palaNode.src = "imgs/pala.png";
       gameBoxNode.appendChild(palaNode);
       palaNode.style.animation = ("show-pala 3s");
       palaNode.style.zIndex = 0.5;
       palaNode.style.position ="absolute";
       palaNode.style.top ="100px";
       palaNode.style.left ="-891px";

       //Difficulty
        if(gravity <= 0.5) gravity *= 1.1;
        if(totalSlots < 15); totalSlots++;
   
       //Create first pizza
       pizza = new Pizza();
       newPizzaAudio.volume = 0.4;
       newPizzaAudio.currentTime = 0;
       newPizzaAudio.play();
       //Reset canvas
       context.reset();
       canvasNode.style.left = "300px";
       //Create current ingredient
       let timeoutId = setTimeout(()=>{
           currentIngredient = new Ingredient(600, 0, pizza.ingredientsList[0]);
           pizza.ingredientsList.shift() 
           palaNode.remove();
           clearTimeout(timeoutId)}
       ,3000);
   
       // Place Slots in Pizza
       timeoutId = setTimeout(()=>{
           pizza.placeSlotsCircle(totalSlots);
           pizza.startPizzaTime();
           pizza.node.style.animation = "";
           addChef();
           addKetchup();
           clearTimeout(timeoutId)}
       ,2000);
   
}

//Update lifes when collison or bad pizza
function updateLifes(){
    lifes--;
    errorAudio.volume = 0.3;
    errorAudio.currentTime = 0;
    errorAudio.play();
    let heartsNodeList = document.querySelectorAll("#hearts img");
    if(lifes === 2) heartsNodeList[0].src = "imgs/heart_empty.png";
    else if (lifes === 1) heartsNodeList[1].src = "imgs/heart_empty.png";
    else heartsNodeList[2].src = "imgs/heart_empty.png";

}

function gameOver() { 
    globalAudio.muted = true;
    //DOM Game Over
    let scoreEndNode = document.querySelector("#end-score");
    scoreEndNode.innerText = `Total Score : ${totalScore}`;
    //Change scenes
    gameViewNode.style.display = "none";
    gameBoxNode.style.filter = "";
    endViewNode.style.display = "flex"

    timerNode.innerText = "";
    timerNode.style.color = "black";
    scoreNode.innerText = "Score: 0"

    setRanking();
}

function setRanking(){
    //Set ranking item
    let name = nameNode.value;
    if(name === "") name = "Unknown";
    localStorage.setItem(name, `${totalScore}`);

    let rankingArr = [];
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        rankingArr.push([key, localStorage[key]])
    }

    rankingArr.sort((a, b)=>{
        if(parseInt(a[1]) > parseInt(b[1])) return -1;
        else return 1;
    });

    for (let i = 0; i < rankingArr.length && i < 5; i++) {
        let rowNode = document.createElement("li");
        rowNode.innerHTML = `<p> ${rankingArr[i][0]}</p> <p>${rankingArr[i][1]}</p>`;
        rowNode.style.display = "flex";
        rowNode.style.justifyContent = "space-between";
        rowNode.style.padding = "0px 30px";
        rankingNode.append(rowNode);
    }
}

function resetGameState(){
    //Remove all created nodes
    document.querySelectorAll("#game-box *:not(p)").forEach((node)=>{node.remove()});
    // scoreNode.innerText = "Score: 0 %"
    //Reset all variables
    lifes = 3;
    let heartsNodeList = document.querySelectorAll("#hearts img");
    heartsNodeList.forEach((node)=>{node.src = "imgs/heart.png";})

    pizzaNode = null;
    pizza = null;
    currentIngredient = null;

    audioBtnNode.style.backgroundImage = "url(imgs/audio_on.png)";
    audioOn = true;

    clearInterval(timerGame);
    timerGame = null;

    endViewNode.style.display = "none";
    startViewNode.style.display = "flex";
}

function addChef() {
    chefNode = document.createElement("img");
    chefNode.src = "imgs/pizzero1.png";
    gameBoxNode.append(chefNode);
    chefNode.style.position = "absolute";
    chefNode.style.zIndex = 3;
    chefNode.style.top = "425px";
    chefNode.style.left = "-120px";
    chefNode.style.width = "400px";
}

function addKetchup(){
    ketchupNode.id = "ketchup"
    ketchupNode.src = "imgs/ketchup.png";
    ketchupNode.style.position = "absolute";
    gameBoxNode.append(ketchupNode);
    ketchupNode.style.zIndex = 3;
    ketchupNode.style.top = "600px";
    ketchupNode.style.left = "250px";
    ketchupNode.style.width = "70px";
}

function startDraw(){
    // Pintar ketchup;
    drawing = true;
    ketchupNode.style.filter = "brightness(1.6) saturate(3)";
    ketchupNode.style.top = "575px";
    // ketchupNode.style.width = "90px";
    // ketchupNode.style.filter = "saturate(3)";
}

function draw(cursorX, cursorY) {
    //begin draw
    context.beginPath();
    context.moveTo(initialX,initialY);
    //Add pencil styles
    context.lineWidth = 10;
    context.strokeStyle = "darkred";
    context.lineCap = "round";
    context.lineJoin = "round";

    context.lineTo(cursorX, cursorY);
    context.stroke();
    // context.closePath();
    // context.fill();

    //update coordenadas del cursor
    initialX = cursorX;
    initialY = cursorY;
}

function audioState(){
    if(audioOn) {
        audioBtnNode.style.backgroundImage = "url(imgs/audio_off.png)";
        globalAudio.muted = true;

    }
    else {
        audioBtnNode.style.backgroundImage = "url(imgs/audio_on.png)";
        globalAudio.muted = false;
    }
    audioOn = !audioOn;
}

function isDrawing(event) {
    draw(event.offsetX, event.offsetY);
}

/**
 * * EVENT LISTENERS
*/

startBtnNode.addEventListener("click", startGame);
resetBtnNode.addEventListener("click", resetGameState);
audioBtnNode.addEventListener("click", audioState);

//Draw listeners
ketchupNode.addEventListener("click", startDraw);
canvasNode.addEventListener("mousedown", (event)=>{
    if(drawing) {
        //coordenadas relativas a la posicion del nodo
        initialX = event.offsetX; 
        initialY = event.offsetY;
        draw(initialX,initialY);
    
        //Add event listener para llamar draw while mouse is moving
        canvasNode.addEventListener("mousemove", isDrawing);
    }
});
canvasNode.addEventListener("mouseup", (event)=>{
    canvasNode.removeEventListener("mousemove", isDrawing)
});

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
        placeAudio.volume = 0.1;
        placeAudio.currentTime = 0;
        placeAudio.play();
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