//**Introduction**
// Multiple streams of text, representing the passage of time, flow continuously downward across the screen. Viewers may click the display to generate anchor points, which act as irreversible interventions in the flow of time, perpetually altering the direction and velocity of the temporal currents. As the number of anchor points accumulates, the time streams gradually decelerate and collapse, ultimately solidifying into static traces of text. Time ceases to flow further.

// Phase One｜Waiting
// The stream of time continues to grow and descend in textual form, while the visual remains stable.

// Phase Two｜Intervention
// Clicking the screen generates anchor points, where local events influence the time stream, altering its direction and velocity.

// Phase Three｜Solidification
// As anchor points accumulate, the time stream naturally decelerates and collapses, ultimately solidifying into static textual traces.
console.log("p5 loaded");


let timeLines = [];        // timeline objects
let totalLines = 90;      // number of timelines
// ===== soft reset control =====
let isResetting = false;
let fadeAlpha = 0;          // 白色遮罩透明度
let fadeSpeed = 6;          // 变白/退白速度
let resetStage = 0;         // 0: 正常 1: 变白 2: 重置 3: 退白

let anchors = [];         // stored mouse press anchors
let anchorSounds = []; // store anchor sounds

let smoothVol = 0;        // smoothing value for grid motion
let resetBtn;             //reset button


function preload() {
  anchorSounds[0] = loadSound("muyu s1.MP3");
  anchorSounds[1] = loadSound("qin s2.MP3");
}


function setup() {
  createCanvas(windowWidth, windowHeight);

  // initialize timeline positions
  for (let i = 0; i < totalLines; i++) {
    let x = (i * width) / totalLines;
    let y = 0;
    let s = random(2, 5); // falling speed
    timeLines.push(new TimeLine(x, y, s));
  }

  // 降低音量
  for (let s of anchorSounds) {
    if (s) s.setVolume(0.2);
  }

  resetBtn = createButton('Enter Another New Time');
  resetBtn.position(20, 20);
  resetBtn.addClass('reset-btn'); //CSS 
  resetBtn.mousePressed(startSoftReset);

}

function draw() {

  // background aesthetic
  background(245, 247, 255);
  fill(255, 255, 255, 30 + sin(frameCount * 0.004) * 10);

  // texture layer derived from sketch book experiment
  // grid motion

  let baseMove = 40;
  let t = frameCount * 0.1;

  move = map(smoothVol, 0, 0.02, baseMove, 15);

  let gap = 35;
  noStroke();
  fill(170, 215, 200, 30);

  for (let netx = 0; netx < width; netx += gap) {
    for (let nety = 0; nety < height; nety += gap) {

      let nx = noise(netx * 0.02, nety * 0.02, t) - 0.5;
      let ny = noise(
        1000 + netx * 0.02,
        1000 + nety * 0.02,
        t * 0.9
      ) - 0.5;

      let mx = nx * move;
      let my = ny * move * 0.7;

      // constrain grid elements within canvas
      let rx = constrain(netx + mx, 0, width - gap);
      let ry = constrain(nety + my, 0, height - gap);

      rect(rx, ry, gap, gap);
    }
  }

  // update and draw timelines
  for (let t of timeLines) {
    t.update();
    t.display();
  }

  // draw anchors with soft overlapping rings
  for (let a of anchors) {
    noFill();
    strokeWeight(4);

    randomSeed(int(a.x * 10 + a.y * 20)); // stable randomness per anchor

    for (let i = 0; i < 6; i++) {
      let dx = random(-18, 8);
      let dy = random(-18, 8);
      let r = random(70, 80);

      let isFilled = random() < 0.3;
      if (isFilled) fill(255, 40);
      else noFill();

      stroke(
        random(190, 200),
        random(220, 255),
        random(220, 255),
        random(80, 190)
      );

      ellipse(a.x + dx, a.y + dy, r, r);
    }
  }
  // ===== soft reset fade layer =====
  if (isResetting) {
    noStroke();
    fill(255, fadeAlpha);
    rect(0, 0, width, height);

    if (resetStage === 1) {
      // 逐渐变白
      fadeAlpha += fadeSpeed;
      if (fadeAlpha >= 255) {
        fadeAlpha = 255;
        resetStage = 2;
      }
    }

    else if (resetStage === 2) {
      // 真正重置时间流（白屏中进行）
      resetTimeFlow();
      resetStage = 3;
    }

    else if (resetStage === 3) {
      // 白色慢慢退去
      fadeAlpha -= fadeSpeed;
      if (fadeAlpha <= 0) {
        fadeAlpha = 0;
        isResetting = false;
        resetStage = 0;
      }
    }
  }

}

// basic MVP interaction
function mousePressed() {
  userStartAudio(); // 解锁浏览器音频（必须）
  anchors.push(createVector(mouseX, mouseY));

  // 随机选择一个音效播放
  if (anchorSounds.length > 0) {
    let s = random(anchorSounds);
    if (s.isLoaded()) s.play();
  }

  // limit anchor count to avoid instability
  if (anchors.length > 12) {
    anchors.shift();
  }
}

function startSoftReset() {
  if (isResetting) return;
  isResetting = true;
  resetStage = 1; // 开始变白
}

function resetTimeFlow() {
  // 清空锚点
  anchors = [];

  // 重建时间流
  timeLines = [];
  for (let i = 0; i < totalLines; i++) {
    let x = (i * width) / totalLines;
    let y = 0;
    let s = random(2, 5);
    timeLines.push(new TimeLine(x, y, s));
  }
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
