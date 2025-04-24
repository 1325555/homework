class Wave {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.waves = [];
        this.offset = 0;
        
        this.waveColors = [
            'rgba(255, 87, 34, 0.6)',
            'rgba(33, 150, 243, 0.6)',
            'rgba(76, 175, 80, 0.6)',
            'rgba(156, 39, 176, 0.6)',
            'rgba(233, 30, 99, 0.6)'
        ];

        this.waveParams = this.waveColors.map((color, index) => ({
            amplitude: 30 + index * 10,
            frequency: 0.02 - index * 0.002,
            speed: 1 + index * 0.5,
            lineWidth: 0.5,
            color: color
        }));

        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.animate();
    }

    resize() {
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = window.innerWidth * dpr;
        this.canvas.height = window.innerHeight * dpr;
        this.canvas.style.width = `${window.innerWidth}px`;
        this.canvas.style.height = `${window.innerHeight}px`;
        this.ctx.scale(dpr, dpr);
    }

    drawWave(params, offset) {
        const { amplitude, frequency, color, lineWidth } = params;
        
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;

        for (let x = 0; x <= this.canvas.width; x++) {
            const y = this.canvas.height / 2 + 
                     amplitude * Math.sin(frequency * x + offset) +
                     amplitude * 0.5 * Math.sin(frequency * 2 * x + offset * 1.5);
            
            if (x === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        
        this.ctx.stroke();
    }

    animate() {
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.waveParams.forEach((params, index) => {
            this.drawWave(params, this.offset * params.speed);
        });

        this.offset += 0.02;
        requestAnimationFrame(() => this.animate());
    }

    setAmplitude(index, value) {
        if (index >= 0 && index < this.waveParams.length) {
            this.waveParams[index].amplitude = value;
        }
    }

    setSpeed(index, value) {
        if (index >= 0 && index < this.waveParams.length) {
            this.waveParams[index].speed = value;
        }
    }

    setLineWidth(index, value) {
        if (index >= 0 && index < this.waveParams.length) {
            this.waveParams[index].lineWidth = value;
        }
    }
}