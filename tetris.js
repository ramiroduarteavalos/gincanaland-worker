// Tetris Game - Objetivo: limpiar 3 filas
class TetrisGame {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.board = [];
        this.currentPiece = null;
        this.nextPiece = null;
        this.score = 0;
        this.linesCleared = 0;
        this.targetLines = 3;
        this.gameRunning = false;
        this.gameLoop = null;
        this.dropTime = 0;
        this.dropInterval = 1000;
        
        this.boardWidth = 10;
        this.boardHeight = 20;
        this.blockSize = 30;
        
        // Piezas de Tetris
        this.pieces = [
            {
                shape: [
                    [1, 1, 1, 1]
                ],
                color: '#00f5ff'
            },
            {
                shape: [
                    [1, 1],
                    [1, 1]
                ],
                color: '#ffff00'
            },
            {
                shape: [
                    [0, 1, 0],
                    [1, 1, 1]
                ],
                color: '#800080'
            },
            {
                shape: [
                    [0, 1, 1],
                    [1, 1, 0]
                ],
                color: '#00ff00'
            },
            {
                shape: [
                    [1, 1, 0],
                    [0, 1, 1]
                ],
                color: '#ff0000'
            },
            {
                shape: [
                    [1, 0, 0],
                    [1, 1, 1]
                ],
                color: '#ff8c00'
            },
            {
                shape: [
                    [0, 0, 1],
                    [1, 1, 1]
                ],
                color: '#0000ff'
            }
        ];
    }

    init() {
        this.canvas = document.getElementById('tetrisCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.setupResponsiveCanvas();
        this.reset();
        this.setupEventListeners();
        this.start();
    }

    setupResponsiveCanvas() {
        const container = this.canvas.parentElement;
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        
        // Usar todo el espacio disponible del contenedor
        const availableWidth = containerWidth - 20; // Margen de 10px por lado
        const availableHeight = containerHeight - 20; // Margen de 10px por lado
        
        // Calcular tamaño óptimo del canvas (más alto que ancho para Tetris)
        const maxWidth = Math.min(availableWidth, 300);
        const maxHeight = availableHeight;
        
        // Mantener proporción 1:2 (ancho:alto) para Tetris, pero usar todo el espacio disponible
        let canvasWidth = Math.max(200, maxWidth);
        let canvasHeight = Math.min(canvasWidth * 2, maxHeight);
        
        // Si hay más espacio vertical, ajustar el ancho
        if (canvasHeight < maxHeight) {
            canvasHeight = maxHeight;
            canvasWidth = Math.min(canvasHeight / 2, maxWidth);
        }
        
        // Asegurar que el tamaño sea múltiplo del blockSize
        const widthBlocks = Math.floor(canvasWidth / this.blockSize);
        const heightBlocks = Math.floor(canvasHeight / this.blockSize);
        
        const actualWidth = widthBlocks * this.blockSize;
        const actualHeight = heightBlocks * this.blockSize;
        
        // Establecer tamaño del canvas
        this.canvas.width = actualWidth;
        this.canvas.height = actualHeight;
        this.boardWidth = widthBlocks;
        this.boardHeight = heightBlocks;
        
        console.log(`📱 Tetris canvas responsivo: ${actualWidth}x${actualHeight}, board: ${this.boardWidth}x${this.boardHeight}, contenedor: ${containerWidth}x${containerHeight}`);
    }

    reset() {
        // Inicializar tablero vacío
        this.board = Array(this.boardHeight).fill().map(() => Array(this.boardWidth).fill(0));
        
        // Generar primera pieza
        this.currentPiece = this.generatePiece();
        this.nextPiece = this.generatePiece();
        
        // Resetear puntuación
        this.score = 0;
        this.linesCleared = 0;
        this.updateScore();
        
        // Estado del juego
        this.gameRunning = true;
        this.dropTime = 0;
    }

    generatePiece() {
        const piece = this.pieces[Math.floor(Math.random() * this.pieces.length)];
        return {
            shape: piece.shape,
            color: piece.color,
            x: Math.floor(this.boardWidth / 2) - Math.floor(piece.shape[0].length / 2),
            y: 0
        };
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (!this.gameRunning) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                    this.movePiece(-1, 0);
                    break;
                case 'ArrowRight':
                    this.movePiece(1, 0);
                    break;
                case 'ArrowDown':
                    this.movePiece(0, 1);
                    break;
                case 'ArrowUp':
                    this.rotatePiece();
                    break;
                case ' ':
                    e.preventDefault();
                    this.dropPiece();
                    break;
            }
        });
    }

    movePiece(dx, dy) {
        if (this.isValidMove(this.currentPiece, dx, dy)) {
            this.currentPiece.x += dx;
            this.currentPiece.y += dy;
            this.draw();
        } else if (dy > 0) {
            // La pieza no puede bajar más, colocarla
            this.placePiece();
        }
    }

    rotatePiece() {
        const rotated = this.rotateMatrix(this.currentPiece.shape);
        if (this.isValidRotation(rotated)) {
            this.currentPiece.shape = rotated;
            this.draw();
        }
    }

    rotateMatrix(matrix) {
        const rows = matrix.length;
        const cols = matrix[0].length;
        const rotated = Array(cols).fill().map(() => Array(rows).fill(0));
        
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                rotated[j][rows - 1 - i] = matrix[i][j];
            }
        }
        
        return rotated;
    }

    isValidRotation(rotatedShape) {
        for (let y = 0; y < rotatedShape.length; y++) {
            for (let x = 0; x < rotatedShape[y].length; x++) {
                if (rotatedShape[y][x]) {
                    const boardX = this.currentPiece.x + x;
                    const boardY = this.currentPiece.y + y;
                    
                    if (boardX < 0 || boardX >= this.boardWidth || 
                        boardY >= this.boardHeight || 
                        (boardY >= 0 && this.board[boardY][boardX])) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    isValidMove(piece, dx, dy) {
        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
                if (piece.shape[y][x]) {
                    const newX = piece.x + x + dx;
                    const newY = piece.y + y + dy;
                    
                    if (newX < 0 || newX >= this.boardWidth || 
                        newY >= this.boardHeight || 
                        (newY >= 0 && this.board[newY][newX])) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    placePiece() {
        // Colocar la pieza en el tablero
        for (let y = 0; y < this.currentPiece.shape.length; y++) {
            for (let x = 0; x < this.currentPiece.shape[y].length; x++) {
                if (this.currentPiece.shape[y][x]) {
                    const boardX = this.currentPiece.x + x;
                    const boardY = this.currentPiece.y + y;
                    
                    if (boardY >= 0) {
                        this.board[boardY][boardX] = this.currentPiece.color;
                    }
                }
            }
        }
        
        // Verificar líneas completas
        this.clearLines();
        
        // Generar nueva pieza
        this.currentPiece = this.nextPiece;
        this.nextPiece = this.generatePiece();
        
        // Verificar game over
        if (!this.isValidMove(this.currentPiece, 0, 0)) {
            this.gameOver();
        }
        
        this.draw();
    }

    clearLines() {
        let linesToClear = [];
        
        for (let y = this.boardHeight - 1; y >= 0; y--) {
            if (this.board[y].every(cell => cell !== 0)) {
                linesToClear.push(y);
            }
        }
        
        if (linesToClear.length > 0) {
            // Eliminar líneas completas
            linesToClear.forEach(lineY => {
                this.board.splice(lineY, 1);
                this.board.unshift(Array(this.boardWidth).fill(0));
            });
            
            this.linesCleared += linesToClear.length;
            this.score += linesToClear.length * 100;
            this.updateScore();
            
            // Verificar si se alcanzó el objetivo
            if (this.linesCleared >= this.targetLines) {
                this.victory();
            }
        }
    }

    dropPiece() {
        while (this.isValidMove(this.currentPiece, 0, 1)) {
            this.currentPiece.y++;
        }
        this.placePiece();
    }

    update() {
        if (!this.gameRunning) return;
        
        const now = Date.now();
        if (now - this.dropTime > this.dropInterval) {
            this.movePiece(0, 1);
            this.dropTime = now;
        }
    }

    draw() {
        // Limpiar canvas
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Dibujar tablero
        this.drawBoard();
        
        // Dibujar pieza actual
        this.drawPiece(this.currentPiece);
        
        // Dibujar grid
        this.drawGrid();
        
        // Dibujar información
        this.drawInfo();
    }

    drawBoard() {
        for (let y = 0; y < this.boardHeight; y++) {
            for (let x = 0; x < this.boardWidth; x++) {
                if (this.board[y][x]) {
                    this.ctx.fillStyle = this.board[y][x];
                    this.ctx.fillRect(
                        x * this.blockSize,
                        y * this.blockSize,
                        this.blockSize - 1,
                        this.blockSize - 1
                    );
                }
            }
        }
    }

    drawPiece(piece) {
        this.ctx.fillStyle = piece.color;
        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
                if (piece.shape[y][x]) {
                    this.ctx.fillRect(
                        (piece.x + x) * this.blockSize,
                        (piece.y + y) * this.blockSize,
                        this.blockSize - 1,
                        this.blockSize - 1
                    );
                }
            }
        }
    }

    drawGrid() {
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 1;
        
        for (let x = 0; x <= this.boardWidth; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * this.blockSize, 0);
            this.ctx.lineTo(x * this.blockSize, this.canvas.height);
            this.ctx.stroke();
        }
        
        for (let y = 0; y <= this.boardHeight; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * this.blockSize);
            this.ctx.lineTo(this.canvas.width, y * this.blockSize);
            this.ctx.stroke();
        }
    }

    drawInfo() {
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '16px Fredoka';
        this.ctx.fillText(`Líneas: ${this.linesCleared}/${this.targetLines}`, 10, 20);
        this.ctx.fillText(`Puntos: ${this.score}`, 10, 40);
    }

    updateScore() {
        document.getElementById('tetrisScore').textContent = this.linesCleared;
    }

    start() {
        this.gameLoop = setInterval(() => {
            this.update();
        }, 50);
        this.draw();
    }

    pause() {
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
        }
        this.gameRunning = false;
    }

    gameOver() {
        this.gameRunning = false;
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
        }
        
        // Mostrar mensaje de game over
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#f56565';
        this.ctx.font = 'bold 24px Fredoka One';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('¡Game Over!', this.canvas.width / 2, this.canvas.height / 2 - 20);
        
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '16px Fredoka';
        this.ctx.fillText('Presiona R para reintentar', this.canvas.width / 2, this.canvas.height / 2 + 20);
        
        // Agregar listener para reintentar
        const retryListener = (e) => {
            if (e.key === 'r' || e.key === 'R') {
                document.removeEventListener('keydown', retryListener);
                this.reset();
                this.start();
            }
        };
        document.addEventListener('keydown', retryListener);
    }

    victory() {
        this.gameRunning = false;
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
        }
        
        // Mostrar mensaje de victoria
        this.ctx.fillStyle = 'rgba(72, 187, 120, 0.9)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 24px Fredoka One';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('¡Felicidades!', this.canvas.width / 2, this.canvas.height / 2 - 20);
        
        this.ctx.font = '16px Fredoka';
        this.ctx.fillText(`Has limpiado ${this.linesCleared} líneas`, this.canvas.width / 2, this.canvas.height / 2 + 10);
        
        // Completar el juego en el game manager
        setTimeout(() => {
            if (window.gameManager) {
                window.gameManager.completeGame('tetris', this.score);
            }
        }, 2000);
    }
}

// Crear instancia global del juego
window.tetrisGame = new TetrisGame();