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

  constructor(p: p5, x: number, y: number, targetValue: string) {
    this.p = p;
    this.x = x;
    this.y = y;
    this.targetValue = targetValue;
    this.value = targetValue;
    this.opacity = 255;
    this.switchInterval = p.random(100, 300);
    this.lastSwitch = p.millis();
  }

  private setToRandomSymbol() {
    const charTypes = [
      this.targetValue,
      '0123456789',
      '∈∉∊∋∌∍∎∏∐∑−∓∔∕∖∗∘∙√∛∜∝∞∟∠∡∢∣'
    ];
    const charset = charTypes[Math.floor(this.p.random(charTypes.length))];
    this.value = charset[Math.floor(this.p.random(charset.length))];
  }

  update() {
    const now = this.p.millis();
    if (now - this.lastSwitch > this.switchInterval) {
      if (this.p.random(1) < 0.1) {
        this.setToRandomSymbol();
      } else {
        this.value = this.targetValue;
      }
      this.lastSwitch = now;
    }
  }

  render() {
    this.p.fill(255, 255, 255, this.opacity);
    this.p.text(this.value, this.x, this.y);
  }
}