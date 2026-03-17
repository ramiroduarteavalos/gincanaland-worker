// Maze Game - Objetivo: llegar a la meta verde
class MazeGame {
    constructor() {
        this.mazeContainer = null;
        this.maze = [];
        this.player = { x: 1, y: 1 };
        this.startTime = 0;
        this.gameRunning = false;
        this.mazeSize = 15;
        this.mazes = [
            // Laberinto 1 - Fácil
            [
                "###############",
                "#S............#",
                "#.############.#",
                "#.............#",
                "#########.#####",
                "#.............#",
                "#.############.#",
                "#.............#",
                "###############"
            ],
            // Laberinto 2 - Medio
            [
                "###############",
                "#S...........#",
                "#.###########.#",
                "#.#.........#.#",
                "#.#.#######.#.#",
                "#.#.#.....#.#.#",
                "#.#.#.###.#.#.#",
                "#.#.#...#.#.#.#",
                "#.#.#####.#.#.#",
                "#.#.......#.#.#",
                "#.#########.#.#",
                "#...........#.#",
                "###############"
            ],
            // Laberinto 3 - Difícil
            [
                "###############",
                "#S...........#",
                "#.###########.#",
                "#.#.........#.#",
                "#.#.#######.#.#",
                "#.#.#.....#.#.#",
                "#.#.#.###.#.#.#",
                "#.#.#...#.#.#.#",
                "#.#.#####.#.#.#",
                "#.#.......#.#.#",
                "#.#########.#.#",
                "#...........#.#",
                "#.###########.#",
                "#.............#",
                "###############"
            ]
        ];
        this.currentMazeIndex = 0;
    }

    init() {
        this.mazeContainer = document.getElementById('mazeContainer');
        this.reset();
        this.setupEventListeners();
        this.start();
    }

    reset() {
        this.currentMazeIndex = Math.floor(Math.random() * this.mazes.length);
        this.maze = this.mazes[this.currentMazeIndex].map(row => row.split(''));
        this.player = { x: 1, y: 1 };
        this.startTime = Date.now();
        this.gameRunning = true;
        this.renderMaze();
        this.updateTime();
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (!this.gameRunning) return;
            
            let newX = this.player.x;
            let newY = this.player.y;
            
            switch(e.key) {
                case 'ArrowUp':
                    newY = Math.max(0, this.player.y - 1);
                    break;
                case 'ArrowDown':
                    newY = Math.min(this.maze.length - 1, this.player.y + 1);
                    break;
                case 'ArrowLeft':
                    newX = Math.max(0, this.player.x - 1);
                    break;
                case 'ArrowRight':
                    newX = Math.min(this.maze[0].length - 1, this.player.x + 1);
                    break;
            }
            
            // Verificar si el movimiento es válido
            if (this.maze[newY] && this.maze[newY][newX] !== '#') {
                this.player.x = newX;
                this.player.y = newY;
                this.renderMaze();
                
                // Verificar si llegó a la meta
                if (this.maze[newY][newX] === 'E') {
                    this.victory();
                }
            }
        });
    }

    renderMaze() {
        this.mazeContainer.innerHTML = '';
        this.mazeContainer.style.gridTemplateColumns = `repeat(${this.maze[0].length}, 30px)`;
        this.mazeContainer.style.gridTemplateRows = `repeat(${this.maze.length}, 30px)`;
        
        for (let y = 0; y < this.maze.length; y++) {
            for (let x = 0; x < this.maze[y].length; x++) {
                const cell = document.createElement('div');
                cell.className = 'maze-cell';
                
                if (this.maze[y][x] === '#') {
                    cell.classList.add('maze-wall');
                } else if (this.maze[y][x] === 'S') {
                    cell.classList.add('maze-start');
                    cell.textContent = '🏁';
                } else if (this.maze[y][x] === 'E') {
                    cell.classList.add('maze-end');
                    cell.textContent = '🎯';
                } else {
                    cell.classList.add('maze-path');
                }
                
                // Mostrar jugador
                if (x === this.player.x && y === this.player.y) {
                    cell.classList.add('maze-player');
                    cell.textContent = '🧑';
                }
                
                this.mazeContainer.appendChild(cell);
            }
        }
    }

    updateTime() {
        if (!this.gameRunning) return;
        
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        document.getElementById('mazeTime').textContent = elapsed;
        
        setTimeout(() => this.updateTime(), 1000);
    }

    start() {
        this.gameRunning = true;
        this.startTime = Date.now();
        this.updateTime();
    }

    pause() {
        this.gameRunning = false;
    }

    victory() {
        this.gameRunning = false;
        const timeElapsed = Math.floor((Date.now() - this.startTime) / 1000);
        
        // Calcular puntos bonus por tiempo
        let bonusPoints = 0;
        if (timeElapsed < 30) bonusPoints = 20;
        else if (timeElapsed < 60) bonusPoints = 10;
        else if (timeElapsed < 90) bonusPoints = 5;
        
        // Mostrar mensaje de victoria
        const victoryOverlay = document.createElement('div');
        victoryOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(72, 187, 120, 0.95);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            color: white;
            font-family: 'Fredoka', sans-serif;
        `;
        
        victoryOverlay.innerHTML = `
            <h2 style="font-family: 'Fredoka One', cursive; font-size: 3rem; margin-bottom: 1rem;">🎉 ¡Felicidades!</h2>
            <p style="font-size: 1.5rem; margin-bottom: 1rem;">Has llegado a la meta</p>
            <p style="font-size: 1.2rem;">Tiempo: ${timeElapsed} segundos</p>
            ${bonusPoints > 0 ? `<p style="font-size: 1.2rem;">Bonus por velocidad: +${bonusPoints} puntos</p>` : ''}
        `;
        
        document.body.appendChild(victoryOverlay);
        
        // Completar el juego en el game manager
        setTimeout(() => {
            document.body.removeChild(victoryOverlay);
            if (window.gameManager) {
                window.gameManager.completeGame('maze', bonusPoints);
            }
        }, 3000);
    }
}

// Crear instancia global del juego
window.mazeGame = new MazeGame();
