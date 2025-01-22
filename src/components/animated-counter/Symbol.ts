import p5 from 'p5';

export class Symbol {
  private x: number;
  private y: number;
  private value: string;
  private opacity: number;
  private switchInterval: number;
  private lastSwitch: number;
  private p: p5;
  private targetValue: string;
  private isForming: boolean;
  private isDissipating: boolean;
  private velocity: { x: number; y: number };
  private targetX: number;
  private targetY: number;

  constructor(p: p5, x: number, y: number, targetValue: string, isForming: boolean = true) {
    this.p = p;
    this.x = isForming ? x : this.p.random(this.p.width);
    this.y = isForming ? -50 : y;
    this.targetX = x;
    this.targetY = y;
    this.targetValue = targetValue;
    this.value = this.getRandomSymbol();
    this.opacity = isForming ? 0 : 255;
    this.switchInterval = p.random(50, 150);
    this.lastSwitch = p.millis();
    this.isForming = isForming;
    this.isDissipating = false;
    this.velocity = {
      x: 0,
      y: isForming ? this.p.random(2, 5) : this.p.random(-2, -5)
    };
  }

  private getRandomSymbol(): string {
    const charTypes = [
      '0123456789',
      'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ',
      '∈∉∊∋∌∍∎∏∐∑−∓∔∕∖∗∘∙√∛∜∝∞∟∠∡∢∣'
    ];
    const charset = charTypes[Math.floor(this.p.random(charTypes.length))];
    return charset[Math.floor(this.p.random(charset.length))];
  }

  startDissipating() {
    this.isDissipating = true;
    this.velocity = {
      x: this.p.random(-2, 2),
      y: this.p.random(2, 5)
    };
  }

  update() {
    const now = this.p.millis();
    
    if (this.isForming) {
      // Move towards target position
      this.y += this.velocity.y;
      if (this.y >= this.targetY) {
        this.y = this.targetY;
        this.isForming = false;
      }
      this.opacity = this.p.map(this.y, -50, this.targetY, 0, 255);
    } else if (this.isDissipating) {
      // Move away with velocity
      this.x += this.velocity.x;
      this.y += this.velocity.y;
      this.opacity = this.p.map(this.y, this.targetY, this.p.height + 50, 255, 0);
    }

    // Update symbol
    if (now - this.lastSwitch > this.switchInterval) {
      if (!this.isDissipating && !this.isForming) {
        this.value = this.targetValue;
      } else {
        this.value = this.getRandomSymbol();
      }
      this.lastSwitch = now;
    }

    return this.opacity <= 0;
  }

  render() {
    this.p.fill(255, 255, 255, this.opacity);
    this.p.text(this.value, this.x, this.y);
  }
}