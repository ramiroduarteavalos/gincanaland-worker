// Game Manager - Sistema de gestión de juegos y progresión
class GameManager {
    constructor() {
        this.currentLevel = 1;
        this.totalScore = 0;
        this.completedGames = [];
        this.stickers = [];
        this.gameOrder = ['snake', 'pacman', 'wordsearch', 'tetris'];
        this.cardIds = {
            'snake': 'snakeCard',
            'pacman': 'pacmanCard', 
            'wordsearch': 'wordCard',
            'tetris': 'tetrisCard'
        };
        this.screenIds = {
            'snake': 'snakeGame',
            'pacman': 'pacmanGame',
            'wordsearch': 'wordSearchGame',
            'tetris': 'tetrisGame'
        };
        this.gameRewards = {
            snake: { points: 20, sticker: '🐍👑', name: 'snake-crown' },
            pacman: { points: 30, sticker: '👻🏆', name: 'pacman-medal' },
            wordsearch: { points: 25, sticker: '🏅', name: 'word-star' },
            tetris: { points: 50, sticker: '⭐', name: 'tetris-star' }
        };
        
        this.loadProgress();
        this.updateUI();
    }

    // Cargar progreso desde localStorage
    loadProgress() {
        const saved = localStorage.getItem('gincanaLandProgress');
        if (saved) {
            const data = JSON.parse(saved);
            this.currentLevel = data.currentLevel || 1;
            this.totalScore = data.totalScore || 0;
            this.completedGames = data.completedGames || [];
            this.stickers = data.stickers || [];
        }
    }

    // Guardar progreso en localStorage
    saveProgress() {
        const data = {
            currentLevel: this.currentLevel,
            totalScore: this.totalScore,
            completedGames: this.completedGames,
            stickers: this.stickers
        };
        localStorage.setItem('gincanaLandProgress', JSON.stringify(data));
    }

    // Verificar si un juego está desbloqueado
    isGameUnlocked(gameId) {
        if (gameId === 'snake') {
            console.log('🐍 Snake siempre desbloqueado');
            return true;
        }
        const gameIndex = this.gameOrder.indexOf(gameId);
        const previousGame = this.gameOrder[gameIndex - 1];
        const isUnlocked = this.completedGames.includes(previousGame);
        console.log(`🔍 Verificando ${gameId}: juego anterior ${previousGame}, completado: ${this.completedGames.includes(previousGame)}, desbloqueado: ${isUnlocked}`);
        return isUnlocked;
    }

    // Completar un juego
    completeGame(gameId, bonusPoints = 0) {
        console.log('🎮 GameManager.completeGame() llamado con:', gameId, 'bonus:', bonusPoints);
        
        const reward = this.gameRewards[gameId];
        console.log('🏆 Recompensa:', reward);
        
        // Siempre agregar puntos (incluso si ya se completó antes)
        this.totalScore += reward.points + bonusPoints;
        console.log('💰 Puntos agregados:', reward.points + bonusPoints, 'Total:', this.totalScore);
        
        // Solo agregar sticker si no se había completado antes
        if (!this.completedGames.includes(gameId)) {
            console.log('✅ Juego no completado antes, agregando sticker...');
            this.completedGames.push(gameId);
            this.stickers.push({
                id: reward.name,
                emoji: reward.sticker,
                game: gameId,
                earned: new Date().toISOString()
            });
        } else {
            console.log('⚠️ Juego ya completado anteriormente, solo agregando puntos');
        }
        
        // Siempre avanzar al siguiente nivel
        const gameIndex = this.gameOrder.indexOf(gameId);
        if (gameIndex < this.gameOrder.length - 1) {
            this.currentLevel = gameIndex + 2;
        } else {
            this.currentLevel = this.gameOrder.length;
        }
        
        console.log('📊 Puntuación total:', this.totalScore, 'Nivel:', this.currentLevel);
        
        this.saveProgress();
        this.updateUI();
        console.log('🎉 Llamando a showVictoryScreen()');
        this.showVictoryScreen(gameId, reward.points + bonusPoints, reward.sticker);
    }

    // Mostrar pantalla de victoria
    showVictoryScreen(gameId, points, sticker) {
        console.log('🎉 showVictoryScreen() llamado con:', gameId, points, sticker);
        
        const victoryScreen = document.getElementById('victoryScreen');
        const victorySticker = document.getElementById('victorySticker');
        const victoryMessage = document.getElementById('victoryMessage');
        const victoryPoints = document.getElementById('victoryPoints');
        
        console.log('🔍 Elementos encontrados:', {
            victoryScreen: !!victoryScreen,
            victorySticker: !!victorySticker,
            victoryMessage: !!victoryMessage,
            victoryPoints: !!victoryPoints
        });
        
        if (victorySticker) victorySticker.textContent = sticker;
        if (victoryPoints) victoryPoints.textContent = points;
        
        const gameNames = {
            snake: 'Snake',
            pacman: 'Pacman',
            wordsearch: 'Sopa de Letras',
            tetris: 'Tetris'
        };
        
        if (victoryMessage) victoryMessage.textContent = `¡Has completado ${gameNames[gameId]}!`;
        
        // Ocultar todas las pantallas y mostrar victoria
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        if (victoryScreen) {
            victoryScreen.classList.add('active');
            console.log('✅ Pantalla de victoria activada');
        } else {
            console.error('❌ No se encontró la pantalla de victoria');
        }
    }

    // Ir al siguiente nivel después de completar un juego
    goToNextLevel() {
        console.log('🎮 goToNextLevel() llamado');
        
        // Ocultar pantalla de victoria
        const victoryScreen = document.getElementById('victoryScreen');
        if (victoryScreen) {
            victoryScreen.classList.remove('active');
        }
        
        // Encontrar el siguiente juego desbloqueado
        const nextGame = this.getNextUnlockedGame();
        
        if (nextGame) {
            console.log('➡️ Siguiente juego:', nextGame);
            this.startGame(nextGame);
        } else {
            console.log('🏁 Todos los juegos completados, volviendo al menú');
            showMainMenu();
        }
    }

    // Obtener el siguiente juego desbloqueado
    getNextUnlockedGame() {
        // Buscar el siguiente juego en el orden, sin importar si ya se completó
        const currentGameIndex = this.gameOrder.indexOf('pacman'); // Asumiendo que acabamos de completar Pacman
        const nextGameIndex = currentGameIndex + 1;
        
        if (nextGameIndex < this.gameOrder.length) {
            const nextGame = this.gameOrder[nextGameIndex];
            console.log('➡️ Siguiente juego en orden:', nextGame);
            return nextGame;
        }
        
        // Si no hay siguiente juego, buscar el primer juego no completado
        for (let i = 0; i < this.gameOrder.length; i++) {
            const gameId = this.gameOrder[i];
            if (!this.completedGames.includes(gameId)) {
                console.log('➡️ Primer juego no completado:', gameId);
                return gameId;
            }
        }
        
        console.log('🏁 Todos los juegos completados');
        return null; // Todos los juegos completados
    }

    // Actualizar la interfaz de usuario
    updateUI() {
        // Actualizar puntuación y nivel
        document.getElementById('totalScore').textContent = this.totalScore;
        document.getElementById('currentLevel').textContent = this.currentLevel;
        
        // Actualizar estado de los juegos
        this.gameOrder.forEach(gameId => {
            const cardId = this.cardIds[gameId];
            const card = document.getElementById(cardId);
            if (!card) {
                console.error('❌ No se encontró la tarjeta:', cardId);
                return;
            }
            
            if (this.isGameUnlocked(gameId)) {
                card.classList.remove('locked');
                // Ocultar el candado
                const lockElement = card.querySelector('.lock');
                if (lockElement) {
                    lockElement.style.display = 'none';
                    console.log('🔓 Candado ocultado para:', gameId);
                } else {
                    console.log('⚠️ No se encontró elemento .lock para:', gameId);
                }
                card.onclick = () => {
                    console.log('🖱️ Click en tarjeta:', gameId);
                    this.startGame(gameId);
                };
                console.log('✅ Tarjeta desbloqueada:', gameId);
            } else {
                card.classList.add('locked');
                // Mostrar el candado
                const lockElement = card.querySelector('.lock');
                if (lockElement) {
                    lockElement.style.display = 'block';
                    console.log('🔒 Candado mostrado para:', gameId);
                } else {
                    console.log('⚠️ No se encontró elemento .lock para:', gameId);
                }
                card.onclick = null;
                console.log('🔒 Tarjeta bloqueada:', gameId);
            }
            
            // Marcar como completado
            if (this.completedGames.includes(gameId)) {
                card.style.background = 'linear-gradient(45deg, #c6f6d5, #9ae6b4)';
                card.style.border = '3px solid #48bb78';
            }
        });
        
        // Actualizar colección de pegatinas
        this.updateStickerDisplay();
    }

    // Actualizar display de pegatinas
    updateStickerDisplay() {
        const stickerDisplay = document.getElementById('stickerDisplay');
        stickerDisplay.innerHTML = '';
        
        if (this.stickers.length === 0) {
            stickerDisplay.innerHTML = '<p style="color: #999; font-style: italic;">Aún no tienes pegatinas. ¡Completa los juegos para ganarlas!</p>';
            return;
        }
        
        this.stickers.forEach(sticker => {
            const stickerElement = document.createElement('div');
            stickerElement.className = 'sticker';
            stickerElement.textContent = sticker.emoji;
            stickerElement.title = `Ganado en ${sticker.game} - ${new Date(sticker.earned).toLocaleDateString()}`;
            stickerDisplay.appendChild(stickerElement);
        });
    }

    // Iniciar un juego
    startGame(gameId) {
        console.log('🎮 Iniciando juego:', gameId);
        
        if (!this.isGameUnlocked(gameId)) {
            console.log('❌ Juego no desbloqueado:', gameId);
            return;
        }
        
        // Ocultar menú principal
        document.getElementById('mainMenu').classList.remove('active');
        
        // Mostrar el juego correspondiente
        const screenId = this.screenIds[gameId];
        const gameScreen = document.getElementById(screenId);
        if (gameScreen) {
            console.log('✅ Pantalla de juego encontrada:', screenId);
            gameScreen.classList.add('active');
            
            // Inicializar el juego específico
            switch(gameId) {
                case 'snake':
                    console.log('🐍 Inicializando Snake...');
                    if (window.snakeGame) {
                        window.snakeGame.init();
                        console.log('✅ Snake inicializado');
                    } else {
                        console.error('❌ window.snakeGame no está disponible');
                    }
                    break;
                case 'pacman':
                    console.log('👻 Inicializando Pacman...');
                    if (window.pacmanGame) {
                        window.pacmanGame.init();
                        console.log('✅ Pacman inicializado');
                    } else {
                        console.error('❌ window.pacmanGame no está disponible');
                    }
                    break;
                case 'wordsearch':
                    if (window.wordSearchGame) window.wordSearchGame.init();
                    break;
                case 'tetris':
                    if (window.tetrisGame) window.tetrisGame.init();
                    break;
            }
        } else {
            console.error('❌ No se encontró la pantalla del juego:', screenId);
        }
    }

    // Reiniciar progreso (para testing)
    resetProgress() {
        localStorage.removeItem('gincanaLandProgress');
        this.currentLevel = 1;
        this.totalScore = 0;
        this.completedGames = [];
        this.stickers = [];
        this.updateUI();
    }

    // Obtener estadísticas
    getStats() {
        return {
            currentLevel: this.currentLevel,
            totalScore: this.totalScore,
            completedGames: this.completedGames.length,
            totalGames: this.gameOrder.length,
            stickers: this.stickers.length,
            progress: (this.completedGames.length / this.gameOrder.length) * 100
        };
    }
}

// Funciones globales para la interfaz
function showMainMenu() {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById('mainMenu').classList.add('active');
    
    // Pausar cualquier juego activo
    if (window.snakeGame) window.snakeGame.pause();
    if (window.mazeGame) window.mazeGame.pause();
    if (window.wordSearchGame) window.wordSearchGame.pause();
    if (window.tetrisGame) window.tetrisGame.pause();
}

// Función global para ir al siguiente nivel
function goToNextLevel() {
    if (window.gameManager) {
        window.gameManager.goToNextLevel();
    } else {
        console.error('❌ gameManager no está disponible');
        showMainMenu();
    }
}

// Inicializar el game manager cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    window.gameManager = new GameManager();
    console.log('✅ GameManager inicializado y disponible globalmente');
});
