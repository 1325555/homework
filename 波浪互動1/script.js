const canvas = document.getElementById('waveCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let amplitude = 50; // 振幅
let frequency = 0.01; // 頻率
let angle = 0; // 角度

// 繪製波浪線
function drawWave() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.8)';
    ctx.lineWidth = 2;

    for (let x = 0; x < canvas.width; x++) {
        const y = canvas.height / 2 + amplitude * Math.sin(frequency * x + angle);
        if (x === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }

    ctx.stroke();
    angle += 0.05; // 波浪流動效果
    requestAnimationFrame(drawWave);
}

drawWave();

// WebSocket 連接
const socket = new WebSocket('ws://localhost:8765'); // 替換為您的 WebSocket 地址

socket.onmessage = function (event) {
    const data = event.data.split(',');
    amplitude = parseInt(data[0], 10);
    frequency = parseFloat(data[1]) / 100; // 假設頻率縮放到 0.01～1
    angle = parseInt(data[2], 10);
};

socket.onopen = function () {
    console.log('WebSocket 已連接');
};

socket.onerror = function (error) {
    console.error('WebSocket 錯誤:', error);
};

socket.onclose = function () {
    console.log('WebSocket 已關閉');
};