class Wolf {

    constructor(imageX, imageY) {
        this.x = imageX,
        this.y = imageY,
        this.width = imageY * 0.18,
        this.height = imageY * 0.18,
        this.speedX = 0,
        this.speedY = 4,
        this.moving = false,
        this.starterFrame = 0,
        this.wolfImage = new Image(),
        this.wolfImage.src = './img/wolf.png'
    }
    move() {
        this.x += this.speedX
    }
}