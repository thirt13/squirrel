class Acorn {

    constructor(imageX, imageY, sizeX, sizeY, speed, typeAcorn) {
        this.x = imageX
        this.y = imageY
        this.width = sizeX
        this.height = sizeY
        this.speed = speed
        this.speedY = 0
        this.score = 10
        this.starterFrame = 0

        // for level 2
        this.f = 0
        this.finish = false

        this.typeAcorn = typeAcorn
        this.acornImage =  new Image()
        if (this.typeAcorn == 1){
            this.acornImage.src = './img/acorn.png'
            this.score = 10
        } else if (this.typeAcorn == 2){
            this.acornImage.src = './img/acornGold.png'
            this.score = 40
            this.width = this.width * 0.85
            this.height = this.height * 0.85
            this.speed = 3

        } else
        {
            this.acornImage.src = './img/acornBlack.png'
            this.score = -10
            
        }
       
    }

    moveDown() {
        this.y += this.speed
    }
    drawAcorn(ctx) {
        ctx.drawImage(this.acornImage, this.x, this.y, this.width, this.height)
     }

}