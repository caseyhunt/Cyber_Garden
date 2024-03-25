let pw;
let a = 0; 
let acc = 0;
let stick;

function preload() {
  pw = loadImage('https://i.imgur.com/mRbRuDg.png');
  stick = loadImage('https://i.imgur.com/nxZW4xE.png');
}

function setup() {
  let c = createCanvas(900, 400);
  c.parent('pinwheel_animation');
  pw.resize(250,250);
  stick.resize(20,250);
  angleMode(DEGREES);
  
  
}

function draw() {
  background(500);
  translate(450,150);
  image(stick,0,0);
  push();


  if(spinning == true){
    if(acc < 3){
    acc = acc + 0.05
    }
    a = a + acc; 
    rotate(a);
    checkSpinTime();
    waterGarden();
  }else{
    if(acc <= 0){
      acc = 0;
      rotate(a);
    }else{
      acc = acc - 0.01;
      a = a + acc;
      rotate(a);
    }
  }
  imageMode(CENTER);
  image(pw, 1, 1);
  pop();
}