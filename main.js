document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('waveCanvas');
    const wave = new Wave(canvas);
    const statusElement = document.getElementById('status');
    let port = null;
    let reader = null;

    async function connectArduino() {
        try {
            port = await navigator.serial.requestPort();
            await port.open({ baudRate: 9600 });
            statusElement.textContent = '已連接';
            document.getElementById('connectButton').disabled = true;

            reader = port.readable.getReader();
            const textDecoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                buffer += textDecoder.decode(value);
                const lines = buffer.split('\n');
                buffer = lines.pop();

                for (const line of lines) {
                    const [waveIndex, paramType, value] = line.trim().split(',').map(Number);
                    
                    if (!isNaN(waveIndex) && !isNaN(paramType) && !isNaN(value)) {
                        updateActiveControl(waveIndex, paramType);
                        
                        const normalizedValue = value / 1023;
                        switch(paramType) {
                            case 0:
                                wave.setAmplitude(waveIndex, 10 + normalizedValue * 90);
                                break;
                            case 1:
                                wave.setSpeed(waveIndex, 0.5 + normalizedValue * 2.5);
                                break;
                            case 2:
                                wave.setLineWidth(waveIndex, 0.1 + normalizedValue * 1.9);
                                break;
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Arduino連接錯誤:', error);
            statusElement.textContent = '連接失敗';
            document.getElementById('connectButton').disabled = false;
        }
    }

    function updateActiveControl(waveIndex, paramType) {
        document.querySelectorAll('.wave-control').forEach(el => {
            el.classList.remove('active');
        });
        
        const activeWave = document.querySelector(`.wave-control[data-index="${waveIndex}"]`);
        if (activeWave) {
            activeWave.classList.add('active');
        }
    }

    const controlsContainer = document.getElementById('waveControls');
    wave.waveParams.forEach((params, index) => {
        const waveControl = document.createElement('div');
        waveControl.className = 'wave-control';
        waveControl.dataset.index = index;
        controlsContainer.appendChild(waveControl);
    });

    document.getElementById('connectButton').addEventListener('click', connectArduino);
});