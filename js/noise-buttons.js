class NoiseButton extends PIXI.Application {
    constructor(options) {
        super({
            autoStart: false,
            autoResize: true,
            transparent: true
        });

        this.options = Object.assign({
            backgroundColor: "0xF25C1F",
            backgroundAlpha: 0.5,
            polygon: "30, 0, 30, 0",
            borderColor: "0xF25C1F",
            borderWidth: 0,
            displacementScale: { x: 0, y: 0 } // Desactivado el desplazamiento
        }, options);

        this.createCanvas();
    }

    async createCanvas() {
        this.options.element.classList.add("noise-container");
        this.view.classList.add("noise-canvas");
        this.options.element.appendChild(this.view);

        this.container = new PIXI.Container();
        this.stage.addChild(this.container);

        this.setSize();
        this.addGraphics();
        this.bindEvents();
        this.render();
        this.options.element.classList.add("canvas-ready");

        // Mantener solo el efecto de partículas
        this.setupParticles();
    }

    setSize() {
        const { width, height } = this.options.element.getBoundingClientRect();
        this.renderer.resize(width + 40, height + 40);
    }

    addGraphics() {
        this.graphics = new PIXI.Graphics();
        this.container.addChild(this.graphics);
        
        const [radiusX, radiusY] = this.options.polygon.split(",").map(n => parseInt(n));
        const width = this.renderer.width - 40;
        const height = this.renderer.height - 40;
        
        this.graphics.clear();
        
        if (this.options.backgroundColor) {
            this.graphics.beginFill(this.options.backgroundColor, this.options.backgroundAlpha);
        }
        
        if (this.options.borderWidth) {
            this.graphics.lineStyle(this.options.borderWidth, this.options.borderColor);
        }
        
        this.graphics.moveTo(radiusX, 0);
        this.graphics.lineTo(width - radiusX, 0);
        this.graphics.quadraticCurveTo(width, 0, width, radiusY);
        this.graphics.lineTo(width, height - radiusY);
        this.graphics.quadraticCurveTo(width, height, width - radiusX, height);
        this.graphics.lineTo(radiusX, height);
        this.graphics.quadraticCurveTo(0, height, 0, height - radiusY);
        this.graphics.lineTo(0, radiusY);
        this.graphics.quadraticCurveTo(0, 0, radiusX, 0);
        this.graphics.closePath();
        
        this.graphics.x = 20;
        this.graphics.y = 20;
    }

    bindEvents() {
        window.addEventListener("resize", () => {
            this.setSize();
            this.addGraphics();
            this.render();
        });
    }

    setupParticles() {
        const createSpark = (e) => {
            const spark = document.createElement('div');
            spark.className = 'spark';
            this.options.element.appendChild(spark);

            const rect = this.options.element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            spark.style.left = x + 'px';
            spark.style.top = y + 'px';

            const angle = Math.random() * Math.PI * 2;
            const velocity = 50 + Math.random() * 50;
            const sparkX = Math.cos(angle) * velocity;
            const sparkY = Math.sin(angle) * velocity;

            spark.style.setProperty('--spark-x', sparkX + 'px');
            spark.style.setProperty('--spark-y', sparkY + 'px');

            spark.addEventListener('animationend', () => {
                spark.remove();
            });

            spark.style.animation = 'spark-animation 0.8s ease-out forwards';
        };

        this.options.element.addEventListener('mousemove', (e) => {
            if (Math.random() < 0.3) {
                createSpark(e);
            }
        });
    }
}

// Inicialización de los botones
const setupNoiseButtons = () => {
    // Botón con borde
    new NoiseButton({
        element: document.querySelector(".noise_btn--border"),
        polygon: "30, 0, 30, 0",
        borderWidth: 2,
        borderColor: "0xF25C1F",
        backgroundAlpha: 0.05
    });

    // Botón con fondo
    new NoiseButton({
        element: document.querySelector(".noise_btn--bg"),
        polygon: "30, 0, 30, 0",
        backgroundColor: "0xF25C1F",
        backgroundAlpha: 1
    });

    // Botón neon
    new NoiseButton({
        element: document.querySelector(".noise_btn--neon"),
        polygon: "30, 0, 30, 0",
        borderWidth: 2,
        borderColor: "0xF25C1F",
        backgroundColor: "0x0F0F0F",
        backgroundAlpha: 0.9
    });

    // Botón glitch
    new NoiseButton({
        element: document.querySelector(".noise_btn--glitch"),
        polygon: "30, 0, 30, 0",
        borderWidth: 2,
        borderColor: "0xC0392B",
        backgroundColor: "0xC0392B",
        backgroundAlpha: 0.1
    });
}; 