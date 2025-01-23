import p5 from 'p5';
import { SymbolProps } from './types';

export class Symbol {
  private x: number;
  private y: number;
  private value: string;
  private speed: number;
  private opacity: number;
  private first: boolean;
  private targetX: number;
  private targetY: number;
  private isForming: boolean;
  private lastUpdate: number;
  private updateInterval: number;
  private streamIndex: number;
  private p: p5;

  constructor({ x, y, speed, first, streamIndex, p }: SymbolProps) {
    this.p = p;
    this.x = x;
    this.y = y;
    this.value = '';
    this.speed = speed;
    this.first = first;
    this.opacity = first ? 255 : this.p.random(70, 100);
    this.targetX = x;
    this.targetY = y;
    this.isForming = false;
    this.lastUpdate = this.p.millis();
    this.updateInterval = this.p.random(50, 150);
    this.streamIndex = streamIndex;
    this.setToRandomSymbol();
  }

  setToRandomSymbol() {
    const charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ';
    this.value = charset[Math.floor(this.p.random(charset.length))];
  }

  update(formationStarted: boolean, numberBounds: any, streams: any[], symbolSize: number) {
    const currentTime = this.p.millis();
    
    if (!formationStarted) {
      this.y += this.speed;
      if (this.y >= numberBounds.maxY) {
        this.y = numberBounds.minY - symbolSize;
      }
    } else if (this.isForming) {
      const dx = this.targetX - this.x;
      const dy = this.targetY - this.y;
      const easing = 0.08;
      this.x += dx * easing;
      this.y += dy * easing;
      
      if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
        this.x = this.targetX;
        this.y = this.targetY;
        this.isForming = false;
      }
    } else {
      this.y += this.speed;
      if (this.y >= numberBounds.maxY) {
        this.y = numberBounds.minY;
      }
    }
    
    if (currentTime - this.lastUpdate > this.updateInterval) {
      if (!this.isForming) {
        this.setToRandomSymbol();
        const stream = streams[this.streamIndex];
        if (stream && this.first) {
          stream.symbols.forEach((symbol: Symbol, index: number) => {
            if (!symbol.first) {
              setTimeout(() => {
                symbol.value = this.value;
              }, index * 25);
            }
          });
        }
      }
      this.lastUpdate = currentTime;
    }
  }

  render(targetImage: p5.Graphics, formationStarted: boolean) {
    const pixelColor = targetImage.get(Math.floor(this.x), Math.floor(this.y));
    const isInNumber = pixelColor[0] > 0;

    if (!formationStarted || (formationStarted && isInNumber)) {
      this.p.fill(255, this.opacity);
      this.p.text(this.value, this.x, this.y);
    }
  }

  startForming(tx: number, ty: number) {
    this.isForming = true;
    this.targetX = tx;
    this.targetY = ty;
  }
}