class Bullet {

    constructor(imageX, imageY, endX, endY, size) {
        this.x = imageX,
        this.y = imageY,
        this.width = size,
        this.height = size,
        this.endX = endX,
        this.endY = endY,
        this.speedX = 40,
        this.speedY = 40,
        this.bang = false,
        this.score = -50,
        this.duration = 5000,
        this.startTime = 0,
        this.bulletImage = new Image(),
        this.bulletImage.src = './img/bullet.png'
    }
    
}