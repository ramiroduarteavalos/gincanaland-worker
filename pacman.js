// Pacman Game - Come todos los puntos para ganar
class PacmanGame {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.gridSize = 20;
        this.tileCount = 0;
        this.pacman = { x: 1, y: 1 };
        this.dots = [];
        this.totalDots = 0;
        this.dx = 0;
        this.dy = 0;
        this.score = 0;
        this.gameRunning = false;
        this.gameLoop = null;
        this.keyListener = null;
        this.resizeListener = null;
        this.timeLeft = 60; // 1 minuto
        this.gameStartTime = 0;
        this.mouthAngle = 0;
        this.mouthDirection = 1;
        this.targetPercentage = 30; // 30% mínimo
        this.pacmanDirection = 0; // 0: derecha, 1: abajo, 2: izquierda, 3: arriba
        this.ghosts = [];
        this.ghostSpeed = 0.1; // Velocidad lenta de los fantasmas (más lento que Pacman)
        this.maze = []; // Laberinto con tuberías
        this.mazeWidth = 0;
        this.mazeHeight = 0;
        this.objectiveReached = false; // Si ya se alcanzó el objetivo del 30%
        this.exitDoor = null; // Puerta de salida
    }

    init() {
        this.canvas = document.getElementById('pacmanCanvas');
        if (!this.canvas) {
            console.error('❌ No se encontró el canvas de Pacman');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) {
            console.error('❌ No se pudo obtener el contexto 2D del canvas');
            return;
        }
        
        console.log('🎮 Inicializando Pacman...');
        
        // Configurar canvas responsivo
        this.setupResponsiveCanvas();
        this.generateMaze();
        this.generateDots();
        this.generateGhosts();
        this.setupEventListeners();
        this.setupMobileControls();
        this.draw();
        
        // Forzar redimensionamiento después de que se renderice el DOM
        setTimeout(() => {
            this.setupResponsiveCanvas();
            this.generateMaze();
            this.generateDots();
            this.generateGhosts();
            this.draw();
        }, 100);
        
        setTimeout(() => {
            this.setupResponsiveCanvas();
            this.generateMaze();
            this.generateDots();
            this.generateGhosts();
            this.draw();
        }, 500);
        
        setTimeout(() => {
            this.setupResponsiveCanvas();
            this.generateMaze();
            this.generateDots();
            this.generateGhosts();
            this.draw();
        }, 1000);
        
        // Agregar botón de debug temporal
        this.addDebugButton();
        
        // Agregar botón "Continuar" gris (inactivo)
        this.addInactiveContinueButton();
        
        // Iniciar loop continuo para los fantasmas
        this.startGhostLoop();
        
        // Iniciar el juego
        this.start();
        
        // Forzar dibujado inicial
        setTimeout(() => {
            this.draw();
            console.log('🎨 Dibujado inicial forzado');
        }, 100);
        
        console.log('✅ Pacman inicializado correctamente');
    }

    startGhostLoop() {
        // Loop continuo para que los fantasmas se muevan siempre
        const ghostLoop = () => {
            try {
                if (this.ghosts && this.ghosts.length > 0) {
                    this.moveGhosts();
                }
                this.draw();
                requestAnimationFrame(ghostLoop);
            } catch (error) {
                console.error('❌ Error en ghostLoop:', error);
                // Continuar el loop incluso si hay un error
                requestAnimationFrame(ghostLoop);
            }
        };
        requestAnimationFrame(ghostLoop);
    }

    setupResponsiveCanvas() {
        const container = this.canvas.parentElement;
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        
        console.log('📏 Dimensiones del contenedor:', containerWidth, 'x', containerHeight);
        
        // Usar el tamaño real del contenedor (más agresivo)
        const availableWidth = containerWidth - 40; // Margen para padding
        const availableHeight = containerHeight - 40; // Margen para padding
        
        // Calcular tamaño del canvas (múltiplo de gridSize)
        const maxSize = Math.min(availableWidth, availableHeight);
        const canvasSize = Math.max(400, Math.floor(maxSize / this.gridSize) * this.gridSize);
        
        console.log('🎯 Tamaño calculado del canvas:', canvasSize);
        
        // Establecer dimensiones del canvas
        this.canvas.width = canvasSize;
        this.canvas.height = canvasSize;
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.maxWidth = '100%';
        this.canvas.style.maxHeight = '100%';
        
        // Calcular número de tiles
        this.tileCount = Math.floor(canvasSize / this.gridSize);
        
        console.log('🔢 Número de tiles:', this.tileCount);
        console.log('📐 Canvas final:', this.canvas.width, 'x', this.canvas.height);
    }

    setupEventListeners() {
        // Remover listener anterior si existe
        if (this.keyListener) {
            document.removeEventListener('keydown', this.keyListener);
        }
        
        this.keyListener = (e) => {
            if (!this.gameRunning && (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
                this.gameRunning = true;
                console.log('🎮 Juego activado desde flecha');
            }
            
            if (!this.gameRunning) return;
            
            e.preventDefault();
            e.stopPropagation();
            
            console.log('✔ Tecla presionada:', e.key, 'Game running:', this.gameRunning);
            
            switch(e.key) {
                case 'ArrowUp':
                    this.dx = 0;
                    this.dy = -1;
                    break;
                case 'ArrowDown':
                    this.dx = 0;
                    this.dy = 1;
                    break;
                case 'ArrowLeft':
                    this.dx = -1;
                    this.dy = 0;
                    break;
                case 'ArrowRight':
                    this.dx = 1;
                    this.dy = 0;
                    break;
            }
        };
        
        document.addEventListener('keydown', this.keyListener);
        
        // Listener para redimensionar
        this.resizeListener = () => {
            if (this.canvas && this.ctx) {
                this.setupResponsiveCanvas();
                this.generateDots();
                this.draw();
            }
        };
        window.addEventListener('resize', this.resizeListener);
        
        console.log('✅ Event listeners configurados para Pacman');
    }

    setupMobileControls() {
        if (window.mobileControls) {
            window.mobileControls.addPacmanControls(this.canvas, this);
            console.log('📱 Controles móviles configurados para Pacman');
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
            this.generateDots();
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
                window.gameManager.showVictoryScreen('pacman', 50, '👻🏆');
            } else {
                console.error('❌ gameManager no está disponible');
            }
        });
        
        document.body.appendChild(debugBtn);
        document.body.appendChild(victoryBtn);
        document.body.appendChild(testVictoryBtn);
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

    generateDots() {
        this.dots = [];
        this.totalDots = Math.floor(this.tileCount * this.tileCount * 0.3); // 30% del tablero
        
        for (let i = 0; i < this.totalDots; i++) {
            let x, y;
            do {
                x = Math.floor(Math.random() * this.tileCount);
                y = Math.floor(Math.random() * this.tileCount);
            } while (
                (x === this.pacman.x && y === this.pacman.y) || // No en la posición del pacman
                this.dots.some(dot => dot.x === x && dot.y === y) || // No duplicados
                (this.maze[y] && this.maze[y][x] === 1) // No en paredes
            );
            
            this.dots.push({ x, y });
        }
        
        console.log('🍎 Puntos generados:', this.dots.length, 'de', this.totalDots, 'total');
    }

    generateMaze() {
        this.mazeWidth = this.tileCount;
        this.mazeHeight = this.tileCount;
        this.maze = [];
        
        // Inicializar laberinto vacío (sin tuberías)
        for (let y = 0; y < this.mazeHeight; y++) {
            this.maze[y] = [];
            for (let x = 0; x < this.mazeWidth; x++) {
                this.maze[y][x] = 0; // 0 = camino libre, sin paredes
            }
        }
        
        console.log('🏗️ Laberinto simple generado:', this.mazeWidth, 'x', this.mazeHeight, '(sin tuberías)');
    }

    generateGhosts() {
        this.ghosts = [];
        const numGhosts = 15; // 15 fantasmas para más desafío
        
        // Colores para los fantasmas
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', 
                       '#00ffff', '#ff8800', '#8800ff', '#00ff88', '#ff0088',
                       '#ff4444', '#44ff44', '#4444ff', '#ffff44', '#ff44ff'];
        
        // Rutas predefinidas para los fantasmas
        const routes = [
            { type: 'horizontal', startY: 3, direction: 1 }, // Ruta horizontal superior
            { type: 'horizontal', startY: 7, direction: -1 }, // Ruta horizontal media
            { type: 'horizontal', startY: 11, direction: 1 }, // Ruta horizontal inferior
            { type: 'vertical', startX: 6, direction: 1 }, // Ruta vertical izquierda
            { type: 'vertical', startX: 12, direction: -1 }, // Ruta vertical derecha
            { type: 'circular', centerX: 9, centerY: 7, radius: 3 }, // Ruta circular
            { type: 'diagonal', startX: 2, startY: 2, direction: 1 }, // Ruta diagonal
            { type: 'patrol', area: { x1: 3, y1: 3, x2: 8, y2: 8 } }, // Patrulla área específica
            { type: 'chase', target: 'pacman' }, // Persigue al Pacman
            { type: 'random' } // Movimiento aleatorio
        ];
        
        for (let i = 0; i < numGhosts; i++) {
            let x, y;
            const route = routes[i % routes.length];
            
            // Posicionar según el tipo de ruta
            switch(route.type) {
                case 'horizontal':
                    x = Math.floor(Math.random() * (this.tileCount - 2)) + 1;
                    y = route.startY;
                    break;
                case 'vertical':
                    x = route.startX;
                    y = Math.floor(Math.random() * (this.tileCount - 2)) + 1;
                    break;
                case 'circular':
                    x = route.centerX;
                    y = route.centerY;
                    break;
                case 'diagonal':
                    x = route.startX;
                    y = route.startY;
                    break;
                case 'patrol':
                    x = Math.floor(Math.random() * (route.area.x2 - route.area.x1)) + route.area.x1;
                    y = Math.floor(Math.random() * (route.area.y2 - route.area.y1)) + route.area.y1;
                    break;
                default:
                    x = Math.floor(Math.random() * (this.tileCount - 2)) + 1;
                    y = Math.floor(Math.random() * (this.tileCount - 2)) + 1;
            }
            
            // Verificar que no esté en pared o en posición del Pacman
            if (this.maze[y] && this.maze[y][x] === 1) {
                // Buscar posición alternativa
                do {
                    x = Math.floor(Math.random() * (this.tileCount - 2)) + 1;
                    y = Math.floor(Math.random() * (this.tileCount - 2)) + 1;
                } while (this.maze[y] && this.maze[y][x] === 1);
            }
            
            this.ghosts.push({
                x: x,
                y: y,
                targetX: this.pacman.x,
                targetY: this.pacman.y,
                color: colors[i % colors.length],
                behavior: route.type,
                direction: Math.floor(Math.random() * 4),
                lastMoveTime: 0,
                route: route,
                routeProgress: 0,
                speed: this.ghostSpeed // Todos los fantasmas tienen la misma velocidad
            });
        }
        
        console.log('👻 Fantasmas generados:', this.ghosts.length, 'con rutas específicas');
    }

    showObjectiveReached() {
        console.log('🎯 ¡Objetivo alcanzado! Puedes seguir jugando o usar la puerta de salida');
        
        // Crear puerta de salida en una esquina
        this.exitDoor = {
            x: this.tileCount - 2,
            y: this.tileCount - 2,
            active: true
        };
        
        // Mostrar mensaje temporal
        setTimeout(() => {
            console.log('🚪 Puerta de salida activada en la esquina inferior derecha');
        }, 1000);
    }

    updateExternalStats() {
        const percentage = Math.floor(((this.totalDots - this.dots.length) / this.totalDots) * 100);
        
        // Actualizar elementos del DOM
        const scoreElement = document.getElementById('pacmanGameScore');
        const remainingElement = document.getElementById('pacmanRemainingDots');
        const progressElement = document.getElementById('pacmanProgress');
        
        if (scoreElement) scoreElement.textContent = this.score;
        if (remainingElement) remainingElement.textContent = this.dots.length;
        if (progressElement) progressElement.textContent = `${percentage}%/${this.targetPercentage}%`;
    }

    start() {
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
        }
        
        this.gameRunning = true;
        this.score = 0; // Reiniciar puntuación
        this.objectiveReached = false; // Resetear objetivo
        this.exitDoor = null; // Resetear puerta de salida
        this.generateMaze(); // Generar laberinto
        this.generateGhosts(); // Generar fantasmas
        
        this.gameLoop = setInterval(() => {
            this.update();
        }, 150); // Velocidad del juego
        
        console.log('🎮 Pacman iniciado - Tiempo:', this.timeLeft, 'segundos');
    }

    update() {
        // Los fantasmas siempre se mueven, independientemente del estado del juego
        this.moveGhosts();
        
        if (!this.gameRunning) {
            // Solo dibujar si el juego no está corriendo
            this.draw();
            return;
        }
        
        // Actualizar animación de la boca
        this.mouthAngle += this.mouthDirection * 0.1;
        if (this.mouthAngle >= 0.5 || this.mouthAngle <= 0) {
            this.mouthDirection *= -1;
        }
        
        // Actualizar dirección de la boca basada en el movimiento
        if (this.dx > 0) this.pacmanDirection = 0; // Derecha
        else if (this.dy > 0) this.pacmanDirection = 1; // Abajo
        else if (this.dx < 0) this.pacmanDirection = 2; // Izquierda
        else if (this.dy < 0) this.pacmanDirection = 3; // Arriba
        
        // Mover pacman (verificar colisiones con paredes)
        const newPacmanX = this.pacman.x + this.dx;
        const newPacmanY = this.pacman.y + this.dy;
        
        // Verificar límites del tablero
        if (newPacmanX < 0 || newPacmanX >= this.tileCount || 
            newPacmanY < 0 || newPacmanY >= this.tileCount) {
            // Teletransporte en los bordes
            if (newPacmanX < 0) this.pacman.x = this.tileCount - 1;
            else if (newPacmanX >= this.tileCount) this.pacman.x = 0;
            if (newPacmanY < 0) this.pacman.y = this.tileCount - 1;
            else if (newPacmanY >= this.tileCount) this.pacman.y = 0;
        } else {
            // Verificar colisión con paredes
            if (!this.maze[newPacmanY] || this.maze[newPacmanY][newPacmanX] !== 1) {
                this.pacman.x = newPacmanX;
                this.pacman.y = newPacmanY;
            }
        }
        
        // Verificar colisión con fantasmas
        const collision = this.ghosts.some(ghost => 
            Math.floor(ghost.x) === this.pacman.x && Math.floor(ghost.y) === this.pacman.y
        );
        
        if (collision) {
            this.gameOverByGhost();
            return;
        }
        
        // Verificar si tocó la puerta de salida
        if (this.exitDoor && this.exitDoor.active && 
            this.pacman.x === this.exitDoor.x && this.pacman.y === this.exitDoor.y) {
            this.victory();
            return;
        }
        
        // Verificar si comió un punto
        const dotIndex = this.dots.findIndex(dot => dot.x === this.pacman.x && dot.y === this.pacman.y);
        if (dotIndex !== -1) {
            this.dots.splice(dotIndex, 1);
            this.score += 10;
            this.updateScore();
            
            const percentage = Math.floor(((this.totalDots - this.dots.length) / this.totalDots) * 100);
            console.log('🍎 Punto comido! Puntos restantes:', this.dots.length, 'Puntuación:', this.score, 'Porcentaje:', percentage + '%');
            
            // Verificar si alcanzó el objetivo mínimo (30%) - solo mostrar mensaje
            if (percentage >= this.targetPercentage && !this.objectiveReached) {
                this.showObjectiveReached();
                this.objectiveReached = true;
            }
        }
        
        this.draw();
    }

    moveGhosts() {
        // Verificar que los fantasmas existan
        if (!this.ghosts || this.ghosts.length === 0) {
            return;
        }
        
        // Mover fantasmas con rutas específicas
        this.ghosts.forEach(ghost => {
            const currentTime = Date.now();
            
            // Actualizar objetivo según el comportamiento
            switch(ghost.behavior) {
                case 'horizontal':
                    // Moverse horizontalmente en su fila
                    ghost.targetX = ghost.x + ghost.route.direction * 0.1;
                    ghost.targetY = ghost.route.startY;
                    
                    // Cambiar dirección al llegar a los bordes
                    if (ghost.x <= 1) ghost.route.direction = 1;
                    if (ghost.x >= this.tileCount - 2) ghost.route.direction = -1;
                    break;
                    
                case 'vertical':
                    // Moverse verticalmente en su columna
                    ghost.targetX = ghost.route.startX;
                    ghost.targetY = ghost.y + ghost.route.direction * 0.1;
                    
                    // Cambiar dirección al llegar a los bordes
                    if (ghost.y <= 1) ghost.route.direction = 1;
                    if (ghost.y >= this.tileCount - 2) ghost.route.direction = -1;
                    break;
                    
                case 'circular':
                    // Movimiento circular
                    ghost.routeProgress += 0.05;
                    const angle = ghost.routeProgress;
                    ghost.targetX = ghost.route.centerX + Math.cos(angle) * ghost.route.radius;
                    ghost.targetY = ghost.route.centerY + Math.sin(angle) * ghost.route.radius;
                    break;
                    
                case 'diagonal':
                    // Movimiento diagonal
                    ghost.targetX = ghost.x + ghost.route.direction * 0.1;
                    ghost.targetY = ghost.y + ghost.route.direction * 0.1;
                    
                    // Rebotar en los bordes
                    if (ghost.x <= 1 || ghost.x >= this.tileCount - 2) ghost.route.direction *= -1;
                    if (ghost.y <= 1 || ghost.y >= this.tileCount - 2) ghost.route.direction *= -1;
                    break;
                    
                case 'patrol':
                    // Patrullar área específica con velocidad uniforme
                    if (currentTime - ghost.lastMoveTime > 1000) {
                        ghost.direction = Math.floor(Math.random() * 4);
                        ghost.lastMoveTime = currentTime;
                    }
                    
                    switch(ghost.direction) {
                        case 0: ghost.targetX = ghost.x + 0.1; ghost.targetY = ghost.y; break;
                        case 1: ghost.targetX = ghost.x; ghost.targetY = ghost.y + 0.1; break;
                        case 2: ghost.targetX = ghost.x - 0.1; ghost.targetY = ghost.y; break;
                        case 3: ghost.targetX = ghost.x; ghost.targetY = ghost.y - 0.1; break;
                    }
                    
                    // Mantener dentro del área de patrulla
                    if (ghost.x < ghost.route.area.x1) ghost.x = ghost.route.area.x1;
                    if (ghost.x > ghost.route.area.x2) ghost.x = ghost.route.area.x2;
                    if (ghost.y < ghost.route.area.y1) ghost.y = ghost.route.area.y1;
                    if (ghost.y > ghost.route.area.y2) ghost.y = ghost.route.area.y2;
                    break;
                    
                case 'chase':
                    // Perseguir al Pacman
                    ghost.targetX = this.pacman.x;
                    ghost.targetY = this.pacman.y;
                    break;
                    
                case 'random':
                    // Movimiento aleatorio con velocidad uniforme
                    if (currentTime - ghost.lastMoveTime > 1500) {
                        ghost.direction = Math.floor(Math.random() * 4);
                        ghost.lastMoveTime = currentTime;
                    }
                    
                    switch(ghost.direction) {
                        case 0: ghost.targetX = ghost.x + 0.1; ghost.targetY = ghost.y; break;
                        case 1: ghost.targetX = ghost.x; ghost.targetY = ghost.y + 0.1; break;
                        case 2: ghost.targetX = ghost.x - 0.1; ghost.targetY = ghost.y; break;
                        case 3: ghost.targetX = ghost.x; ghost.targetY = ghost.y - 0.1; break;
                    }
                    break;
            }
            
            // Calcular movimiento hacia el objetivo
            const dx = ghost.targetX - ghost.x;
            const dy = ghost.targetY - ghost.y;
            
            let newGhostX = ghost.x;
            let newGhostY = ghost.y;
            
            if (Math.abs(dx) > Math.abs(dy)) {
                if (dx > 0) newGhostX += ghost.speed;
                else if (dx < 0) newGhostX -= ghost.speed;
            } else {
                if (dy > 0) newGhostY += ghost.speed;
                else if (dy < 0) newGhostY -= ghost.speed;
            }
            
            // Verificar colisiones con paredes para fantasmas
            const ghostTileX = Math.floor(newGhostX);
            const ghostTileY = Math.floor(newGhostY);
            
            if (ghostTileX >= 0 && ghostTileX < this.tileCount && 
                ghostTileY >= 0 && ghostTileY < this.tileCount &&
                (!this.maze[ghostTileY] || this.maze[ghostTileY][ghostTileX] !== 1)) {
                ghost.x = newGhostX;
                ghost.y = newGhostY;
            }
            
            // Verificar límites del tablero para fantasmas
            if (ghost.x < 0) ghost.x = this.tileCount - 1;
            if (ghost.x >= this.tileCount) ghost.x = 0;
            if (ghost.y < 0) ghost.y = this.tileCount - 1;
            if (ghost.y >= this.tileCount) ghost.y = 0;
        });
    }

    draw() {
        if (!this.ctx || !this.canvas) {
            console.error('❌ No se puede dibujar: canvas o contexto no disponible');
            return;
        }
        
        try {
        
        console.log('🎨 Dibujando Pacman - Canvas:', this.canvas.width, 'x', this.canvas.height, 'Puntos:', this.dots.length, 'Pacman:', this.pacman.x, this.pacman.y);
        
        // Limpiar canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Dibujar fondo
        this.ctx.fillStyle = '#1a202c';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Dibujar laberinto (tuberías)
        this.ctx.fillStyle = '#4a5568';
        for (let y = 0; y < this.mazeHeight; y++) {
            for (let x = 0; x < this.mazeWidth; x++) {
                if (this.maze[y] && this.maze[y][x] === 1) {
                    const rectX = x * this.gridSize;
                    const rectY = y * this.gridSize;
                    this.ctx.fillRect(rectX, rectY, this.gridSize, this.gridSize);
                }
            }
        }
        
        // Dibujar puntos
        this.ctx.fillStyle = '#fbbf24';
        this.dots.forEach(dot => {
            const x = dot.x * this.gridSize + this.gridSize / 2;
            const y = dot.y * this.gridSize + this.gridSize / 2;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 3, 0, 2 * Math.PI);
            this.ctx.fill();
        });
        
        // Dibujar fantasmas
        this.ghosts.forEach(ghost => {
            const ghostX = ghost.x * this.gridSize + this.gridSize / 2;
            const ghostY = ghost.y * this.gridSize + this.gridSize / 2;
            const ghostRadius = this.gridSize / 2 - 2;
            
            this.ctx.fillStyle = ghost.color;
            this.ctx.beginPath();
            this.ctx.arc(ghostX, ghostY, ghostRadius, 0, 2 * Math.PI);
            this.ctx.fill();
            
            // Dibujar ojos del fantasma
            this.ctx.fillStyle = '#fff';
            this.ctx.beginPath();
            this.ctx.arc(ghostX - 3, ghostY - 3, 2, 0, 2 * Math.PI);
            this.ctx.arc(ghostX + 3, ghostY - 3, 2, 0, 2 * Math.PI);
            this.ctx.fill();
            
            // Pupilas
            this.ctx.fillStyle = '#000';
            this.ctx.beginPath();
            this.ctx.arc(ghostX - 3, ghostY - 3, 1, 0, 2 * Math.PI);
            this.ctx.arc(ghostX + 3, ghostY - 3, 1, 0, 2 * Math.PI);
            this.ctx.fill();
        });
        
        // Dibujar pacman con animación de boca direccional
        const pacmanX = this.pacman.x * this.gridSize + this.gridSize / 2;
        const pacmanY = this.pacman.y * this.gridSize + this.gridSize / 2;
        const pacmanRadius = this.gridSize / 2 - 2;
        
        this.ctx.fillStyle = '#fbbf24';
        this.ctx.beginPath();
        
        // Calcular ángulos de la boca basados en la dirección
        let startAngle, endAngle;
        const mouthSize = this.mouthAngle;
        
        switch(this.pacmanDirection) {
            case 0: // Derecha
                startAngle = mouthSize;
                endAngle = 2 * Math.PI - mouthSize;
                break;
            case 1: // Abajo
                startAngle = Math.PI/2 + mouthSize;
                endAngle = Math.PI/2 - mouthSize;
                break;
            case 2: // Izquierda
                startAngle = Math.PI + mouthSize;
                endAngle = Math.PI - mouthSize;
                break;
            case 3: // Arriba
                startAngle = 3*Math.PI/2 + mouthSize;
                endAngle = 3*Math.PI/2 - mouthSize;
                break;
            default:
                startAngle = mouthSize;
                endAngle = 2 * Math.PI - mouthSize;
        }
        
        this.ctx.arc(pacmanX, pacmanY, pacmanRadius, startAngle, endAngle);
        this.ctx.lineTo(pacmanX, pacmanY);
        this.ctx.fill();
        
        // Dibujar puerta de salida si está activa
        if (this.exitDoor && this.exitDoor.active) {
            const doorX = this.exitDoor.x * this.gridSize + this.gridSize / 2;
            const doorY = this.exitDoor.y * this.gridSize + this.gridSize / 2;
            const doorSize = this.gridSize - 4;
            
            // Dibujar puerta con animación
            this.ctx.fillStyle = '#48bb78';
            this.ctx.fillRect(doorX - doorSize/2, doorY - doorSize/2, doorSize, doorSize);
            
            // Dibujar símbolo de puerta
            this.ctx.fillStyle = '#fff';
            this.ctx.font = 'bold 16px Fredoka One';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('🚪', doorX, doorY + 5);
        }
        
        // Actualizar contadores externos
        this.updateExternalStats();
        
        // Barra de progreso
        const progressBarWidth = 200;
        const progressBarHeight = 10;
        const progressBarX = this.canvas.width - progressBarWidth - 10;
        const progressBarY = 20;
        
        // Calcular porcentaje
        const percentage = Math.floor(((this.totalDots - this.dots.length) / this.totalDots) * 100);
        
        // Fondo de la barra
        this.ctx.fillStyle = '#4a5568';
        this.ctx.fillRect(progressBarX, progressBarY, progressBarWidth, progressBarHeight);
        
        // Progreso actual
        const progress = Math.min(percentage / this.targetPercentage, 1);
        this.ctx.fillStyle = percentage >= this.targetPercentage ? '#48bb78' : '#fbbf24';
        this.ctx.fillRect(progressBarX, progressBarY, progressBarWidth * progress, progressBarHeight);
        
        } catch (error) {
            console.error('❌ Error en draw():', error);
        }
    }

    updateScore() {
        const scoreElement = document.getElementById('pacmanScore');
        if (scoreElement) {
            scoreElement.textContent = this.score;
        }
        // También actualizar el contador externo
        this.updateExternalStats();
    }

    pause() {
        this.gameRunning = false;
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
        }
        
        if (this.keyListener) {
            document.removeEventListener('keydown', this.keyListener);
        }
        
        if (this.resizeListener) {
            window.removeEventListener('resize', this.resizeListener);
        }
    }


    gameOverByGhost() {
        console.log('👻 ¡Atrapado por un fantasma!');
        
        this.gameRunning = false;
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
        }
        
        const percentage = Math.floor(((this.totalDots - this.dots.length) / this.totalDots) * 100);
        
        // Mostrar mensaje de game over por fantasma
        this.ctx.fillStyle = 'rgba(239, 68, 68, 0.95)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 24px Fredoka One';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('¡Atrapado!', this.canvas.width / 2, this.canvas.height / 2 - 40);
        
        this.ctx.font = '16px Fredoka';
        this.ctx.fillText('Un fantasma te atrapó', this.canvas.width / 2, this.canvas.height / 2 - 10);
        this.ctx.fillText(`Recolectaste: ${percentage}%`, this.canvas.width / 2, this.canvas.height / 2 + 10);
        
        // Agregar botón "Reintentar"
        this.addRetryButton();
    }

    addRetryButton() {
        // Remover botón anterior si existe
        const existingBtn = this.canvas.parentElement.querySelector('.retry-btn');
        if (existingBtn) {
            existingBtn.remove();
        }
        
        const retryBtn = document.createElement('button');
        retryBtn.textContent = '🔄 Reintentar';
        retryBtn.className = 'retry-btn';
        retryBtn.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, 50%);
            background: linear-gradient(45deg, #ef4444, #dc2626);
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
        
        retryBtn.addEventListener('click', () => {
            console.log('🔄 Reintentando juego...');
            retryBtn.remove();
            
            // Reiniciar el juego
            this.reset();
            this.start();
        });
        
        retryBtn.addEventListener('mouseenter', () => {
            retryBtn.style.transform = 'translate(-50%, 50%) scale(1.05)';
            retryBtn.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.3)';
        });
        
        retryBtn.addEventListener('mouseleave', () => {
            retryBtn.style.transform = 'translate(-50%, 50%) scale(1)';
            retryBtn.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
        });
        
        // Posicionar el botón sobre el canvas
        this.canvas.parentElement.style.position = 'relative';
        this.canvas.parentElement.appendChild(retryBtn);
    }

    reset() {
        this.pacman = { x: 1, y: 1 };
        this.dx = 0;
        this.dy = 0;
        this.score = 0;
        this.mouthAngle = 0;
        this.mouthDirection = 1;
        this.pacmanDirection = 0;
        this.objectiveReached = false;
        this.exitDoor = null;
        this.generateMaze();
        this.generateDots();
        this.generateGhosts();
        this.draw();
    }

    victory() {
        console.log('🏆 Función victory() llamada - Puntos restantes:', this.dots.length);
        
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
        const percentage = Math.floor(((this.totalDots - this.dots.length) / this.totalDots) * 100);
        this.ctx.fillText(`¡Recolectaste ${percentage}% de los puntos!`, this.canvas.width / 2, this.canvas.height / 2 - 10);
        
        // Activar el botón "Continuar" que ya existe
        this.activateContinueButton();
        
        console.log('🏆 ¡Victoria en Pacman! Puntuación:', this.score);
        
        // Completar el juego en el game manager inmediatamente
        if (window.gameManager) {
            console.log('🎮 Llamando a gameManager.completeGame() con puntuación:', this.score);
            window.gameManager.completeGame('pacman', this.score); // Pasar la puntuación real
        } else {
            console.error('❌ gameManager no está disponible, esperando...');
            // Esperar un poco y volver a intentar
            setTimeout(() => {
                if (window.gameManager) {
                    console.log('🎮 GameManager encontrado en segundo intento');
                    window.gameManager.completeGame('pacman', this.score);
                } else {
                    console.error('❌ GameManager aún no disponible después de esperar');
                }
            }, 1000);
        }
    }
}

// Crear instancia global del juego
window.pacmanGame = new PacmanGame();
