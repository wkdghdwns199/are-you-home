#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
 
const char* ssid = "Home Network";
const char* password = "home3211503!";
 

int trig = D2;
int echo = D3;

int ledPin = D13; // GPIO14
int warningLedPin = D9;
int piezzoPin = D11;

WiFiServer server(80);

bool dangerMode = false;

void setup() {

  pinMode(trig,OUTPUT);
  pinMode(echo,INPUT);
  
  // put your setup code here, to run once:
  Serial.begin(115200);
  delay(10);
 
  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin, LOW);
  pinMode(warningLedPin, OUTPUT);
  digitalWrite(warningLedPin, LOW);
  pinMode(piezzoPin, OUTPUT);
 
  // Connect to WiFi network
  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  
  IPAddress ip(192, 168, 219, 95); // 사용할 IP 주소
  IPAddress gateway(192, 168, 219, 1); // 게이트웨이 주소
  IPAddress subnet(255, 255, 255, 0); // 서브넷 주소
  WiFi.config(ip, gateway, subnet); 

  WiFi.begin(ssid, password);
 
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
 
  // Start the server
  server.begin();
  Serial.println("Server started");
 
  // Print the IP address
  Serial.print("Use this URL to connect: ");
  Serial.print("http://");
  Serial.print(WiFi.localIP());
  Serial.println("/");


}


int value = LOW;
void loop() {

  // put your main code here, to run repeatedly:
  // Check if a client has connected
  WiFiClient client = server.available();

   digitalWrite(trig, LOW);
  digitalWrite(echo, LOW);
  delayMicroseconds(2);
  digitalWrite(trig, HIGH);
  delayMicroseconds(10);
  digitalWrite(trig, LOW);

  unsigned long duration = pulseIn(echo, HIGH);

  // 초음파의 속도는 초당 340미터를 이동하거나, 29마이크로초 당 1센치를 이동합니다.
  // 따라서, 초음파의 이동 거리 = duration(왕복에 걸린시간) / 29 / 2 입니다.
  float distance = duration / 29.0 / 2.0;

  if (!client) {
      if (value == HIGH){
     
    
      // 측정된 거리 값를 시리얼 모니터에 출력합니다.
      Serial.println(distance);
    
      // 측정된 거리가 10cm 이하라면, 아래의 블록을 실행합니다.
      if (distance >= 90) {
        // LED가 연결된 핀의 로직레벨을 HIGH (5V)로 설정하여, LED가 켜지도록 합니다.
        digitalWrite(warningLedPin, HIGH);
        digitalWrite(piezzoPin, HIGH);
        tone(piezzoPin, 880);
      }
      // 측정된 거리가 10cm 이상이라면, 아래의 블록을 실행합니다.
      else {
        // LED가 연결된 핀의 로직레벨을 LOW (0V)로 설정하여, LED가 꺼지도록 합니다.
        digitalWrite(warningLedPin, LOW);
        digitalWrite(piezzoPin, LOW);
      }
      // 0.2초 동안 대기합니다.
      delay(200);
    }
    else {
      digitalWrite(warningLedPin, LOW);
      digitalWrite(piezzoPin, LOW);
    }
    return;
  }
  
  // Wait until the client sends some data
  Serial.println("new client");
  while(!client.available()){
    delay(1);
  }
  
  

  // Read the first line of the request
  String request = client.readStringUntil('\r');
  Serial.println(request);
  client.flush();
 
  // Match the request
 
  
  if (request.indexOf("/LED=ON") != -1)  {
    digitalWrite(ledPin, HIGH);
    value = HIGH;
  }
  if (request.indexOf("/LED=OFF") != -1)  {
    digitalWrite(ledPin, LOW);
    value = LOW;
  }

 
// Set ledPin according to the request
//digitalWrite(ledPin, value);
 
  // Return the response
  client.println("HTTP/1.1 200 OK");
  client.println("Content-Type: text/html");
  client.println(""); //  do not forget this one
  // client.println("<!DOCTYPE HTML>");
  // client.println("<html>");
 
  // client.print("Led pin is now: ");
 
  // if(value == HIGH) {
  //   client.print("On");
  // } else {
  //   client.print("Off");
  // }

  
  // client.println("<br><br>");
  // client.println("<a href=\"/LED=ON\"\"><button>Turn On </button></a>");
  // client.println("<a href=\"/LED=OFF\"\"><button>Turn Off </button></a><br />");
  client.println(distance);
  // if (value == HIGH){
  //   Serial.println("Danger Mode");
  // }
  // else {
  //   Serial.println("Safe Mode");
  // }  
  // client.println("</html>");
 
  delay(1);
  Serial.println("Client disonnected");
  
  
  Serial.println("");
 
}
