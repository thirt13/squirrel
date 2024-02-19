class myGame {

    constructor() {
        this.canvas = document.querySelector('#gameCanvas')
        this.ctx = this.canvas.getContext('2d')
        this.livescore = document.querySelector('#livescore')
      
    }
    initial(actualLevel) {
        this.canvas.width = window.innerWidth * 0.9
        this.canvas.height = window.innerHeight * 0.9
        this.score = 0
        this.nextLevelScore = 900
        this.gameOver = false
        this.level = actualLevel
        this.lastTouchX
        this.actualAcorn = null
        this.wolf = null
        this.bullet = null
        this.showW = false
        this.frameNo = 0
        this.acorns = []
        this.acornsBlack = []
        this.imageX = this.canvas.width / 2
        this.imageY = this.canvas.height - this.canvas.height * 0.19 // height of squirrel
        this.squirrelImage = new Image()
        this.squirrelImage.src = './img/squirrel.png'
        this.smallSquirrelImage = new Image()
        this.smallSquirrelImage.src = './img//small_squirell.png'

        this.squirrel = new Squirrel(this.imageX, this.imageY)
        this.intervalID = setTimeout(() => this.intervalWolf(), 10000)
        if (this.level == 2) {
            this.#generateHeap(20)
            this.smallSquirrel = new Squirrel(10, this.imageY)
        }

    }

    intervalWolf(){
        this.showW = true
    }

    // for level 1
    update(callback) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height) // clear canvas
        // jump squirrel
        this.squirrel.y += this.squirrel.speedY
        if (this.squirrel.y < this.imageY) {
            this.squirrel.speedY += 1.5
        } else {
            this.squirrel.y = this.imageY
            this.squirrel.speedY = 0
        }

        this.drawSquirrel()
        this.frameNo += 1
        // generate acorns - normal, black, gold
        this.#generateAcorns()
       
        // wolf
        if (this.showW) {
            this.showWolf()
        }
        if ((this.bullet !== null) && (this.bullet.bang)) {
            this.#bangBang()
             //crashTest bullet
            if (this.squirrel.crashWith(this.bullet)) {
                this.score += this.bullet.score
                this.bullet.bang = false
            }
        }

        this.#crashTest()

        this.livescore.innerHTML = this.score
        
        // acorn out of canvas - game over // lose life 
        for (let i = 0; i < this.acorns.length; i++) {
            if (this.#outOfArea(this.acorns[i])) {
                console.log('game over')
                this.gameOver = true
            } 
        }    

        for (let i = 0; i < this.acorns.length; i++) {
            this.acorns[i].y += this.acorns[i].speed
            this.acorns[i].drawAcorn(this.ctx)
        }

        if (this.score < 0) this.gameOver = true
        if (this.score >= this.nextLevelScore) this.level = 2
        if (this.gameOver == false) {
            if (this.level == 2) {
                clearInterval(this.intervalID)
                callback() 
            } else {
                requestAnimationFrame(() => this.update(callback))
            }
        } else {
            clearInterval(this.intervalID)
            callback()  
        } 
    }

    // for level 2
    update2(callback) {
        // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height) // clear canvas
        this.squirrel.y += this.squirrel.speedY
        if (this.actualAcorn !== null) {
            this.actualAcorn.y += this.actualAcorn.speedY
        }
        if (this.squirrel.y < this.imageY) {
            this.squirrel.speedY += 2
            if (this.actualAcorn !== null) {
                if (this.actualAcorn.x > (this.canvas.width * 0.25)){
                    this.actualAcorn.speedY += 2
                } else {
                  
                    this.actualAcorn.y = this.imageY - 40
                    this.actualAcorn.speedY = 0
                    this.actualAcorn.finish =  true
                    //moving of smallSquirrel end eating
                    this.#moveToEat()

                    if (this.actualAcorn.starterFrame == 0){
                        this.actualAcorn.starterFrame = this.frameNo
                    }
                }
                
            } 

        } else {
            this.squirrel.y = this.imageY
            this.squirrel.speedY = 0
            if ((this.actualAcorn !== null) && (this.actualAcorn.finish === false)) {
                this.actualAcorn.y = this.imageY
                this.actualAcorn.speedY = 0
            }
        }

        this.drawSquirrel()
        this.frameNo += 1

        // add other game functions ************
        if (this.#nextGenerationBlack(300)) this.#generateRandomAcorn(3, 1)
       
        for (let i = 0; i < this.acornsBlack.length; i++) {
            this.acornsBlack[i].y += this.acornsBlack[i].speed
            this.acornsBlack[i].drawAcorn(this.ctx)
        }
        this.#crashTestBlack()

        // *************************************
        
        
        // if exist acorn in acorns
        if (this.acorns.length > 0) {   
            if (this.actualAcorn === null) {
                if (this.acorns[0].y != this.canvas.height - 60) {
                    this.acorns.unshift(this.acorns.pop())
                    this.acorns[0].y = this.canvas.height - 60
                }
            } 
            // drawing Acorns
            this.acorns.forEach((acron) => {
                acron.drawAcorn(this.ctx)
            })
            //squirrel takes the acorn
            if ((this.actualAcorn === null) && (this.squirrel.crashWith(this.acorns[0]))) {
                this.actualAcorn = this.acorns.shift()
                // position
                this.actualAcorn.x = this.squirrel.x + 80
                this.actualAcorn.y = this.squirrel.y + 20
            }
        } else if (this.actualAcorn.finish) {
            this.score += 10
            this.level = 3
        }


        // if not eat finish
        if (this.actualAcorn !== null) {
            //console.log(this.actualAcorn.y)
            this.actualAcorn.drawAcorn(this.ctx)
            if ((this.actualAcorn.finish) && (this.frameNo - this.actualAcorn.starterFrame > 400)) {
                this.actualAcorn = null
                this.score += 10      
            }
        } else {
            this.#moveToStart()     
        }

        this.drawSmallSquirrel()
        this.livescore.innerHTML =  this.score
        if (this.score < 0) this.gameOver = true
        if (this.gameOver === false)  {
            if (this.level == 3) {
                clearInterval(this.intervalID)
                callback() 
            } else {
                requestAnimationFrame(() => this.update2(callback))
            }

        } else  {
            callback()  
        } 
    }
    
    #crashTestBlack() {
        for (let i = 0; i < this.acornsBlack.length; i += 1) {
            if (this.squirrel.crashWith(this.acornsBlack[i])) {
                this.score += this.acornsBlack[i].score
                this.acornsBlack.splice(i,1)
            }            
        }
    }
    
    #crashTest() {
        for (let i = 0; i < this.acorns.length; i += 1) {
            if (this.squirrel.crashWith(this.acorns[i])) {
                this.score += this.acorns[i].score
                this.acorns.splice(i,1)
            } 
        }
    }


    drawWolf() {
        this.ctx.drawImage(this.wolf.wolfImage, this.wolf.x, this.wolf.y, this.canvas.height * 0.2, this.canvas.height * 0.2)
    }
    
    showWolf() {   
        if (this.wolf === null) {
            let randY
            if (this.score < 400) {
                randY = Math.random() * (((this.canvas.height / 1.6) - (this.canvas.height* 0.2)) - this.canvas.height*0.1) + 1
            } else {
                randY = Math.random() * ((this.canvas.height - (this.canvas.height* 0.2)) - this.canvas.height*0.1) + 1
            }

            let sizeBullet = 30
            if (this.canvas.height < 600) sizeBullet = 12


            this.wolf = new Wolf(-50, randY)
            this.wolf.moving = true
            this.wolf.starterFrame = this.frameNo

            this.bullet = new Bullet(20, randY, this.squirrel.x + this.canvas.height * 0.2, this.canvas.height + 50, sizeBullet)
        } 
           
        if ((this.wolf.x < 10) && (this.wolf.moving)) {
            this.wolf.speedX = 6
            this.wolf.move()
        }

        if ((this.wolf.x >= 10) && (this.wolf.moving)) {
            //bang bang
            this.bullet.bang =  true                
            this.wolf.moving = false
            this.wolf.x = 10
        }

        if ((!this.wolf.moving) && (this.frameNo - this.wolf.starterFrame > 180)) {
            this.wolf.speedX = -2
            if (this.wolf.x > -130) {
                this.wolf.move()
            } 
        }
        
        this.drawWolf()
        if (this.wolf.x <= -130) {
             this.wolf = null
             this.showW = false
             clearTimeout(this.intervalID)
             let randomInterval = Math.random() * (20000 - 10000) + 1 // random time
             this.intervalID = setTimeout(() => this.intervalWolf(), randomInterval)
        }
    }

    #bangBang() {
        const timeElapsed = this.bullet.startTime + this.bullet.speedX
         // actual position
        this.bullet.x = this.bullet.x + (this.bullet.endX - this.bullet.x) * 0.02 
        this.bullet.y = this.bullet.y + (this.bullet.endY - this.bullet.y) * 0.02 

        if (timeElapsed < this.bullet.duration) {
            this.drawBullet()
            if (this.bullet.y > this.canvas.height) {
                this.bullet.bang =  false
            }
        }
    }
    
    drawBullet(){
        this.ctx.drawImage(this.bullet.bulletImage, this.bullet.x, this.bullet.y, this.bullet.width, this.bullet.height)
    }

    drawSquirrel() {
       this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height) // clear canvas
       this.ctx.save();
       if (this.squirrel.movingLeft) {
            this.ctx.scale(-1, 1); // rotate image
            this.ctx.drawImage(this.squirrelImage, -this.squirrel.x - this.canvas.height * 0.18, this.squirrel.y, this.squirrel.width, this.squirrel.height);
        } else {
            this.ctx.drawImage(this.squirrelImage, this.squirrel.x, this.squirrel.y, this.squirrel.width, this.squirrel.height)
        }
        this.ctx.restore()

    }
    drawSmallSquirrel() {
        this.ctx.drawImage(this.smallSquirrelImage, this.smallSquirrel.x, this.smallSquirrel.y, this.smallSquirrel.width * 0.75, this.smallSquirrel.height * 0.75)
    }

    #moveToEat() {
        this.smallSquirrel.x = this.smallSquirrel.x + (this.actualAcorn.x - this.smallSquirrel.x - 30) * 0.1 
        this.smallSquirrel.y = this.smallSquirrel.y + (this.actualAcorn.y - this.smallSquirrel.y) * 0.1
    }

    #moveToStart() {
        if (this.smallSquirrel.x >= 10) {
            this.smallSquirrel.x = this.smallSquirrel.x + (10 - this.smallSquirrel.x) * 0.1 
        }
        if (this.smallSquirrel.y <= this.canvas.height ) {
            this.smallSquirrel.y = this.smallSquirrel.y + (this.canvas.height - this.smallSquirrel.height - this.smallSquirrel.y) * 0.1
        }
    }

    #nextGeneration(n) {
        if (((this.frameNo / n) % 1 == 0) || (this.acorns.length <= 2)) {
            return true
        }
        return false
    }
    #nextGenerationBlack(n) {
        if (((this.frameNo / n) % 1 == 0) || (this.acornsBlack.length <= 2)) {
            return true
        }
        return false
    }

    #generateHeap(n) {
        let x = 0
        this.acorns.push(new Acorn(this.canvas.width -100, this.canvas.height -60, 50,50, 0, 1))
        this.acorns[0].f = 0
        for (let i = 0; i < n; i++) {
            x += 25
            this.acorns.push(new Acorn(this.canvas.width -100, this.canvas.height -150-x, 50,50, 0, 1))
            this.acorns[i+1].f = i+1
        }  
    }
    #generateAcorns() {
        if (this.#nextGeneration(300)) {
            this.#generateRandomAcorn(1)
        }
        if (this.#nextGeneration(850)) {
            this.#generateRandomAcorn(3)
        }
        if (this.#nextGeneration(1350)) {
            this.#generateRandomAcorn(1)
        }
        if (this.#nextGeneration(1200)) {
            this.#generateRandomAcorn(2)
        }
        if (this.score > 500) {
            if (this.#nextGeneration(300)) {
                this.#generateRandomAcorn(1)
            }
            if (this.#nextGeneration(480)) {
                this.#generateRandomAcorn(1)
            }
        }
    }

    #generateRandomAcorn(typeAcorn, black = 0) {
            let border = this.canvas.width * 0.1
            let randomX = Math.random() * ((this.canvas.width - border) - border) + border * 0.5 // random x position
            let randomSpeed = 1
            if (this.score > 220) {
                randomSpeed = Math.random() * (2 - 1) + 1
            } else if (this.score > 500) {
                randomSpeed = Math.random() * (3 - 1) + 1
            }

            if (black == 1) {
                this.acornsBlack.push(new Acorn(randomX, 0, this.canvas.height * 0.085, this.canvas.height * 0.085, randomSpeed, typeAcorn))    
            } else {
                this.acorns.push(new Acorn(randomX, 0, this.canvas.height * 0.085, this.canvas.height * 0.085, randomSpeed, typeAcorn))    
            }
    }

    #outOfArea(objectOut) {
        if ((this.canvas.height <= objectOut.y + 10) && (objectOut.typeAcorn == 1)) {
            return true
        }
        return false
    }

} 