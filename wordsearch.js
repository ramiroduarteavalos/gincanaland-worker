// Word Search Game - Sopa de letras con temas
class WordSearchGame {
    constructor() {
        this.wordGrid = null;
        this.wordList = null;
        this.grid = [];
        this.words = [];
        this.foundWords = [];
        this.selectedCells = [];
        this.gameRunning = false;
        this.gridSize = 21;
        
        // Temas y palabras
        this.themes = {
            naturaleza: {
                words: ['ARBOL', 'FLOR', 'SOL', 'LUNA', 'MAR', 'MONTAÑA', 'RIO', 'BOSQUE'],
                emoji: '🌳'
            },
            animales: {
                words: ['PERRO', 'GATO', 'LEON', 'ELEFANTE', 'TIGRE', 'OSO', 'CABALLO', 'VACA'],
                emoji: '🐱'
            },
            frutas: {
                words: ['MANZANA', 'PLATANO', 'NARANJA', 'FRESA', 'UVA', 'PERA', 'MELON', 'PINA'],
                emoji: '🍎'
            }
        };
        
        this.currentTheme = 'naturaleza';
    }

    init() {
        this.wordGrid = document.getElementById('wordGrid');
        this.wordList = document.getElementById('wordList');
        this.reset();
        this.setupEventListeners();
        this.start();
    }

    reset() {
        // Seleccionar tema aleatorio
        const themeKeys = Object.keys(this.themes);
        this.currentTheme = themeKeys[Math.floor(Math.random() * themeKeys.length)];
        this.words = [...this.themes[this.currentTheme].words];
        this.foundWords = [];
        this.selectedCells = [];
        this.gameRunning = true;
        
        this.generateGrid();
        this.renderGrid();
        this.renderWordList();
        this.updateScore();
    }

    generateGrid() {
        // Inicializar grid vacío
        this.grid = Array(this.gridSize).fill().map(() => Array(this.gridSize).fill(''));
        
        // Colocar palabras
        this.words.forEach(word => {
            this.placeWord(word);
        });
        
        // Llenar espacios vacíos con letras aleatorias
        this.fillEmptySpaces();
    }

    placeWord(word) {
        const directions = [
            { dx: 1, dy: 0 },   // Horizontal
            { dx: 0, dy: 1 },   // Vertical
            { dx: 1, dy: 1 },   // Diagonal
            { dx: -1, dy: 1 }   // Diagonal inversa
        ];
        
        let placed = false;
        let attempts = 0;
        
        while (!placed && attempts < 100) {
            const direction = directions[Math.floor(Math.random() * directions.length)];
            const startX = Math.floor(Math.random() * this.gridSize);
            const startY = Math.floor(Math.random() * this.gridSize);
            
            // Verificar si la palabra cabe
            const endX = startX + (word.length - 1) * direction.dx;
            const endY = startY + (word.length - 1) * direction.dy;
            
            if (endX >= 0 && endX < this.gridSize && endY >= 0 && endY < this.gridSize) {
                // Verificar si el espacio está libre
                let canPlace = true;
                for (let i = 0; i < word.length; i++) {
                    const x = startX + i * direction.dx;
                    const y = startY + i * direction.dy;
                    if (this.grid[y][x] !== '' && this.grid[y][x] !== word[i]) {
                        canPlace = false;
                        break;
                    }
                }
                
                if (canPlace) {
                    // Colocar la palabra
                    for (let i = 0; i < word.length; i++) {
                        const x = startX + i * direction.dx;
                        const y = startY + i * direction.dy;
                        this.grid[y][x] = word[i];
                    }
                    placed = true;
                }
            }
            
            attempts++;
        }
    }

    fillEmptySpaces() {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        for (let y = 0; y < this.gridSize; y++) {
            for (let x = 0; x < this.gridSize; x++) {
                if (this.grid[y][x] === '') {
                    this.grid[y][x] = letters[Math.floor(Math.random() * letters.length)];
                }
            }
        }
    }

    renderGrid() {
        this.wordGrid.innerHTML = '';
        this.wordGrid.style.gridTemplateColumns = `repeat(${this.gridSize}, 35px)`;
        this.wordGrid.style.gridTemplateRows = `repeat(${this.gridSize}, 35px)`;
        
        for (let y = 0; y < this.gridSize; y++) {
            for (let x = 0; x < this.gridSize; x++) {
                const cell = document.createElement('div');
                cell.className = 'word-cell';
                cell.textContent = this.grid[y][x];
                cell.dataset.x = x;
                cell.dataset.y = y;
                
                this.wordGrid.appendChild(cell);
            }
        }
    }

    renderWordList() {
        this.wordList.innerHTML = '';
        
        const themeInfo = this.themes[this.currentTheme];
        const title = document.createElement('h4');
        title.textContent = `Tema: ${this.currentTheme.charAt(0).toUpperCase() + this.currentTheme.slice(1)} ${themeInfo.emoji}`;
        this.wordList.appendChild(title);
        
        this.words.forEach(word => {
            const wordItem = document.createElement('div');
            wordItem.className = 'word-item';
            wordItem.textContent = word;
            wordItem.dataset.word = word;
            
            if (this.foundWords.includes(word)) {
                wordItem.classList.add('found');
            }
            
            this.wordList.appendChild(wordItem);
        });
    }

    setupEventListeners() {
        this.wordGrid.addEventListener('mousedown', (e) => {
            if (!this.gameRunning) return;
            
            const cell = e.target.closest('.word-cell');
            if (cell) {
                this.startSelection(cell);
            }
        });
        
        this.wordGrid.addEventListener('mouseover', (e) => {
            if (!this.gameRunning) return;
            
            const cell = e.target.closest('.word-cell');
            if (cell && this.selectedCells.length > 0) {
                this.updateSelection(cell);
            }
        });
        
        document.addEventListener('mouseup', () => {
            if (this.selectedCells.length > 0) {
                this.checkWord();
            }
        });
    }

    startSelection(cell) {
        this.selectedCells = [cell];
        cell.classList.add('selected');
    }

    updateSelection(cell) {
        if (this.selectedCells.length === 0) return;
        
        const startCell = this.selectedCells[0];
        const startX = parseInt(startCell.dataset.x);
        const startY = parseInt(startCell.dataset.y);
        const endX = parseInt(cell.dataset.x);
        const endY = parseInt(cell.dataset.y);
        
        // Limpiar selección anterior
        this.selectedCells.forEach(c => c.classList.remove('selected'));
        this.selectedCells = [];
        
        // Determinar dirección
        const dx = endX - startX;
        const dy = endY - startY;
        
        // Solo permitir horizontal y vertical
        if (dx !== 0 && dy !== 0) return;
        if (dx === 0 && dy === 0) return;
        
        // Normalizar dirección
        const stepX = dx === 0 ? 0 : dx / Math.abs(dx);
        const stepY = dy === 0 ? 0 : dy / Math.abs(dy);
        
        // Seleccionar celdas en línea
        let x = startX;
        let y = startY;
        const maxLength = Math.max(Math.abs(dx), Math.abs(dy)) + 1;
        
        for (let i = 0; i < maxLength; i++) {
            const cellElement = this.wordGrid.querySelector(`[data-x="${x}"][data-y="${y}"]`);
            if (cellElement) {
                this.selectedCells.push(cellElement);
                cellElement.classList.add('selected');
            }
            x += stepX;
            y += stepY;
        }
    }

    checkWord() {
        if (this.selectedCells.length < 3) {
            this.clearSelection();
            return;
        }
        
        // Obtener palabra seleccionada
        const selectedWord = this.selectedCells.map(cell => cell.textContent).join('');
        
        // Verificar si es una palabra válida
        if (this.words.includes(selectedWord) && !this.foundWords.includes(selectedWord)) {
            this.foundWords.push(selectedWord);
            
            // Marcar celdas como encontradas
            this.selectedCells.forEach(cell => {
                cell.classList.remove('selected');
                cell.classList.add('found');
            });
            
            // Actualizar lista de palabras
            this.renderWordList();
            this.updateScore();
            
            // Verificar si se completó el juego
            if (this.foundWords.length === this.words.length) {
                this.victory();
            }
        } else {
            this.clearSelection();
        }
    }

    clearSelection() {
        this.selectedCells.forEach(cell => {
            cell.classList.remove('selected');
        });
        this.selectedCells = [];
    }

    updateScore() {
        const score = this.foundWords.length * 5;
        document.getElementById('wordScore').textContent = this.foundWords.length;
        document.getElementById('totalWords').textContent = this.words.length;
    }

    start() {
        this.gameRunning = true;
    }

    pause() {
        this.gameRunning = false;
    }

    victory() {
        this.gameRunning = false;
        
        // Calcular puntos bonus por tiempo (simulado)
        const bonusPoints = Math.floor(Math.random() * 20) + 5;
        
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
        
        const themeInfo = this.themes[this.currentTheme];
        victoryOverlay.innerHTML = `
            <h2 style="font-family: 'Fredoka One', cursive; font-size: 3rem; margin-bottom: 1rem;">🎉 ¡Excelente!</h2>
            <p style="font-size: 1.5rem; margin-bottom: 1rem;">Has encontrado todas las palabras</p>
            <p style="font-size: 1.2rem;">Tema: ${this.currentTheme.charAt(0).toUpperCase() + this.currentTheme.slice(1)} ${themeInfo.emoji}</p>
            <p style="font-size: 1.2rem;">Palabras encontradas: ${this.foundWords.length}/${this.words.length}</p>
            <p style="font-size: 1.2rem;">Bonus: +${bonusPoints} puntos</p>
        `;
        
        document.body.appendChild(victoryOverlay);
        
        // Completar el juego en el game manager
        setTimeout(() => {
            document.body.removeChild(victoryOverlay);
            if (window.gameManager) {
                window.gameManager.completeGame('wordsearch', bonusPoints);
            }
        }, 3000);
    }
}

// Crear instancia global del juego
window.wordSearchGame = new WordSearchGame();
