import p5 from 'p5';
import { Stream } from './Stream';

export class Symbol {
  x: number;
  y: number;
  value: string;
  speed: number;
  opacity: number;
  first: boolean;
  targetX: number;
  targetY: number;
  isForming: boolean;
  lastUpdate: number;
  updateInterval: number;
  streamIndex: number;
  private p: p5;
  private streams: Stream[];
  private numberBounds: { minX: number; maxX: number; minY: number; maxY: number };
  private symbolSize: number;
  
  constructor(
    p: p5,
    x: number,
    y: number,
    speed: number,
    first: boolean,
    streamIndex: number,
    streams: Stream[],
    numberBounds: { minX: number; maxX: number; minY: number; maxY: number },
    symbolSize: number
  ) {
    this.p = p;
    this.x = x;
    this.y = y;
    this.value = '';
    this.speed = speed;
    this.first = first;
    this.opacity = first ? 255 : p.random(70, 100);
    this.targetX = x;
    this.targetY = y;
    this.isForming = false;
    this.lastUpdate = p.millis();
    this.updateInterval = p.random(50, 150);
    this.streamIndex = streamIndex;
    this.streams = streams;
    this.numberBounds = numberBounds;
    this.symbolSize = symbolSize;
    this.setToRandomSymbol();
  }

  setToRandomSymbol() {
    const charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ';
    this.value = charset[Math.floor(this.p.random(charset.length))];
  }

  update() {
    const currentTime = this.p.millis();
    
    if (!this.isForming) {
      this.y += this.speed;
      if (this.y >= this.numberBounds.maxY) {
        this.y = this.numberBounds.minY - this.symbolSize;
      }
    } else {
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
    }
    
    if (currentTime - this.lastUpdate > this.updateInterval) {
      if (!this.isForming) {
        this.setToRandomSymbol();
        const stream = this.streams[this.streamIndex];
        if (stream && this.first) {
          stream.propagateSymbol(this.value);
        }
      }
      this.lastUpdate = currentTime;
    }
  }

  render(targetImage: p5.Graphics) {
    const pixelColor = targetImage.get(Math.floor(this.x), Math.floor(this.y));
    const isInNumber = pixelColor[0] > 0;

    if (!this.isForming || (this.isForming && isInNumber)) {
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