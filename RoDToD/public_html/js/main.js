/*
//A version of the interactive Whitney RDTD concept.
 
*/

//var font;

//var 5 = 5, 
var movingDot=0;
var moving=false;
var dotSize;
var distances = [];
var xs = [];
var ys = [];
var lastXs = [];
var lastYs = [];
var boundedAs = []; //between -Pi and Pi
var boundedLastAs = []; 
var incrementAs = []; 
var unwrappedAs = []; //total angle travelled
var lastUnwrappedAs = [];
var phaseWraps = []; //keep track of phase wrapping


function setup() {
  //size(1280, 800, P2D);//Asus TF-101 is 1280x800
//  size(800, 800);
  createCanvas(800, 800);
  background(255);
  frameRate(25);
  smooth();
  strokeWeight(2);
//  font=loadFont("DejaVuSansMono-48.vlw");
//  textFont(font);
//  textSize(12);
  dotSize = 50;//(width/2)/float(5);
  for (var i=0;i<5;i+=1) {
    distances[i] = i*dotSize;
    xs[i] = distances[i];
    ys[i]= 0.0;
    lastXs[i]=xs[i];
    lastYs[i]=ys[i];
    //unwrappedAs[i]=0.0F;
    //boundedAs[i]=0.0F;
  }
  noFill();
//  font=loadFont("DejaVuSans-ExtraLight-48.vlw");
  calculateAngleFromXY();
  calculateXYFromAngle();
//  oscP5 = new OscP5(this, 9000);
//  sendAddress = new NetAddress("127.0.0.1", 8000);
//  //sendAddress = new NetAddress("192.168.1.5", 8000); //home IP: 192.168.1.5 
  //sendAddress = new NetAddress("134.226.86.202", 8000); //TCD IP:134.226.86.202 (not working)
  //sendAddress = new NetAddress("192.168.42.181", 8000);//Ethernet over USB
  //checkPhaseWrapXY();
  //calculateIncrementAs();
  //calculateUnwrappedAs();
//  sendState(); //sends angles over OSC to Max synth.
}

function draw() {
  background(255);
  translate(width/2, height/2);
  for (var i=1;i<5;i+=1) {
    strokeWeight(2);
    //text("("+lastXs[i]+","+lastYs[i]+")", lastXs[i], lastYs[i]+dotSize/2);
    //text("("+boundedLastAs[i]+")", lastXs[i], lastYs[i]-dotSize/2);
    stroke(123, 150);
    line(xs[i-1], ys[i-1],xs[i],ys[i]); //connect dots with a line
    noFill();
    ellipse(0, 0, distances[i]*2, distances[i]*2); //orbits
    if (i==0) {
      noStroke(); 
      fill(0, 250, 0, 150);
    }
    else {
      stroke(250, 0, 0, 150);
      noFill();
    }
    if(ys[i]<0){
      fill(0, 200);
    }
    ellipse(xs[i], ys[i], dotSize, dotSize); //current dot positions
    fill(250, 0, 0, 150);
    //text("("+xs[i]+","+ys[i]+")", xs[i], ys[i]+dotSize/2); //prvar cartesian to screen
    fill(0, 0, 250, 150);
    //text("("+boundedAs[i]+")", xs[i], ys[i]-dotSize/2);
//    text(unwrappedAs[i], xs[i]+dotSize/2, ys[i]+dotSize/2);
    stroke(0, 250, 0, 150);
    noFill();
    //ellipse(lastXs[i], lastYs[i], dotSize/2, dotSize/2); //previous dot position
    //strokeWeight(5);
    //arc(x, y, width, height, start, stop)
    //arc(0, 0, float(i*width/4), float(i*width/4), boundedLastAs[i], boundedAs[i]); //clockwise direction arc indicator
    //TODO: fix arc indicator for anti-clockwise motion and for crossover at Pi to -Pi
    fill(0, 250, 0, 150);
    //if (movingDot==i) {
    //text("Angle Increment for Dot "+i+": "+incrementAs[i], -100, height/2-50);
    //}
    //text("Angle Increment for Dot "+i+": "+incrementAs[i], -100, height/2-50-(i*25));
    //text("Phase Wrap for Dot "+i+": "+phaseWraps[i], -width/4, -(i*25));
    
  }
}

function checkIfOver(i_) {
  var xIn = mouseX-width/2;
  var yIn = mouseY-height/2;
  //println("Checking if over Dot " +myID);
  //println("Dot #"+myID+" x: "+myX+" y: "+myY+" size is: "+mySize);
  //(x - a)^2 + (y - b)^2 = R^2 -eqn to check if on a circle
  //println("xIn: "+xIn+" yIn: "+yIn+" size"+mySize);
  var xOn = sq(xIn - xs[i_]);
  var yOn = sq(yIn - ys[i_]);
  var rOn = sq(dotSize/2.0);
  //println("xOn + yOn = rOn : "+xOn+" | "+yOn+" | "+rOn);
  if ((xOn + yOn)< rOn) {
    //println("***********Over dot no: "+myID+"**************");
    return true;
  }
  else return false;
}

function mousePressed() {
  for (var i=1;i<5;i+=1) {
    //println("Check "+i);
    if (checkIfOver(i)) {
      moving=true;
      movingDot=i;
//      println("Pressed! Moving dot is "+movingDot);
      break;
    }
  }
  if(movingDot===0){
//   triggerSound(); 
  }
}

function mouseDragged() {
  //println("Dragging Mouse ");
  if (moving) {
    lastXs[movingDot]=xs[movingDot];
    lastYs[movingDot]=ys[movingDot]; 
    xs[movingDot]=mouseX-width/2;
    ys[movingDot]=mouseY-height/2;
    calculateAngleFromXY();
    calculateXYFromAngle();
    checkPhaseWrapXY();
    calculateIncrementAs();
    calculateUnwrappedAs();
    //resetUnwrappedAs();
    moveOthers();
  }
//  sendState();
}

function mouseReleased() {
  moving=false;
  movingDot =0;
//  println("Released! Moving dot is "+movingDot);
}

function calculateAngleFromXY() {
  boundedLastAs[movingDot]=boundedAs[movingDot];
  boundedAs[movingDot]= atan2(ys[movingDot], xs[movingDot]);
}

function calculateXYFromAngle() {
  if (boundedAs[movingDot]<= PI&&boundedAs[movingDot]>= -PI) {
    xs[movingDot] = cos(boundedAs[movingDot])*distances[movingDot];
    ys[movingDot] = sin(boundedAs[movingDot])*distances[movingDot];
  }
  else {
    xs[movingDot] = cos(PI)*distances[movingDot];
    ys[movingDot] = sin(PI)*distances[movingDot];
  }
}

function checkPhaseWrapXY() {
  if (lastYs[movingDot]*ys[movingDot]<0&&xs[movingDot]<0&&ys[movingDot]<0) { //Top LHS (clockwise)
    phaseWraps[movingDot]+=1;
  }
  // else if (lastY*myY<0&&myX>0&&myY>0) { //Bottom RHS (clockwise)
  //  noOfPhaseWraps+=1;
  //}
  //else if (lastY*myY<0&&myX>0&&myY<0) { //Top RHS (anti-clockwise)
  //  noOfPhaseWraps-=1;
  //}
  else if (lastYs[movingDot]*ys[movingDot]<0&&xs[movingDot]<0&&ys[movingDot]>0) { //Bottom LHS (anti-clockwise)
    phaseWraps[movingDot]-=1;
  }
}


function calculateIncrementAs() {
  incrementAs[movingDot]= boundedAs[movingDot]-boundedLastAs[movingDot];
  //if(incrementAs[movingDot]>6.27||incrementAs[movingDot]<-6.27){
  //incrementAs[movingDot]-=6.27;
  //}
  if (incrementAs[movingDot]>PI) { //need to have this big enough for larger mouse dragging
    incrementAs[movingDot]-=TWO_PI;
  }
  else if (incrementAs[movingDot]<-PI) {
    incrementAs[movingDot]+=TWO_PI;
  }
}


function calculateUnwrappedAs() {
  lastUnwrappedAs[movingDot]=unwrappedAs[movingDot];
  unwrappedAs[movingDot]=boundedAs[movingDot]+(phaseWraps[movingDot]*TWO_PI);
}

function resetUnwrappedAs() {
  if (unwrappedAs[movingDot]>=TWO_PI*movingDot) {
    unwrappedAs[movingDot]=0.0;
  }
}

function moveOthers() {
  for (var i=0;i<5;i+=1) {
    if (movingDot!=i) {
      incrementAs[i]= (float(i)/movingDot)*incrementAs[movingDot];
      autoIncrement(i);
      calculateXYFromAngleAuto(i);
      calculateAngleFromXYAuto(i);
      checkPhaseWrapXYAuto(i);
      //calculateUnwrappedAsAuto(i);
    }
  }
}

function autoIncrement(i_) {
  //unwrappedAs[i_]+=incrementAs[i_];
  lastUnwrappedAs[i_]=unwrappedAs[i_];
  unwrappedAs[i_]+=incrementAs[i_];
}

function calculateXYFromAngleAuto(i_) {
  lastXs[i_]=xs[i_];
  lastYs[i_]=ys[i_]; 
  xs[i_] = cos(unwrappedAs[i_])*distances[i_];
  ys[i_] = sin(unwrappedAs[i_])*distances[i_];
}
function calculateAngleFromXYAuto(i_) {
  boundedAs[i_]= atan2(ys[i_], xs[i_]);
}

//function calculateIncrementAsAuto(var i_) {
//  incrementAs[i_]= boundedAs[i_]-boundedLastAs[i_];
//  }

function checkPhaseWrapXYAuto(i_) {
  if (lastYs[i_]*ys[i_]<0&&xs[i_]<0&&ys[i_]<0) { //Top LHS (clockwise)
    phaseWraps[i_]+=1;
  }
  // else if (lastY*myY<0&&myX>0&&myY>0) { //Bottom RHS (clockwise)
  //  noOfPhaseWraps+=1;
  //}
  //else if (lastY*myY<0&&myX>0&&myY<0) { //Top RHS (anti-clockwise)
  //  noOfPhaseWraps-=1;
  //}
  else if (lastYs[i_]*ys[i_]<0&&xs[i_]<0&&ys[i_]>0) { //Bottom LHS (anti-clockwise)
    phaseWraps[i_]-=1;
  }
}

//function calculateUnwrappedAsAuto(var i_) {
//     unwrappedAs[i_]=boundedAs[i_]+(phaseWraps[i_]*TWO_PI);
////    unwrappedAs[i_]+= incrementAs[i_];
////}
//function oscEvent(OscMessage theOscMessage) {
//  //printing the whole incoming message can show where the relevant data is...
//  println("OSC message received on phone! ");
//  fill(255);
//  //text("Message in: "+theOSCMessage, width/2, height-100);
//  // ...and the get() method can be used to extract this.
//  //var noteNo = theOscMessage.get(0).intValue();
//  //println("Max5 played MIDI note number "+noteNo);
//}
//
//function triggerSound() {
//  OscMessage myMessage = new OscMessage("/trigger");
//  oscP5.send(myMessage, sendAddress);
//}
//function sendState() {
//  for (var i=0;i<5;i+=1) {  
//    OscMessage myMessage = new OscMessage("/test");
//    //    myMessage.add(myID);
//    myMessage.add(i);
//    var sendVal = map(boundedAs[i], -PI, PI, 1, 100); //using bounded angles 
//    //gives best perception of consonance/dissonance
//    sendVal= sendVal*i;
//    myMessage.add(sendVal);
//    oscP5.send(myMessage, sendAddress);
//  }
//}
