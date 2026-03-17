// Snake Game - Objetivo: alcanzar 5 manzanas
class SnakeGame {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.gridSize = 20;
        this.tileCount = 20;
        this.snake = [];
        this.food = {};
        this.dx = 0;
        this.dy = 0;
        this.score = 0;
        this.gameRunning = false;
        this.gameLoop = null;
        this.targetLength = 5; // Objetivo del juego
    }

    init() {
        this.canvas = document.getElementById('snakeCanvas');
        if (!this.canvas) {
            console.error('❌ No se encontró el canvas de Snake');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) {
            console.error('❌ No se pudo obtener el contexto 2D del canvas');
            return;
        }
        
        // Configurar tamaño responsivo del canvas
        this.setupResponsiveCanvas();
        
        console.log('✅ Snake canvas encontrado:', this.canvas.width, 'x', this.canvas.height);
        this.reset();
        this.setupEventListeners();
        this.setupMobileControls();
        this.draw(); // Dibujar inmediatamente
        this.start();
        
        // Forzar redimensionamiento después de un delay para asegurar que el DOM esté listo
        setTimeout(() => {
            this.setupResponsiveCanvas();
            this.generateFood();
            this.draw();
        }, 100);
        
        // Segundo redimensionamiento después de más tiempo
        setTimeout(() => {
            this.setupResponsiveCanvas();
            this.generateFood();
            this.draw();
        }, 500);
        
        // Tercer redimensionamiento para asegurar el tamaño correcto
        setTimeout(() => {
            this.setupResponsiveCanvas();
            this.generateFood();
            this.draw();
        }, 1000);
        
        // Agregar botón de debug temporal
        this.addDebugButton();
        
        // Agregar botón "Continuar" gris (inactivo)
        this.addInactiveContinueButton();
    }

    setupResponsiveCanvas() {
        const container = this.canvas.parentElement;
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        
        console.log(`📏 Contenedor actual: ${containerWidth}x${containerHeight}`);
        
        // Usar el tamaño real del contenedor (más agresivo)
        const availableWidth = containerWidth - 40; // Margen para padding
        const availableHeight = containerHeight - 40; // Margen para padding
        
        // Calcular el tamaño máximo que cabe en el contenedor
        const maxSize = Math.min(availableWidth, availableHeight);
        const canvasSize = Math.max(400, maxSize); // Tamaño mínimo más grande
        
        // Asegurar que el tamaño sea múltiplo del gridSize para mantener la cuadrícula
        const gridCount = Math.floor(canvasSize / this.gridSize);
        const actualSize = gridCount * this.gridSize;
        
        // Establecer tamaño del canvas
        this.canvas.width = actualSize;
        this.canvas.height = actualSize;
        this.tileCount = gridCount;
        
        // Ajustar posición de la serpiente al centro
        this.snake = [
            { x: Math.floor(this.tileCount / 2), y: Math.floor(this.tileCount / 2) }
        ];
        
        console.log(`📱 Canvas responsivo configurado: ${actualSize}x${actualSize}, tiles: ${this.tileCount}x${this.tileCount}, disponible: ${availableWidth}x${availableHeight}`);
        
        // Forzar el estilo del canvas para que se ajuste al contenedor
        this.canvas.style.width = availableWidth + 'px';
        this.canvas.style.height = availableHeight + 'px';
        this.canvas.style.maxWidth = availableWidth + 'px';
        this.canvas.style.maxHeight = availableHeight + 'px';
    }

    reset() {
        console.log('🔄 Reseteando Snake...');
        
        // Inicializar serpiente en el centro
        this.snake = [
            { x: Math.floor(this.tileCount / 2), y: Math.floor(this.tileCount / 2) }
        ];
        
        // Dirección inicial
        this.dx = 0;
        this.dy = 0;
        
        // Puntuación
        this.score = 0;
        this.updateScore();
        
        // Generar comida
        this.generateFood();
        
        // Estado del juego
        this.gameRunning = true;
        
        console.log('✅ Snake reseteado - Game running:', this.gameRunning);
        
        // Dibujar el estado inicial
        if (this.ctx) {
            this.draw();
            console.log('✅ Canvas dibujado');
        } else {
            console.error('❌ No hay contexto para dibujar');
        }
    }

    setupEventListeners() {
        // Remover listener anterior si existe
        if (this.keyListener) {
            document.removeEventListener('keydown', this.keyListener);
        }
        
        this.keyListener = (e) => {
            // Solo ignorar teclas que no sean flechas cuando el juego no está corriendo
            if (!this.gameRunning && !['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                console.log('🎮 Juego no está corriendo, ignorando tecla:', e.key);
                return;
            }
            
            console.log('🎮 Tecla presionada:', e.key, 'Game running:', this.gameRunning);
            
            switch(e.key) {
                case 'ArrowUp':
                    if (this.dy !== 1) {
                        this.dx = 0;
                        this.dy = -1;
                        console.log('⬆️ Moviendo hacia arriba');
                        // Activar el juego si no está corriendo
                        if (!this.gameRunning) {
                            this.gameRunning = true;
                            console.log('🚀 Juego activado desde flecha arriba');
                        }
                    }
                    break;
                case 'ArrowDown':
                    if (this.dy !== -1) {
                        this.dx = 0;
                        this.dy = 1;
                        console.log('⬇️ Moviendo hacia abajo');
                        // Activar el juego si no está corriendo
                        if (!this.gameRunning) {
                            this.gameRunning = true;
                            console.log('🚀 Juego activado desde flecha abajo');
                        }
                    }
                    break;
                case 'ArrowLeft':
                    if (this.dx !== 1) {
                        this.dx = -1;
                        this.dy = 0;
                        console.log('⬅️ Moviendo hacia izquierda');
                        // Activar el juego si no está corriendo
                        if (!this.gameRunning) {
                            this.gameRunning = true;
                            console.log('🚀 Juego activado desde flecha izquierda');
                        }
                    }
                    break;
                case 'ArrowRight':
                    if (this.dx !== -1) {
                        this.dx = 1;
                        this.dy = 0;
                        console.log('➡️ Moviendo hacia derecha');
                        // Activar el juego si no está corriendo
                        if (!this.gameRunning) {
                            this.gameRunning = true;
                            console.log('🚀 Juego activado desde flecha derecha');
                        }
                    }
                    break;
            }
        };
        
        document.addEventListener('keydown', this.keyListener);
        
        // Listener para redimensionar
        this.resizeListener = () => {
            if (this.canvas && this.ctx) {
                this.setupResponsiveCanvas();
                this.generateFood();
                this.draw();
            }
        };
        window.addEventListener('resize', this.resizeListener);
        
        console.log('✅ Event listeners configurados para Snake');
    }

    setupMobileControls() {
        if (window.mobileControls) {
            window.mobileControls.addSnakeControls(this.canvas, this);
            console.log('📱 Controles móviles configurados para Snake');
        }
    }

    addDebugButton() {
        // Solo agregar en desarrollo
        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            return;
        }
        
        const debugBtn = document.createElement('button');
        debugBtn.textContent = '🔧 Redimensionar';
        debugBtn.style.cssText = `
            position: fixed;
            top: 60px;
            right: 10px;
            z-index: 1000;
            background: #667eea;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 10px;
            font-family: 'Fredoka', sans-serif;
            cursor: pointer;
            font-size: 12px;
        `;
        
        debugBtn.addEventListener('click', () => {
            console.log('🔧 Forzando redimensionamiento...');
            this.setupResponsiveCanvas();
            this.generateFood();
            this.draw();
        });
        
        // Botón para forzar victoria (solo en desarrollo)
        const victoryBtn = document.createElement('button');
        victoryBtn.textContent = '🏆 Forzar Victoria';
        victoryBtn.style.cssText = `
            position: fixed;
            top: 100px;
            right: 10px;
            z-index: 1000;
            background: #48bb78;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 10px;
            font-family: 'Fredoka', sans-serif;
            cursor: pointer;
            font-size: 12px;
        `;
        
        victoryBtn.addEventListener('click', () => {
            console.log('🏆 Forzando victoria...');
            this.victory();
        });
        
        // Botón para probar pantalla de victoria (solo en desarrollo)
        const testVictoryBtn = document.createElement('button');
        testVictoryBtn.textContent = '🎉 Test Victoria';
        testVictoryBtn.style.cssText = `
            position: fixed;
            top: 140px;
            right: 10px;
            z-index: 1000;
            background: #f59e0b;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 10px;
            font-family: 'Fredoka', sans-serif;
            cursor: pointer;
            font-size: 12px;
        `;
        
        testVictoryBtn.addEventListener('click', () => {
            console.log('🎉 Probando pantalla de victoria...');
            if (window.gameManager) {
                window.gameManager.showVictoryScreen('snake', 50, '🐍👑');
            } else {
                console.error('❌ gameManager no está disponible');
            }
        });
        
        document.body.appendChild(debugBtn);
        document.body.appendChild(victoryBtn);
        document.body.appendChild(testVictoryBtn);
    }

    addVictoryButton() {
        // Remover botón anterior si existe
        const existingBtn = this.canvas.parentElement.querySelector('.victory-continue-btn');
        if (existingBtn) {
            existingBtn.remove();
        }
        
        const continueBtn = document.createElement('button');
        continueBtn.textContent = 'Continuar';
        continueBtn.className = 'victory-continue-btn';
        continueBtn.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, 50%);
            background: linear-gradient(45deg, #667eea, #764ba2);
            color: white;
            border: none;
            padding: 1rem 2rem;
            border-radius: 25px;
            font-family: 'Fredoka', sans-serif;
            font-size: 1.2rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            z-index: 1000;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        `;
        
        continueBtn.addEventListener('click', () => {
            console.log('🎮 Botón Continuar presionado');
            continueBtn.remove();
            
            // Mostrar la pantalla de victoria completa
            if (window.gameManager) {
                console.log('🎉 Mostrando pantalla de victoria con puntuación:', 20);
                window.gameManager.showVictoryScreen('snake', 20, '🐍👑');
            } else {
                console.error('❌ gameManager no está disponible, esperando...');
                // Esperar un poco y volver a intentar
                setTimeout(() => {
                    if (window.gameManager) {
                        console.log('🎉 GameManager encontrado en segundo intento');
                        window.gameManager.showVictoryScreen('snake', 20, '🐍👑');
                    } else {
                        console.error('❌ GameManager aún no disponible, volviendo al menú');
                        showMainMenu();
                    }
                }, 1000);
            }
        });
        
        continueBtn.addEventListener('mouseenter', () => {
            continueBtn.style.transform = 'translate(-50%, 50%) scale(1.05)';
            continueBtn.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.3)';
        });
        
        continueBtn.addEventListener('mouseleave', () => {
            continueBtn.style.transform = 'translate(-50%, 50%) scale(1)';
            continueBtn.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
        });
        
        // Posicionar el botón sobre el canvas
        this.canvas.parentElement.style.position = 'relative';
        this.canvas.parentElement.appendChild(continueBtn);
        
        console.log('✅ Botón Continuar agregado al canvas');
    }

    addInactiveContinueButton() {
        // Remover botón anterior si existe
        const existingBtn = this.canvas.parentElement.querySelector('.inactive-continue-btn');
        if (existingBtn) {
            existingBtn.remove();
        }
        
        const inactiveBtn = document.createElement('button');
        inactiveBtn.textContent = 'Continuar';
        inactiveBtn.className = 'inactive-continue-btn';
        inactiveBtn.style.cssText = `
            position: absolute;
            bottom: 20px;
            right: 20px;
            background: #9ca3af;
            color: white;
            border: none;
            padding: 0.8rem 1.5rem;
            border-radius: 20px;
            font-family: 'Fredoka', sans-serif;
            font-size: 1rem;
            font-weight: 600;
            cursor: not-allowed;
            opacity: 0.6;
            z-index: 1000;
            transition: all 0.3s ease;
        `;
        
        // El botón está deshabilitado hasta que termine el juego
        inactiveBtn.disabled = true;
        
        // Posicionar el botón en la esquina inferior derecha
        this.canvas.parentElement.style.position = 'relative';
        this.canvas.parentElement.appendChild(inactiveBtn);
        
        console.log('✅ Botón Continuar inactivo agregado');
    }

    activateContinueButton() {
        const inactiveBtn = this.canvas.parentElement.querySelector('.inactive-continue-btn');
        if (inactiveBtn) {
            inactiveBtn.style.background = 'linear-gradient(45deg, #667eea, #764ba2)';
            inactiveBtn.style.cursor = 'pointer';
            inactiveBtn.style.opacity = '1';
            inactiveBtn.disabled = false;
            
            inactiveBtn.addEventListener('click', () => {
                console.log('🎮 Botón Continuar activado presionado');
                inactiveBtn.remove();
                this.victory();
            });
            
            console.log('✅ Botón Continuar activado');
        }
    }

    generateFood() {
        do {
            this.food = {
                x: Math.floor(Math.random() * this.tileCount),
                y: Math.floor(Math.random() * this.tileCount)
            };
        } while (this.snake.some(segment => segment.x === this.food.x && segment.y === this.food.y));
    }

    update() {
        if (!this.gameRunning) {
            console.log('⏸️ Juego no está corriendo, saltando update');
            return;
        }
        
        // No mover si no hay dirección establecida
        if (this.dx === 0 && this.dy === 0) {
            return;
        }
        
        // Mover la cabeza de la serpiente
        const head = { x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy };
        
        // Verificar colisiones con las paredes
        if (head.x < 0 || head.x >= this.tileCount || head.y < 0 || head.y >= this.tileCount) {
            console.log('💥 Colisión con pared - Posición:', head.x, head.y);
            this.gameOver();
            return;
        }
        
        // Verificar colisión consigo misma
        if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.gameOver();
            return;
        }
        
        this.snake.unshift(head);
        
        // Verificar si comió la comida
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.updateScore();
            this.generateFood();
            
            console.log('🍎 Comió manzana! Manzanas actuales:', this.snake.length, 'Objetivo:', this.targetLength);
            
            // Verificar si alcanzó el objetivo
            if (this.snake.length >= this.targetLength) {
                console.log('🏆 ¡Objetivo alcanzado! Llamando a victory()');
                this.victory();
                return;
            }
        } else {
            // Si no comió, quitar la cola
            this.snake.pop();
        }
        
        this.draw();
    }

    draw() {
        if (!this.ctx || !this.canvas) {
            console.error('❌ No se puede dibujar: canvas o contexto no disponible');
            return;
        }
        
        // Limpiar canvas
        this.ctx.fillStyle = '#f8f9fa';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Dibujar grid
        this.ctx.strokeStyle = '#e2e8f0';
        this.ctx.lineWidth = 1;
        for (let i = 0; i <= this.tileCount; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.gridSize, 0);
            this.ctx.lineTo(i * this.gridSize, this.canvas.height);
            this.ctx.stroke();
            
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.gridSize);
            this.ctx.lineTo(this.canvas.width, i * this.gridSize);
            this.ctx.stroke();
        }
        
        // Dibujar serpiente
        this.snake.forEach((segment, index) => {
            if (index === 0) {
                // Cabeza
                this.ctx.fillStyle = '#48bb78';
                this.ctx.fillRect(
                    segment.x * this.gridSize + 2,
                    segment.y * this.gridSize + 2,
                    this.gridSize - 4,
                    this.gridSize - 4
                );
                
                // Ojos
                this.ctx.fillStyle = '#2d3748';
                this.ctx.fillRect(
                    segment.x * this.gridSize + 6,
                    segment.y * this.gridSize + 6,
                    3, 3
                );
                this.ctx.fillRect(
                    segment.x * this.gridSize + 11,
                    segment.y * this.gridSize + 6,
                    3, 3
                );
            } else {
                // Cuerpo
                this.ctx.fillStyle = '#68d391';
                this.ctx.fillRect(
                    segment.x * this.gridSize + 3,
                    segment.y * this.gridSize + 3,
                    this.gridSize - 6,
                    this.gridSize - 6
                );
            }
        });
        
        // Dibujar comida
        this.ctx.fillStyle = '#f56565';
        this.ctx.beginPath();
        this.ctx.arc(
            this.food.x * this.gridSize + this.gridSize / 2,
            this.food.y * this.gridSize + this.gridSize / 2,
            this.gridSize / 2 - 2,
            0,
            2 * Math.PI
        );
        this.ctx.fill();
        
        // Dibujar información del objetivo
        this.ctx.fillStyle = '#4a5568';
        this.ctx.font = '16px Fredoka';
        this.ctx.fillText(
            `Manzanas: ${this.snake.length}/${this.targetLength}`,
            10,
            25
        );
    }

    updateScore() {
        document.getElementById('snakeScore').textContent = this.score;
    }

    start() {
        console.log('🚀 Iniciando Snake - Game running:', this.gameRunning);
        this.gameLoop = setInterval(() => {
            this.update();
        }, 150);
        console.log('✅ Game loop iniciado');
    }

    pause() {
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
        }
        this.gameRunning = false;
        
        // Limpiar listener de retry si existe
        if (this.retryListener) {
            document.removeEventListener('keydown', this.retryListener, true);
            this.retryListener = null;
        }
        
        // Limpiar listener de teclas si existe
        if (this.keyListener) {
            document.removeEventListener('keydown', this.keyListener);
            this.keyListener = null;
        }
        
        // Limpiar listener de resize si existe
        if (this.resizeListener) {
            window.removeEventListener('resize', this.resizeListener);
            this.resizeListener = null;
        }
        
        // Limpiar botón de retry si existe
        const retryBtn = this.canvas.parentElement.querySelector('button');
        if (retryBtn) {
            retryBtn.remove();
        }
    }

    gameOver() {
        this.gameRunning = false;
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
        }
        
        // Mostrar mensaje de game over
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#f56565';
        this.ctx.font = 'bold 24px Fredoka One';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('¡Oh no!', this.canvas.width / 2, this.canvas.height / 2 - 20);
        
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '16px Fredoka';
        this.ctx.fillText('Presiona R para reintentar', this.canvas.width / 2, this.canvas.height / 2 + 20);
        
        // Agregar botón visual de reintentar
        this.addRetryButton();
        
        // Agregar listener para reintentar con mayor prioridad
        this.retryListener = (e) => {
            if (e.key === 'r' || e.key === 'R') {
                e.preventDefault();
                e.stopPropagation();
                
                // Solo procesar si no se está repitiendo la tecla
                if (e.repeat) return;
                
                document.removeEventListener('keydown', this.retryListener, true);
                this.retryListener = null;
                
                // Limpiar el overlay de game over
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                
                // Reiniciar el juego
                this.reset();
                this.start();
                
                console.log('🔄 Juego reiniciado desde tecla R');
            }
        };
        document.addEventListener('keydown', this.retryListener, true);
    }

    addRetryButton() {
        // Crear botón de reintentar
        const retryBtn = document.createElement('button');
        retryBtn.textContent = '🔄 Reintentar';
        retryBtn.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, 50%);
            background: linear-gradient(45deg, #667eea, #764ba2);
            color: white;
            border: none;
            padding: 1rem 2rem;
            border-radius: 25px;
            font-family: 'Fredoka', sans-serif;
            font-size: 1.2rem;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
            z-index: 1000;
        `;
        
        retryBtn.addEventListener('click', () => {
            retryBtn.remove();
            
            // Limpiar el overlay de game over
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Reiniciar el juego
            this.reset();
            this.start();
            
            console.log('🔄 Juego reiniciado desde botón');
        });
        
        retryBtn.addEventListener('mouseenter', () => {
            retryBtn.style.transform = 'translate(-50%, 50%) scale(1.05)';
        });
        
        retryBtn.addEventListener('mouseleave', () => {
            retryBtn.style.transform = 'translate(-50%, 50%) scale(1)';
        });
        
        // Posicionar el botón sobre el canvas
        this.canvas.parentElement.style.position = 'relative';
        this.canvas.parentElement.appendChild(retryBtn);
    }

    victory() {
        console.log('🏆 Función victory() llamada - Manzanas:', this.snake.length, 'Objetivo:', this.targetLength);
        
        this.gameRunning = false;
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
            console.log('🛑 Game loop detenido');
        }
        
        // Mostrar mensaje de victoria en el canvas
        this.ctx.fillStyle = 'rgba(72, 187, 120, 0.95)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 24px Fredoka One';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('¡Felicidades!', this.canvas.width / 2, this.canvas.height / 2 - 40);
        
        this.ctx.font = '16px Fredoka';
        this.ctx.fillText('Has alcanzado 5 manzanas', this.canvas.width / 2, this.canvas.height / 2 - 10);
        
        // Activar el botón "Continuar" que ya existe
        this.activateContinueButton();
        
        console.log('🏆 ¡Victoria en Snake! Puntuación:', this.score);
        
        // Completar el juego en el game manager inmediatamente
        if (window.gameManager) {
            console.log('🎮 Llamando a gameManager.completeGame()');
            window.gameManager.completeGame('snake', 0); // Solo puntos base, sin bonus
        } else {
            console.error('❌ gameManager no está disponible, esperando...');
            // Esperar un poco y volver a intentar
            setTimeout(() => {
                if (window.gameManager) {
                    console.log('🎮 GameManager encontrado en segundo intento');
                    window.gameManager.completeGame('snake', 0);
                } else {
                    console.error('❌ GameManager aún no disponible después de esperar');
                }
            }, 1000);
        }
    }
}

// Crear instancia global del juego
window.snakeGame = new SnakeGame();
