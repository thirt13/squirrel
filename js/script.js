window.onload = function() {

    const game = new myGame()
    const start = document.querySelector('#start')
    const game2 = new myGame()
    const nextLevel = document.querySelector('#nextLevel')

    start.addEventListener('click', () => {
        document.querySelector('#myModalLight').style.display = 'none'
        document.querySelector('#gratulation').style.display = 'none'

        //change css style for canvas - level 1
        document.querySelector('#gameCanvas').classList.add('gameCanvas')
        document.querySelector('#gameCanvas').classList.remove('gameCanvas2')

        game.initial(1)
        game.update(() => {
            const gameOver = document.querySelector('#myModalLight')
            const show1 = document.querySelector('#show1')
            const show2 = document.querySelector('#show2')

            if (game.gameOver === true) {
                const scoreFinal = document.querySelector('#score')
                show1.style.display = 'block'
                scoreFinal.innerHTML = game.score
                gameOver.style.display = 'block'
            } else {
                if (game.level == 2) {
                    show1.style.display = 'none'
                    show2.style.display = 'block'
                    const scoreFinal = document.querySelector('#score')
                    scoreFinal.innerHTML = game.score
                    start.style.display = 'none'
                    nextLevel.style.display = 'block'
                    gameOver.style.display = 'block'
                }
            }
        })
    })

    nextLevel.addEventListener('click', () => {
        document.querySelector('#myModalLight').style.display = 'none'
        
        //change css style for canvas - level 2
        document.querySelector('#gameCanvas').classList.add('gameCanvas2')
        document.querySelector('#gameCanvas').classList.remove('gameCanvas')
        
        //new game - level 2
        game2.initial(2)
        game2.score = game.score
        game2.update2(() => {
            const gameOver = document.querySelector('#myModalLight')
            const show1 = document.querySelector('#show1')
            const show2 = document.querySelector('#show2')
            const scoreFinal = document.querySelector('#score')

            scoreFinal.innerHTML = game2.score
            show1.style.display = 'none'
            gameOver.style.display = 'block'
            start.style.display = 'block'
            nextLevel.style.display = 'none'
            show2.style.display = 'none'
            if (game2.gameOver === false) {
                document.querySelector('#gratulation').style.display = 'block'
            }
        })
    })


    // movement with arrows
    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            if (game.level == 1) {
                if (game.squirrel.x + game.squirrel.width + game.squirrel.speed <= game.canvas.width) {
                    game.squirrel.moveRight(null)
                    game.squirrel.movingLeft = false
                } 
            }
            if (game2.level == 2) {
                if (game2.squirrel.x + game2.squirrel.width + game2.squirrel.speed <= game2.canvas.width - 50) {
                    //acorn on the table
                    if ((game2.actualAcorn != null) && (game2.actualAcorn.finish)) {
                        game2.squirrel.moveRight(null)
                        game2.squirrel.movingLeft = false
                    } else {
                        game2.squirrel.moveRight(game2.actualAcorn)
                        game2.squirrel.movingLeft = false
                    }
                } 
            }
        }

        if (e.key === 'ArrowLeft') {
            if(game.level == 1){
                if (game.squirrel.x - game.squirrel.speed >= 0) {
                    game.squirrel.moveLeft(null)
                    game.squirrel.movingLeft = true
                }
            }
            if (game2.level == 2){
                if (game2.squirrel.x - game2.squirrel.speed >= 0) {
                    if ((game2.actualAcorn != null) && (game2.actualAcorn.finish)) {
                        game2.squirrel.moveLeft(null)
                        game2.squirrel.movingLeft = true
                    } else {
                        game2.squirrel.moveLeft(game2.actualAcorn)
                        game2.squirrel.movingLeft = true
                    }
                }
            }
        }

        if (e.key === 'ArrowUp') {
            if (game.level == 1){
                if (game.squirrel.x <= game.canvas.width - 20) {                   
                    game.squirrel.moveUp(game.imageY)
                }
            }
            if (game2.level == 2){
                if (game2.squirrel.x <= game2.canvas.width - 220) {                   
                    game2.squirrel.moveUp(game2.imageY, game2.actualAcorn)
                }
            }
        }

    })


    // squirrel control on the touch screen
    game.canvas.addEventListener('touchstart', (e) => {
        const touch = e.touches[0]
        game.lastTouchX = touch.clientX
        e.preventDefault()
    }, false);

    // squirrel control on the touch screen
    game.canvas.addEventListener('touchmove', (e) => {
        const touch = e.touches[0]
        let deltaX = touch.clientX - game.lastTouchX
        game.lastTouchX = touch.clientX
        if (deltaX > 0) {
            if(game.level == 1){
                if (game.squirrel.x + game.squirrel.width + game.squirrel.speed <= game.canvas.width)  {
                    game.squirrel.moveRight(null)
                    game.squirrel.movingLeft = false
                }
            }
            if (game.level == 2){
                if (game2.squirrel.x + game2.squirrel.width + game2.squirrel.speed <= game2.canvas.width-50) {
                    game2.squirrel.moveRight(game2.actualAcorn)
                    game2.squirrel.movingLeft = false
                } 
            }

        } else {
            if (game.level == 1){
                if (game.squirrel.x - game.squirrel.speed >= 0) {
                    game.squirrel.moveLeft(null)
                    game.squirrel.movingLeft = true
                }
            }
            if (game.level == 2){
                if (game2.squirrel.x - game2.squirrel.speed >= 0) {
                    game2.squirrel.moveLeft(game2.actualAcorn)
                    game2.squirrel.movingLeft = true
                }
            }
        }
        e.preventDefault()
    }, false)

}