class SlotIngredient {
    constructor(x, y, type){
        this.x = x;
        this.y = y;
        this.w = 64;
        this.h = 64;

        this.type = type;

        this.node = document.createElement("img");
        gameBoxNode.querySelector("ul").appendChild(this.node);
        this.setStyleNode();
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
    
}