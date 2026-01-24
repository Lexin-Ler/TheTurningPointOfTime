class TimeLine {
  constructor(_x, _y, s) {

    // timeline
    this.pos = createVector(_x, _y);          // current vector position
    this.vel = createVector(0, s);             // initial downward speed
    this.segments = [];                        // recorded path segments
    this.lastPos = this.pos.copy();

    this.isDistorted = false;                  // whether distortion occurred
    this.energy = 100;                         // initial energy of the time flow
    this.hitCount = 0;                         // number of anchor influences
    this.flow = createVector(0, s);             // current flow direction

    this.hasCollapsed = false;                 // whether irreversible collapse started
    this.collapseDelayStart = null;             // timestamp for collapse delay
  }

  update() {

    // unified parameters
    let influence = 200;
    let maxEnergy = 100;
    let energyDecay = 0.99;
    let maxSegments = 800;

    // record previous position
    this.lastPos = this.pos.copy();

    // anchor disturbance detection
    let affectedThisFrame = false;

    for (let a of anchors) {
      let offset = p5.Vector.sub(this.pos, a);
      let d = offset.mag();

      if (d < influence) {
        offset.normalize();
        offset.rotate(HALF_PI);

        let strength = map(d, influence, 0, 0, 1);

        let targetFlow = p5.Vector.add(
          createVector(0, this.vel.y),
          offset.mult(strength * this.vel.y)
        );

        this.flow.lerp(targetFlow, 0.15);
        affectedThisFrame = true;
      }
    }

    // hit count increases only when new anchors appear
    if (!this.hasCollapsed && this.hitCount < anchors.length) {
      this.hitCount = anchors.length;
    }

    // recover toward base flow when not affected
    if (!affectedThisFrame) {
      let baseFlow = createVector(0, this.vel.y);
      this.flow.lerp(baseFlow, 0.05);
    }

    // collapse delay trigger
    if (this.hitCount >= 6 && this.collapseDelayStart === null) {
      this.collapseDelayStart = millis();
    }

    // delayed energy decay
    if (this.collapseDelayStart !== null) {
      let elapsed = millis() - this.collapseDelayStart;

      if (elapsed > 10000) {
        this.hasCollapsed = true;
        this.energy *= energyDecay;
        this.energy = max(this.energy, 0);
      }
    }

    // speed reduction based on remaining energy
    let speedFactor = map(this.energy, 0, maxEnergy, 0, 1);
    speedFactor = constrain(speedFactor, 0, 1);

    let flowStep = p5.Vector.mult(this.flow, speedFactor);
    this.pos.add(flowStep);

    // nearly frozen state at very low energy
    if (this.energy < 1) {
      // intentionally left inactive
    }

    if (this.pos.y > height) this.pos.y = 0;

    // record path segment
    this.segments.push({
      from: this.lastPos.copy(),
      to: this.pos.copy()
    });

    if (this.segments.length > maxSegments) {
      this.segments.shift();
    }
  }

  display() {

    let timeStr =
      nf(hour(), 2) + ":" +
      nf(minute(), 2) + ":" +
      nf(second(), 2);

    let words = ["morning", "line", "amber", "loop", "Goodnight", "full moon"];
    let fragments = [".", "|", ":", "/"];

    noStroke();
    textFont("Asimovian");
    textSize(13);

    // moss-like pale green base color
    let baseR = 170;
    let baseG = 200;
    let baseB = 180;

    // sampling density remains stable during anchor interaction
    let step =
      this.hitCount === 0 && this.segments.length < 120 ? 2 : 3;

    for (let i = 0; i < this.segments.length; i += step) {
      let p = this.segments[i].to;

      // opacity logic independent from energy
      let ageFade = map(i, 0, this.segments.length, 60, 160);
      let verticalFade = map(p.y, 0, height, 200, 120);
      let alpha = min(ageFade, verticalFade);

      let offset = random(-15, 15);
      fill(baseR + offset, baseG + offset, baseB + offset, alpha);

      // content generation logic
      let r = random();
      let content;

      if (r < 0.4) {
        content = timeStr.charAt(i % timeStr.length);
      } else if (r < 0.7) {
        let w = random(words);
        content = w.charAt(i % w.length);
      } else {
        content = random(fragments);
      }

      text(content, p.x, p.y);
    }

    // head timestamp unaffected by energy
    fill(180, 255, 180, 120);
    textSize(10);
    text(timeStr, this.pos.x, this.pos.y);
  }
}
