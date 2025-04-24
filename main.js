const canvas = document.getElementById("waveCanvas");
const ctx = canvas.getContext("2d");

let width, height;
let waveData = [];


let baseAmplitude = 100;
let frequency = 0.005;
let horizontalSpeed = 1;
let waveOffset = 0;

// 設置畫布大小
function setCanvasSize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}


function initWaves() {
    for (let i = 0; i < 5; i++) {  
        waveData.push({
            amplitude: baseAmplitude,
            frequency: frequency + Math.random() * 0.005,
            offset: Math.random() * Math.PI,
            color: `hsl(${Math.random() * 360}, 100%, 80%)`,
            phaseShift: Math.random() * Math.PI * 2, 
            speed: Math.random() * 0.05 + 0.02, 
        });
    }
}


function updateWaveParams(sensorValue) {
    baseAmplitude = map(sensorValue, 0, 1023, 50, 200); 
    frequency = map(sensorValue, 0, 1023, 0.001, 0.01); 
    horizontalSpeed = map(sensorValue, 0, 1023, 0.5, 3);
}

function drawWave() {
    ctx.clearRect(0, 0, width, height);  

    waveData.forEach((wave) => {
        ctx.beginPath();
        ctx.strokeStyle = wave.color;
        ctx.lineWidth = 2;
        
        let offset = wave.offset + wave.phaseShift;
        let amplitude = wave.amplitude * (1 + Math.sin(waveOffset * wave.speed) * 0.5); 
        let frequency = wave.frequency + Math.sin(waveOffset * wave.speed) * 0.0005; 
        
        for (let x = 0; x < width; x++) {
            let y = amplitude * Math.sin(x * frequency + offset);
            if (x === 0) {
                ctx.moveTo(x, y + height / 2);
            } else {
                ctx.lineTo(x, y + height / 2);
            }
        }

        ctx.stroke();
    });

    
    waveData.forEach((wave) => {
        wave.offset += horizontalSpeed * 0.01;
    });

    
    waveOffset += 0.05;

    requestAnimationFrame(drawWave);  
}


function map(value, in_min, in_max, out_min, out_max) {
    return (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}


let port;
let reader;
let decoder;

async function connectArduino() {
    
    const selectedPort = await navigator.serial.requestPort();
    await selectedPort.open({ baudRate: 9600 });

    
    reader = selectedPort.readable.getReader();
    decoder = new TextDecoderStream();
    reader.pipeTo(decoder.writable);
    const inputStream = decoder.readable;
    const readerInput = inputStream.getReader();

    
    while (true) {
        const { value, done } = await readerInput.read();
        if (done) {
            break;
        }
        if (value) {
            const sensorValue = parseInt(value.trim());
            updateWaveParams(sensorValue);
        }
    }
}

document.getElementById('connectBtn').addEventListener('click', connectArduino);


setCanvasSize();
initWaves();
drawWave();

