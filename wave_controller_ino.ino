const int POT_PIN = A0;      // 可調電阻接在 A0

int currentWave = 0;         // 當前控制的波浪 (0-4)
int currentParam = 0;        // 當前控制的參數 (0=振幅, 1=速度, 2=線寬)
unsigned long lastChangeTime = 0;  // 上次切換的時間
const unsigned long CHANGE_INTERVAL = 3000;  // 每3秒切換一次

void setup() {
  Serial.begin(9600);
}

void loop() {
  // 自動切換控制的波浪和參數
  unsigned long currentTime = millis();
  if (currentTime - lastChangeTime >= CHANGE_INTERVAL) {
    lastChangeTime = currentTime;
    
    // 切換到下一個參數/波浪
    currentParam++;
    if (currentParam > 2) {
      currentParam = 0;
      currentWave = (currentWave + 1) % 5;
    }
  }
  
  // 讀取電位器值
  int potValue = analogRead(POT_PIN);
  
  // 發送數據格式：波浪索引,參數類型,參數值
  Serial.print(currentWave);
  Serial.print(",");
  Serial.print(currentParam);
  Serial.print(",");
  Serial.println(potValue);
  
  delay(50);
}