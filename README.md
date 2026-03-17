# 🧩 GincanaLand

Un juego web educativo para niños y niñas de 6 a 8 años que combina diversión y aprendizaje a través de una serie de desafíos encadenados.

## 🎯 Descripción

GincanaLand es una aplicación web que presenta cuatro minijuegos progresivos:
- **🐍 Snake**: Alcanza longitud 5 sin chocar
- **🧭 Laberinto**: Llega a la meta verde usando las flechas
- **🔠 Sopa de Letras**: Encuentra palabras de diferentes temas
- **🧱 Tetris**: Limpia 3 filas completas

Cada nivel superado desbloquea el siguiente, suma puntos y otorga pegatinas virtuales coleccionables.

## 🚀 Características

- **Progresión lineal**: Cada juego debe completarse para desbloquear el siguiente
- **Sistema de recompensas**: Pegatinas virtuales por cada juego completado
- **Guardado automático**: El progreso se guarda localmente en el navegador
- **Interfaz amigable**: Diseño colorido y fácil de usar para niños
- **Sin datos personales**: Autenticación anónima, no se recopilan datos

## 🎮 Cómo Jugar

1. **Abre `index.html`** en tu navegador web
2. **Comienza con Snake** (el único juego desbloqueado inicialmente)
3. **Completa cada objetivo** para desbloquear el siguiente juego
4. **Colecciona pegatinas** por cada victoria
5. **Disfruta** de la progresión y los logros

## 🎯 Objetivos de Cada Juego

### 🐍 Snake
- **Objetivo**: Alcanzar longitud 5 sin chocar
- **Puntos**: +20 puntos base
- **Premio**: 🏆 Pegatina "snake-crown"
- **Controles**: Flechas del teclado

### 🧭 Laberinto
- **Objetivo**: Llegar a la meta verde
- **Puntos**: +30 puntos base + bonus por velocidad
- **Premio**: 🥇 Pegatina "maze-medal"
- **Controles**: Flechas del teclado

### 🔠 Sopa de Letras
- **Objetivo**: Encontrar todas las palabras del tema
- **Puntos**: +5 por palabra + bonus aleatorio
- **Premio**: 🏅 Pegatina "word-star"
- **Temas**: Naturaleza, Animales, Frutas
- **Controles**: Click y arrastrar para seleccionar

### 🧱 Tetris
- **Objetivo**: Limpiar 3 filas completas
- **Puntos**: +50 puntos base
- **Premio**: ⭐ Pegatina "tetris-star"
- **Controles**: Flechas + Espacio para bajar rápido

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Diseño responsivo con gradientes y animaciones
- **JavaScript ES6+**: Lógica de juegos y gestión de estado
- **Canvas API**: Para Snake y Tetris
- **LocalStorage**: Persistencia de datos
- **Google Fonts**: Tipografía amigable (Fredoka)

## 📁 Estructura del Proyecto

```
GincanaLand/
├── index.html          # Página principal
├── styles.css          # Estilos y diseño
├── app.js             # Aplicación principal
├── gameManager.js     # Sistema de gestión de juegos
├── snake.js           # Juego Snake
├── maze.js            # Juego de Laberinto
├── wordsearch.js      # Sopa de Letras
├── tetris.js          # Mini Tetris
└── README.md          # Documentación
```

## 🎨 Diseño

- **Colores vibrantes**: Gradientes y colores llamativos para niños
- **Tipografía**: Fredoka (amigable y legible)
- **Animaciones**: Transiciones suaves y efectos visuales
- **Responsive**: Funciona en diferentes tamaños de pantalla
- **Accesibilidad**: Controles simples y feedback visual claro

## 🔧 Funciones de Desarrollo

Para desarrolladores y educadores, la aplicación incluye:

- **Atajos de teclado**:
  - `Ctrl+H`: Mostrar ayuda
  - `Ctrl+R`: Reiniciar progreso
  - `Ctrl+E`: Exportar progreso
- **Botón de reset** (solo en localhost)
- **Consola de estadísticas**: `SuperGincana.getStats()`

## 🌱 Ideas Futuras

- Nuevos minijuegos (memoria, cálculo, rompecabezas)
- Modo cooperativo para dos jugadores
- Avatares personalizables
- Panel educativo para padres/educadores
- Modo sin conexión con Service Worker
- Más temas para la sopa de letras

## 🎓 Objetivos Educativos

- **Pensamiento lógico**: Resolución de problemas en cada juego
- **Coordinación ojo-mano**: Control preciso en Snake y Tetris
- **Vocabulario**: Expansión del vocabulario en la sopa de letras
- **Persistencia**: Completar objetivos para avanzar
- **Motivación**: Sistema de recompensas y logros

## 📱 Compatibilidad

- **Navegadores**: Chrome, Firefox, Safari, Edge (versiones modernas)
- **Dispositivos**: Escritorio, tablet, móvil
- **Sistemas**: Windows, macOS, Linux, iOS, Android

## 🚀 Instalación y Uso

1. Descarga o clona el proyecto
2. Abre `index.html` en cualquier navegador moderno
3. ¡Comienza a jugar!

No requiere instalación de dependencias ni servidor web.

---

**¡Disfruta jugando GincanaLand! 🎉**
