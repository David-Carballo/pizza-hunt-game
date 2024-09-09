class Pizza {
    constructor(){
        this.x = 300;
        this.y = 120;
        this.w = 500;
        this.h = 500;

        this.slots = [];


        this.node = document.createElement("img");
        gameBoxNode.appendChild(this.node);
        pizzaNode = this.node;

        //Place slots
        let ulNode = document.createElement("ul");
        ulNode.id = "places-list";
        gameBoxNode.append(ulNode);

        this.slots.push("mushroom");
        this.slots.push("pepperoni");
        this.slots.push("onion");
        this.slots.push("pepper");      
        this.slots.push("mushroom");
        this.slots.push("pepperoni");
        this.slots.push("onion");
        this.slots.push("pepper");   

        this.setStylePizza();
        

        this.ingrediente = null;
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
    placeIngredients(total){
        for (let i = 0; i < total; i++) {
            console.log(this.node.getBoundingClientRect())
            let randomX = Math.floor(Math.random() * (400 - 64)) + this.x+50;
            let randomY = Math.floor(Math.random() * (400 - 64)) + this.y+50;
            this.ingrediente = new SlotIngredient(randomX, randomY, this.slots[i]);
            console.log(this.slots[i], randomX, randomY);
        }
    }

    //Call when ingredient placed and needs drop new ingredient
    dropNewIngredient(){

    }

    
}