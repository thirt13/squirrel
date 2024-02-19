class Squirrel {

    constructor(imageX, imageY) {
        this.x = imageX,
        this.y = imageY,
        this.width = imageY * 0.2,
        this.height = imageY * 0.2,
        this.speed = (imageX * 2 > 700) ? 14 : 9,
        this.speedY = 0,
        this.movingLeft = false
    }

    moveRight(actualAcorn) {
        this.x += this.speed
        if (actualAcorn != null) {
            actualAcorn.x = this.x + this.width * 0.67
            // actualAcorn.x = this.x + 80
        }
    }
    
    moveLeft(actualAcorn) {
        this.x -= this.speed
        if (actualAcorn != null) {
            actualAcorn.x = this.x - this.width * 0.3
        }  
    }

    moveUp(y, actualAcorn = null) {
        if (this.y == y) {
            this.speedY -= 25
            if (actualAcorn !== null) {
                actualAcorn.speedY -= 10
            }
        }  
    }
   
    crashWith(otherobj) {
        let myleft = this.x
        let myright = this.x + (this.width)
        let mytop = this.y
        let mybottom = this.y + (this.height)
        let otherleft = otherobj.x
        let otherright = otherobj.x + (otherobj.width)
        let othertop = otherobj.y
        let otherbottom = otherobj.y + (otherobj.height)
        let crash = true
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false
        }
        return crash
    }
}