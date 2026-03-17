// App.js - Archivo principal de la aplicación GincanaLand
document.addEventListener('DOMContentLoaded', () => {
    console.log('🧩 GincanaLand iniciada');
    
    // Verificar que todos los juegos estén disponibles
    if (window.gameManager && window.snakeGame && window.pacmanGame && 
        window.wordSearchGame && window.tetrisGame) {
        console.log('✅ Todos los juegos cargados correctamente');
        
        // Configurar eventos globales
        setupGlobalEvents();
        
        // Mostrar estadísticas iniciales
        showWelcomeMessage();
    } else {
        console.error('❌ Error: No todos los juegos se cargaron correctamente');
    }
});

function setupGlobalEvents() {
    // Prevenir scroll con las flechas del teclado
    document.addEventListener('keydown', (e) => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
            e.preventDefault();
        }
    });
    
    // Agregar botón de reset para desarrollo (oculto)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        addResetButton();
    }
}

function addResetButton() {
    const resetBtn = document.createElement('button');
    resetBtn.textContent = '🔄 Reset';
    resetBtn.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        z-index: 1000;
        background: #f56565;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 10px;
        font-family: 'Fredoka', sans-serif;
        cursor: pointer;
        opacity: 0.7;
        transition: opacity 0.3s;
    `;
    
    resetBtn.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que quieres reiniciar todo el progreso?')) {
            window.gameManager.resetProgress();
            showWelcomeMessage();
        }
    });
    
    resetBtn.addEventListener('mouseenter', () => {
        resetBtn.style.opacity = '1';
    });
    
    resetBtn.addEventListener('mouseleave', () => {
        resetBtn.style.opacity = '0.7';
    });
    
    document.body.appendChild(resetBtn);
}

function showWelcomeMessage() {
    const stats = window.gameManager.getStats();
    
    if (stats.completedGames === 0) {
        // Primer juego
        showNotification('¡Bienvenido a GincanaLand! 🎉', 'Comienza con el juego Snake para ganar tu primera pegatina.');
    } else if (stats.completedGames === stats.totalGames) {
        // Todos los juegos completados
        showNotification('¡Felicidades! 🏆', 'Has completado todos los juegos de GincanaLand. ¡Eres un verdadero campeón!');
    } else {
        // Progreso parcial
        showNotification('¡Continúa tu aventura! ⭐', `Has completado ${stats.completedGames} de ${stats.totalGames} juegos.`);
    }
}

function showNotification(title, message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 255, 255, 0.95);
        padding: 2rem;
        border-radius: 20px;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        text-align: center;
        font-family: 'Fredoka', sans-serif;
        max-width: 400px;
        animation: slideIn 0.5s ease-out;
    `;
    
    notification.innerHTML = `
        <h3 style="font-family: 'Fredoka One', cursive; color: #4a5568; margin-bottom: 1rem;">${title}</h3>
        <p style="color: #666; margin-bottom: 1.5rem;">${message}</p>
        <button onclick="this.parentElement.remove()" style="
            background: linear-gradient(45deg, #667eea, #764ba2);
            color: white;
            border: none;
            padding: 0.5rem 1.5rem;
            border-radius: 15px;
            font-family: 'Fredoka', sans-serif;
            font-weight: 600;
            cursor: pointer;
        ">¡Entendido!</button>
    `;
    
    // Agregar animación CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { opacity: 0; transform: translate(-50%, -60%); }
            to { opacity: 1; transform: translate(-50%, -50%); }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Funciones de utilidad global
window.GincanaLand = {
    // Obtener estadísticas del juego
    getStats: () => window.gameManager.getStats(),
    
    // Reiniciar progreso
    resetProgress: () => {
        if (confirm('¿Estás seguro de que quieres reiniciar todo el progreso?')) {
            window.gameManager.resetProgress();
            showWelcomeMessage();
        }
    },
    
    // Mostrar ayuda
    showHelp: () => {
        showNotification('🎮 Controles de Juego', `
            <strong>Snake:</strong> Flechas para mover<br>
            <strong>Laberinto:</strong> Flechas para navegar<br>
            <strong>Sopa de Letras:</strong> Click y arrastrar<br>
            <strong>Tetris:</strong> Flechas + Espacio para bajar rápido
        `);
    },
    
    // Exportar progreso (para padres/educadores)
    exportProgress: () => {
        const stats = window.gameManager.getStats();
        const data = {
            fecha: new Date().toLocaleDateString(),
            estadisticas: stats,
            pegatinas: window.gameManager.stickers
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gincanland-progreso-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
};

// Agregar atajos de teclado para desarrollo
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case 'h':
                e.preventDefault();
                window.GincanaLand.showHelp();
                break;
            case 'r':
                e.preventDefault();
                window.GincanaLand.resetProgress();
                break;
            case 'e':
                e.preventDefault();
                window.GincanaLand.exportProgress();
                break;
        }
    }
});

console.log('🎯 GincanaLand lista para jugar!');
console.log('💡 Atajos: Ctrl+H (Ayuda), Ctrl+R (Reset), Ctrl+E (Exportar)');
