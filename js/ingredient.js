class Ingredient {
    constructor(){
        this.x = 100;
        this.y = 100;
        this.w = 128/1.5;
        this.h = 32/1.5;
        this.gravityAcc = 0.15;
        this.speedX = 0;
        this.speedY = 0;
        this.maxSpeed = 2;
        this.negativeForce = 0.98;

        this.node = document.createElement("img");
        this.node.src = "../imgs/bacon.png";

        gameBoxNode.appendChild(this.node);

        this.node.style.position = "absolute";
        this.node.style.width = `${this.w}px`;
        this.node.style.height = `${this.h}px`;
        this.updatePos();
    }

    // Make ingredient down fall
    gravity() {
        let timerGravity = setInterval(()=>{
            this.y += this.gravityAcc;
            this.node.style.top = `${this.y}px`
        }, 16);
        
        setTimeout(()=>{clearInterval(timerGravity)},200);
    }

    movement(){
        //Accelerate to MAX Speed (normalize diagonal❓❓)
        if(keyLeft) {
            if(this.speedX > -this.maxSpeed) this.speedX--;
        }
        if(keyRight) {
            if(this.speedX < this.maxSpeed) this.speedX++;
        }
        if(keyDown) {
            if(this.speedY < this.maxSpeed) this.speedY+=0.2;
        }

        //Friction to reduce speed to 0 when dont pressed key
        this.speedX *= this.negativeForce;
        this.speedY *= this.negativeForce;
        this.x += this.speedX;
        this.y += this.speedY;
        // console.log(this.speedX,this.speedY);
        this.updatePos();
    }

    // Update ingredient position
    updatePos(){
        this.node.style.left = `${this.x}px`;
        this.node.style.top = `${this.y}px`;
    }

    removeIngredient(){
        this.node.remove();
    }
}