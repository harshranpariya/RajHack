unsigned long startTime = 0;

bool flag = false;

long total = 0;

void setup() { 
    Serial.begin(115200);  // open serial connection to USB Serial 
                           //port(connected to your computer)
    Serial1.begin(57600);  // open internal serial connection to 
                           //MT7688

    pinMode(13, OUTPUT); // in MT7688, this maps to device 
    pinMode(6, INPUT);
    
    if(total < 0)
      total = 0;
}
void loop() { 
    
    int value = digitalRead(7);
    if(flag == false && value == 0)
    {
      flag = true;
      startTime = millis();
    }

    if(value == 0 && flag == true)
    {
      total = (millis() - startTime) / 1000;
    }

    if(flag == true && value == 1)
    {
      flag = false;
      total = 0;
    }
    
    Serial.println("sending");
    Serial.println(total);
    Serial1.println(total);
    
    delay(200);
}