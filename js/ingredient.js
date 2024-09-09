class Ingredient {
    constructor(x, y, type){
        this.x = x;
        this.y = y;
        this.w = 64;
        this.h = 64;

        this.type = type;
        this.computeSize();

        //Velocidades
        this.gravityAcc = 0.2;
        this.speedX = 0;
        this.speedY = 0;
        this.maxSpeed = 5;
        this.negativeForce = 0.99;

        this.node = document.createElement("img");
        this.node.src = `../imgs/${type}.png`;
        gameBoxNode.appendChild(this.node);

        this.node.style.position = "absolute";
        this.node.style.width = `${this.w}px`;
        this.node.style.height = `${this.h}px`;
        this.node.style.zIndex = 2;
        this.updatePos();
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
        // if(keyLeft) {
        //     if(-this.maxSpeed < this.speedX) this.speedX-=1;
        // }
        // if(keyRight) {
        //     if(this.speedX < this.maxSpeed) this.speedX+=1;
        // }
        // if(keyDown) {
        //     if(this.speedY < this.maxSpeed) this.speedY+=0.2;
        // }

        // if(keyLeft) {
        //     this.speedX=-3;
        // }
        // if(keyRight) {
        //     this.speedX= 3;
        // }
        // if(keyDown) {
        //     this.speedY = 2;
        // }

        //Friction to reduce speed to 0 when dont pressed key
        // this.speedX *= this.negativeForce;
        // this.speedY *= this.negativeForce;

        if(keyDown && keyLeft || keyDown && keyRight) {
            this.x += this.speedX*Math.sin(45);
            this.y += this.speedY*Math.sin(45);
        }
        else {
            this.x += this.speedX;
            this.y += this.speedY;
        }

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