class Ingredient {
    constructor(){
        this.x = 100;
        this.y = 100;
        this.w = 32;
        this.h = 32;
        this.gravityAcc = 0.2;
        this.speedX = 3;
        this.speedY = 2;

        this.node = document.createElement("img");
        this.node.src = "../imgs/pepperoni.png";

        gameBoxNode.appendChild(this.node);

        this.node.style.position = "absolute";
        this.node.style.width = `${this.w}px`;
        this.node.style.height = `${this.h}px`;
        this.node.style.top = `${this.y}px`;
        this.node.style.left = `${this.x}px`;

    }

    gravity() {
        let timerGravity = setInterval(()=>{
            this.y += this.gravityAcc;
            this.node.style.top = `${this.y}px`
        }, 16);
        
        setTimeout(()=>{clearInterval(timerGravity)},200);
    }

    moveLeft(){
        this.x -= this.speedX;
        this.node.style.left = `${this.x}px`
    }

    moveRight(){
        this.x += this.speedX;
        this.node.style.left = `${this.x}px`
    }

    moveDown(){
        this.y += this.speedY;
        this.node.style.top = `${this.y}px`
    }

    movement() {
        console.log(keyDown,keyLeft,keyRight)
        if(keyLeft) this.moveLeft();
        if(keyRight) this.moveRight();
        if(keyDown) this.moveDown();
    }

    remove(){
        this.node.remove();
    }
}