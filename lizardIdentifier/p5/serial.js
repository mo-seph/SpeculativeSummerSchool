// The name for your serialPort connection to the ItsyBitsy is shown in the p5.serialcontrol app.
let serialPortName = "/dev/tty.usbmodem2101";

// These functions help you debug the serial connection.
function serverConnected() {
    print("Connected to Server");
  }
  
  function gotList(thelist) {
    print("List of Serial Ports:");
  
    for (let i = 0; i < thelist.length; i++) {
      print(i + " " + thelist[i]);
    }
  }
  
  function gotOpen() {
    print("Serial Port is Open");
  }
  
  function gotClose() {
    print("Serial Port is Closed");
    latestData = "Serial Port is Closed";
  }
  
  function gotError(theerror) {
  
    print(theerror);
  }
  
  // This function reads the incoming serial connection. It takes the current line, removes any extra spaces, and saves it to latestData.
  
  function gotSerialData() {
    let currentString = serial.readLine();
    trim(currentString);
    console.log(`Current string: ${currentString}`)
    gotData(currentString)
  }

  function setupSerial() {
    // We create a new serialPort object. This lets us read/write through the Serial connection.
   serial = new p5.SerialPort();
 
   // We list the available ports and also try opening a connection to the serialPort you specified at the top.
   serial.list();
   serial.open(serialPortName);
 
   // These next few lines run based on different events, for example when the p5.sketch succesfully connects to the server or the data comes in. We don't have to touch them often. These events are defined in setup, but will always run as long as the sketch is running. They don't have be defined in the draw() function.
   serial.on("connected", serverConnected);
   serial.on("list", gotList);
   serial.on("data", gotSerialData);
   serial.on("error", gotError);
   serial.on("open", gotOpen);
   serial.on("close", gotClose);
 }