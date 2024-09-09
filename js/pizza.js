class Pizza {
    constructor(){
        this.x = 300;
        this.y = 120;
        this.w = 500;
        this.h = 500;

        this.ingredientsTypes = ["mushroom", "pepperoni", "onion", "pepper", "bacon", "tomato"];
        this.slots = [];

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
    placeIngredients(total){
        //Seleccionamos un ingrediente aleatorio
        let randomIng = Math.floor(Math.random() * this.ingredientsTypes.length);
        let ing = this.ingredientsTypes[randomIng];

        for (let i = 0; i < total; i++) {
            // console.log(this.node.getBoundingClientRect())
            // Posicion random del slot
            let randomX = Math.floor(Math.random() * (400 - 64)) + this.x+50;
            let randomY = Math.floor(Math.random() * (400 - 64)) + this.y+50;
            this.slots.push(new SlotIngredient(randomX, randomY, ing));
            // console.log(ing, randomX, randomY);
            randomIng = Math.floor(Math.random() * this.ingredientsTypes.length);
            ing = this.ingredientsTypes[randomIng];
        }
    }

    //Call when ingredient placed and needs drop new ingredient
    dropNewIngredient(){

    }

    
}