class Pizza {
    constructor(){
        this.x = 300;
        this.y = 120;
        this.w = 500;
        this.h = 500;

        this.ingredientsTypes = ["mushroom", "pepperoni", "onion", "pepper", "bacon", "tomato"];
        this.slots = [];
        this.ingredientsList = [];

        this.totalIngPlaced = 0;

        this.timePizza = 0;
        this.scorePizza = 0;
        scoreNode.innerText = "Score:" + this.scorePizza + " %";
        //Create node
        this.node = document.createElement("img");
        gameBoxNode.appendChild(this.node);
        pizzaNode = this.node;

        //Place slots
        let ulNode = document.createElement("ul");
        ulNode.id = "slots-list";
        gameBoxNode.append(ulNode);

        //Add styles to pizza
        this.setStylePizza();
        
        console.log("Pizza creada");
    }

    setStylePizza() {
        this.node.src ="../imgs/pizza.png";
        this.node.style.position = "relative";
        this.node.style.width = `${this.w}px`;
        this.node.style.height = `${this.h}px`;
        this.node.style.top = `${this.y}px`;
        this.node.style.borderRadius = "500px";
        this.node.style.animation = ("show 2s");
        this.node.style.left = `${this.x}px`;
    };

    //Place randomly each slot
    placeSlots(total){
        this.timePizza = total * 5; //tarda 5s en caer cada ingredient
        //Seleccionamos un ingrediente aleatorio
        let randomIng = Math.floor(Math.random() * this.ingredientsTypes.length);
        let ing = this.ingredientsTypes[randomIng];
        for (let i = 0; i < total; i++) {
            this.ingredientsList.push(ing);
            // console.log(this.node.getBoundingClientRect())
            // Posicion random del slot
            let randomX = Math.floor(Math.random() * (400 - 64)) + this.x+50;
            let randomY = Math.floor(Math.random() * (400 - 64)) + this.y+50;
            this.slots.push(new SlotIngredient(randomX, randomY, ing));

            randomIng = Math.floor(Math.random() * this.ingredientsTypes.length);
            ing = this.ingredientsTypes[randomIng];
        }
    }

    placeSlotsCircle(total){
        this.timePizza = total * 5; //tarda 5s en caer cada ingredient

        //Seleccionamos un ingrediente aleatorio
        let randomIng = Math.floor(Math.random() * this.ingredientsTypes.length);
        let ing = this.ingredientsTypes[randomIng];
        let x = this.x + this.w/2;
        let y = this.y + this.h/2;
        for (let i = 0; i < total-1; i++) {
            this.ingredientsList.push(ing);

            //360/length
            let degree = 360/(total-1) * i;
            let rad = degree * Math.PI/180;
            
            //(x,y) => (cos a, sin a) -> antihorario -> a en radians
            let posX = x + Math.cos(rad)*150;
            let posY = y + Math.sin(rad)*150;

            let randVariationX = Math.floor(Math.random() * 10);
            let randVariationY = Math.floor(Math.random() * 10);

            this.slots.push(new SlotIngredient(posX-32+randVariationX, posY-32+randVariationY, ing));

            randomIng = Math.floor(Math.random() * this.ingredientsTypes.length);
            ing = this.ingredientsTypes[randomIng];
        }

        this.ingredientsList.push(ing);
        this.slots.push(new SlotIngredient(x-32, y-32, ing));

    }

    startPizzatime(){
        let seconds = this.timePizza;
        
        let count = 0;
        let interval = setInterval(()=>{
            timerNode.innerText = "00:" + seconds;
            if(seconds<=10) timerNode.style.color = "#dc3545"
            else if(seconds<=20) timerNode.style.color = "#ffeb3b"
            seconds--;

            if(this.ingredientsList.length === 0) {
                if(count === 5) {
                    timerNode.innerText = "";
                    clearInterval(interval);
                }
                count++;
            }
        },1000);
    }

    
    setScore(areaCollison){ //Mejorar puntuaciones🟠
        let score = 100/this.slots.length/4;
        
        this.scorePizza = Math.floor(this.scorePizza + score*areaCollison);
        scoreNode.innerText = "Score:" + this.scorePizza + " %";
    }
    
    removePizza(){
        // ulNode.remove();
        this.node.remove();
    }

    
}