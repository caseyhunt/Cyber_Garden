/*
  Heart beat plotting!
  By: Nathan Seidle @ SparkFun Electronics
  Date: October 20th, 2016
  https://github.com/sparkfun/MAX30105_Breakout

  Shows the user's heart beat on Arduino's serial plotter

  Instructions:
  1) Load code onto Redboard
  2) Attach sensor to your finger with a rubber band (see below)
  3) Open Tools->'Serial Plotter'
  4) Make sure the drop down is set to 115200 baud
  5) Checkout the blips!
  6) Feel the pulse on your neck and watch it mimic the blips

  It is best to attach the sensor to your finger using a rubber band or other tightening
  device. Humans are generally bad at applying constant pressure to a thing. When you
  press your finger against the sensor it varies enough to cause the blood in your
  finger to flow differently which causes the sensor readings to go wonky.

  Hardware Connections (Breakoutboard to Arduino):
  -5V = 5V (3.3V is allowed)
  -GND = GND
  -SDA = A4 (or SDA)
  -SCL = A5 (or SCL)
  -INT = Not connected

  The MAX30105 Breakout can handle 5V or 3.3V I2C logic. We recommend powering the board with 5V
  but it will also run at 3.3V.
*/

#include <Wire.h>
#include "MAX30105.h"

MAX30105 particleSensor;
const int arrS = 3;
const int arrSize = 30;
float mySensVals[arrS];
float myHRVals[arrSize];
float twoBeats = 0;
//float myBPMVals[arrSize];

float myBPMVals = 0;
int beatCount = 0;

int rmssdd;
bool rising[3];
long lastBeat;
int delta;
float bpm = 0;
float difference;
float variance;
float bpmavg;

void setup()
{
  Serial.begin(115200);
  Serial.println("Initializing...");

  // Initialize sensor
  if (!particleSensor.begin(Wire, I2C_SPEED_FAST)) //Use default I2C port, 400kHz speed
  {
    Serial.println("MAX30105 was not found. Please check wiring/power. ");
    while (1);
  }

  //Setup to sense a nice looking saw tooth on the plotter
  byte ledBrightness = 0x1F; //Options: 0=Off to 255=50mA
  byte sampleAverage = 8; //Options: 1, 2, 4, 8, 16, 32
  byte ledMode = 3; //Options: 1 = Red only, 2 = Red + IR, 3 = Red + IR + Green
  int sampleRate = 3200; //Options: 50, 100, 200, 400, 800, 1000, 1600, 3200
  int pulseWidth = 411; //Options: 69, 118, 215, 411
  int adcRange = 4096; //Options: 2048, 4096, 8192, 16384
  int lastbeat = 0;
  int delta = 0;

  particleSensor.setup(ledBrightness, sampleAverage, ledMode, sampleRate, pulseWidth, adcRange); //Configure sensor with these settings

  //Arduino plotter auto-scales annoyingly. To get around this, pre-populate
  //the plotter with 500 of an average reading from the sensor

  //Take an average of IR readings at power up
  const byte avgAmount = 64;
  long baseValue = 0;
  for (byte x = 0 ; x < avgAmount ; x++)
  {
    baseValue += particleSensor.getIR(); //Read the IR value
  }
  baseValue /= avgAmount;

  //Pre-populate the plotter so that the Y scale is close to IR values
//  for (int x = 0 ; x < 500 ; x++)
    //Serial.println(baseValue);
}

void loop(){

 delta = 0;

for (int i = (arrS-1); i >=0; i--) {
  mySensVals[i+1] = mySensVals[i];
}


//if the number of heart rate interval readings is equal to the length of the array
//calculate sdnn and output this value over serial
//Serial.println("array value");
//Serial.println(myHRVals[arrSize-1]);
 if(myHRVals[arrSize-1] > 10){
    float sdnn = 0;
    for(int i=0;i<(arrSize-1);i++){
      sdnn += myHRVals[i];  
      Serial.print("hrvals");
      Serial.println(i);
      Serial.println(myHRVals[i]);
      delay(2);        
    }
    float average = sdnn/(arrSize-1);
     for(int i=0;i<(arrSize-1);i++){
     variance += sq(myHRVals[i] - average);   

    }
    Serial.print("average hrv:");
    Serial.println(average);
    Serial.println("Total Variance:");
    Serial.println(variance);
    variance = variance/(arrSize-1);

    bpmavg = myBPMVals/beatCount;

    sdnn = sqrt(variance/(arrSize-2));
    Serial.print("sdnn =");
    Serial.println(sdnn);
    Serial.print("average bpm = ");
    Serial.println(bpmavg);
   
    for(int i=0;i<(arrSize);i++){
      myHRVals[i] = 0;  
    }
    myBPMVals = 0;
    beatCount = 0;
  }

  for (int i = 2; i >=0; i--) {
    rising[i+1] = rising[i];
//    Serial.println(i);
//    Serial.println(rising[i]);
  }


  int irValue = particleSensor.getIR();
  mySensVals[0] = irValue;

if (irValue > -10000 || irValue<-30000 ){
    Serial.println(" No finger.");
    beatCount = 0;
     for(int i=0; i<arrS;i++){
      mySensVals[i]=0;
    }
    for(int i=0; i<arrSize; i++){
      myHRVals[i] = 0;
    }     
    myBPMVals = 0;
////    
  }
  
  else{
    
    if(mySensVals[0]>mySensVals[1]){
//    Serial.println("rising beat");
    rising[0]=1;
    Serial.print("ir value ");
    Serial.print(abs(irValue/float(15))-1500);   
    Serial.print(",");
    Serial.print(0);
    Serial.println();
  }else{
      if(rising[1] == 1 && rising[2]==1){
        //Serial.println("peak");
     

        delta = millis()-lastBeat;
        //Serial.println(delta);
       
        difference = float(1000)/float(bpm);
        lastBeat = millis();
        
        if(delta>1500){
  
        }else{
          
          if(delta>600){
             bpm = (float(60)/float(delta))*float(1000);
       
         bpmavg = myBPMVals/beatCount;
         if(beatCount>4){
         if(abs(bpm-bpmavg)>10){
          Serial.println("outside trend");
//            for (int i = (arrSize-1); i >=0; i--) {
//                  myHRVals[i+1] = myHRVals[i];
////                }
//                twoBeats = 0;
//           myHRVals[0] = delta;
//           if(bpm>50 && bpm<200){
//            myBPMVals += bpm;
//            beatCount += 1;
//           }
         }else{
          
           for (int i = (arrSize-1); i >=0; i--) {
                  myHRVals[i+1] = myHRVals[i];
                }
                twoBeats = 0;
           myHRVals[0] = delta;
           if(bpm>50 && bpm<200){
            myBPMVals += bpm;
            beatCount += 1;
        }
         }
          
         }else{
          for (int i = (arrSize-1); i >=0; i--) {
                  myHRVals[i+1] = myHRVals[i];
                }
                twoBeats = 0;
         
          myHRVals[0] = delta;
           if(bpm>50 && bpm<200){
            myBPMVals += bpm;
            beatCount += 1;
         }
         }
         Serial.print("ir value ");
             Serial.print(abs(irValue/float(15))-1500);   
          Serial.print(",");
          Serial.print(100);
          Serial.print(",");
          Serial.print(bpm);
        Serial.print(",");
            Serial.print(delta);  
            Serial.println();    
          }else if(delta>200 && delta<450){
            if(twoBeats == 0){
              twoBeats += delta;
              
            }}else{
               
            Serial.print("ir value ");
               Serial.print(abs(irValue/float(15))-1500);   
          Serial.print(",");
          Serial.print(200);
          Serial.print(",");
          
       
              twoBeats += delta;
              
               
            
            bpm = (float(60)/float(twoBeats))*float(1000);
        
         bpmavg = myBPMVals/beatCount;
         if(abs(bpm-bpmavg)>10){
          Serial.println("outside trend");
//          for (int i = (arrSize-1); i >=0; i--) {
//                  myHRVals[i+1] = myHRVals[i];
//
//                }
//          myHRVals[0] = twoBeats;
//          if(bpm>50 && bpm<200){
//        myBPMVals += bpm;
//        beatCount += 1;
         // }
         }else{
            for (int i = (arrSize-1); i >=0; i--) {
                  myHRVals[i+1] = myHRVals[i];

                }
          myHRVals[0] = twoBeats;
          if(bpm>50 && bpm<200){
        myBPMVals += bpm;
        beatCount += 1;
        }
         }
             twoBeats = 0;
             lastBeat = millis();
             Serial.print(bpm);
        Serial.print(",");
             Serial.println(myHRVals[0]);
            }
            }
          }
           rising[0] = 0;
       }
       
   
      }
      delay(2);
    }
      
 
