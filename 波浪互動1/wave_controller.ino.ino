const int potPin = A0;  // 可變電阻接腳

void setup() {
  Serial.begin(9600);  // 初始化序列通信
}

void loop() {
  // 讀取可變電阻值
  int potValue = analogRead(potPin);
  int amplitude = map(potValue, 0, 1023, 0, 255);
  int frequency = map(potValue, 0, 1023, 1, 10);
  int angle = map(potValue, 0, 1023, 0, 360);

  // 傳送數據到序列監視器
  Serial.print("Amplitude: ");
  Serial.print(amplitude);
  Serial.print(", Frequency: ");
  Serial.print(frequency);
  Serial.print(", Angle: ");
  Serial.println(angle);

  delay(100);  // 每 100 毫秒傳送一次
}



