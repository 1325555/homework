const canvas = document.getElementById("waveCanvas");
const ctx = canvas.getContext("2d");
let width, height, dpr;

let lines = 5;
let amplitude = 60;
let speed = 0.02;

let arduinoValue = 512; // 0~1023
let port, reader;

const colors = ["#ff4d4d", "#00d9ff", "#eaff00", "#ff00c8", "#00ff87", "#ffaa00", "#a366ff"];

function resize() {
  dpr = window.devicePixelRatio || 1;
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);
}
resize();
window.addEventListener("resize", resize);

function drawLine(index, offset) {
  const color = colors[index % colors.length];
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  for (let x = 0; x < width; x++) {
    const t = (x / width) * Math.PI * 2;
    const y = height / 2 + Math.sin(t * (1 + index * 0.2) + offset) * (amplitude * (1 - index * 0.07));
    x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.stroke();
}

let time = 0;

function animate() {
  ctx.clearRect(0, 0, width, height);
  for (let i = 0; i < lines; i++) {
    drawLine(i, time + i);
  }
  time += speed;
  requestAnimationFrame(animate);
}
animate();

async function connectArduino() {
  port = await navigator.serial.requestPort();
  await port.open({ baudRate: 9600 });
  reader = port.readable.getReader();

  readSerial();
}

async function readSerial() {
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    if (value) {
      const str = new TextDecoder().decode(value).trim();
      const num = parseInt(str);
      if (!isNaN(num)) {
        arduinoValue = num;
        updateParameters(arduinoValue);
      }
    }
  }
}

function updateParameters(val) {
  const percent = val / 1023;
  amplitude = 30 + percent * 150;
  speed = 0.01 + percent * 0.05;
  lines = 2 + Math.floor(percent * 10);
}

document.getElementById("connectButton").addEventListener("click", connectArduino);
