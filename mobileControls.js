// Mobile Controls - Controles táctiles para dispositivos móviles
class MobileControls {
    constructor() {
        this.isMobile = this.detectMobile();
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.minSwipeDistance = 50;
    }

    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               window.innerWidth <= 768;
    }

    // Agregar controles táctiles a un canvas
    addTouchControls(canvas, gameInstance) {
        if (!this.isMobile) return;

        // Crear overlay de controles
        const controlsOverlay = document.createElement('div');
        controlsOverlay.className = 'mobile-controls-overlay';
        controlsOverlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 10;
        `;

        // Crear botones de control
        const controls = this.createControlButtons(gameInstance);
        controlsOverlay.appendChild(controls);

        // Posicionar el overlay sobre el canvas
        const container = canvas.parentElement;
        container.style.position = 'relative';
        container.appendChild(controlsOverlay);

        // Agregar eventos táctiles al canvas
        this.addTouchEvents(canvas, gameInstance);
    }

    createControlButtons(gameInstance) {
        const controlsContainer = document.createElement('div');
        controlsContainer.style.cssText = `
            position: absolute;
            bottom: 20px;
            right: 20px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            pointer-events: auto;
        `;

        // Botón de pausa
        const pauseBtn = this.createButton('⏸️', () => {
            if (gameInstance.pause) {
                gameInstance.pause();
            }
        });
        pauseBtn.style.cssText += `
            background: rgba(255, 255, 255, 0.9);
            color: #333;
            border: 2px solid #667eea;
        `;

        // Botón de reinicio
        const resetBtn = this.createButton('🔄', () => {
            if (gameInstance.reset) {
                gameInstance.reset();
            }
        });
        resetBtn.style.cssText += `
            background: rgba(255, 255, 255, 0.9);
            color: #333;
            border: 2px solid #f56565;
        `;

        controlsContainer.appendChild(pauseBtn);
        controlsContainer.appendChild(resetBtn);

        return controlsContainer;
    }

    createButton(text, onClick) {
        const button = document.createElement('button');
        button.textContent = text;
        button.style.cssText = `
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border: none;
            font-size: 20px;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
        `;

        button.addEventListener('click', onClick);
        button.addEventListener('touchstart', (e) => {
            e.preventDefault();
            button.style.transform = 'scale(0.95)';
        });
        button.addEventListener('touchend', (e) => {
            e.preventDefault();
            button.style.transform = 'scale(1)';
            onClick();
        });

        return button;
    }

    addTouchEvents(canvas, gameInstance) {
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            this.touchStartX = touch.clientX;
            this.touchStartY = touch.clientY;
        }, { passive: false });

        canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            const touch = e.changedTouches[0];
            const deltaX = touch.clientX - this.touchStartX;
            const deltaY = touch.clientY - this.touchStartY;

            // Determinar dirección del swipe
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                // Swipe horizontal
                if (Math.abs(deltaX) > this.minSwipeDistance) {
                    if (deltaX > 0) {
                        this.triggerKey(gameInstance, 'ArrowRight');
                    } else {
                        this.triggerKey(gameInstance, 'ArrowLeft');
                    }
                }
            } else {
                // Swipe vertical
                if (Math.abs(deltaY) > this.minSwipeDistance) {
                    if (deltaY > 0) {
                        this.triggerKey(gameInstance, 'ArrowDown');
                    } else {
                        this.triggerKey(gameInstance, 'ArrowUp');
                    }
                }
            }
        }, { passive: false });
    }

    triggerKey(gameInstance, key) {
        // Simular evento de teclado
        const event = new KeyboardEvent('keydown', {
            key: key,
            code: key,
            bubbles: true
        });
        
        // Llamar al manejador de teclas del juego
        if (gameInstance.keyListener) {
            gameInstance.keyListener(event);
        }
    }

    // Agregar controles direccionales para Snake
    addSnakeControls(canvas, snakeGame) {
        if (!this.isMobile) return;

        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'snake-mobile-controls';
        controlsContainer.style.cssText = `
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            grid-template-rows: 1fr 1fr 1fr;
            gap: 5px;
            pointer-events: auto;
            width: 150px;
            height: 150px;
        `;

        // Crear botones direccionales
        const buttons = [
            { text: '⬆️', key: 'ArrowUp', gridArea: '1 / 2 / 2 / 3' },
            { text: '⬅️', key: 'ArrowLeft', gridArea: '2 / 1 / 3 / 2' },
            { text: '⬇️', key: 'ArrowDown', gridArea: '2 / 3 / 3 / 4' },
            { text: '➡️', key: 'ArrowRight', gridArea: '3 / 2 / 4 / 3' }
        ];

        buttons.forEach(button => {
            const btn = this.createButton(button.text, () => {
                this.triggerKey(snakeGame, button.key);
            });
            btn.style.cssText += `
                grid-area: ${button.gridArea};
                background: rgba(255, 255, 255, 0.9);
                color: #333;
                border: 2px solid #48bb78;
                font-size: 24px;
            `;
            controlsContainer.appendChild(btn);
        });

        // Posicionar el contenedor
        const container = canvas.parentElement;
        container.style.position = 'relative';
        container.appendChild(controlsContainer);
    }

    addPacmanControls(canvas, pacmanGame) {
        if (!this.isMobile) return;

        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'pacman-mobile-controls';
        controlsContainer.style.cssText = `
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            grid-template-rows: 1fr 1fr 1fr;
            gap: 5px;
            pointer-events: auto;
            width: 150px;
            height: 150px;
        `;

        // Crear botones direccionales
        const buttons = [
            { text: '⬆️', key: 'ArrowUp', gridArea: '1 / 2 / 2 / 3' },
            { text: '⬅️', key: 'ArrowLeft', gridArea: '2 / 1 / 3 / 2' },
            { text: '⬇️', key: 'ArrowDown', gridArea: '2 / 3 / 3 / 4' },
            { text: '➡️', key: 'ArrowRight', gridArea: '3 / 2 / 4 / 3' }
        ];

        buttons.forEach(button => {
            const btn = this.createButton(button.text, () => {
                this.triggerKey(pacmanGame, button.key);
            });
            btn.style.gridArea = button.gridArea;
            controlsContainer.appendChild(btn);
        });

        canvas.parentElement.appendChild(controlsContainer);
    }
}

// Crear instancia global
window.mobileControls = new MobileControls();
