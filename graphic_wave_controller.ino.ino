void setup() {
  Serial.begin(9600); // 設置串口速率
}

void loop() {
  int sensorValue = analogRead(A0); // 讀取 A0 引腳的值（可調式電阻）
  Serial.println(sensorValue);  // 傳送讀取值到串口
  delay(100); // 延遲，避免數據過於頻繁
}
