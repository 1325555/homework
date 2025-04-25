const int potentiometerPin = A0;  // 可調電阻接到 A0 引腳

void setup() {
  Serial.begin(9600);
}

void loop() {
  int sensorValue = analogRead(A0);
  Serial.println(sensorValue);
  delay(10); // 調整靈敏度：越小越即時
}



