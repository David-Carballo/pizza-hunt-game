class SlotIngredient {
    constructor(x, y, type){
        this.x = x;
        this.y = y;

        this.w = 64;
        this.h = 64;

        this.active = false;

        this.type = type;
        this.computeSize();

        this.node = document.createElement("img");
        gameBoxNode.querySelector("ul").appendChild(this.node);
        this.setStyleNode();
    }

    computeSize(){
        switch(this.type){
            case "bacon":
                this.w = 96;
                this.h = 32;
                break;
            case "olive":
            case "mushroom":
            case "pepper":
                this.w = 48;
                this.h = 48;
                break;
            case "tomato":
                this.w = 64;
                this.h = 32;
                break;
            default:
                this.w = 64;
                this.h = 64;
        }
    }

    setStyleNode(){
        this.node.style.left = `${this.x}px`;
        this.node.style.top = `${this.y}px`;
        this.node.style.width = `${this.w}px`;
        this.node.style.height = `${this.h}px`;
        this.node.style.zIndex = 1;

        this.node.src = `imgs/${this.type}.png`;
        this.node.style.filter = "brightness(30%)";
        this.node.style.position = "absolute";
    }

    //Change filter when ingredient is place
    correctType(type){
        if(type === this.type){
            return true;
        }
        return false;
    }

    setPlaced(){
        this.node.style.filter = "";
        this.active = true;
    }


    
}