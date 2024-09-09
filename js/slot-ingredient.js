class SlotIngredient {
    constructor(x, y, type){
        this.x = x;
        this.y = y;

        this.w = 64;
        this.h = 64;

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

        this.node.src = `../imgs/${this.type}.png`;
        this.node.style.filter = "brightness(50%)";
        this.node.style.position = "absolute";
    }

    //Change filter when ingredient is place
    correctPlacement(type){
        if(type === this.type){
            this.node.style.filter = "";
            return true;
        }
        else return false;
    }
    
    
}