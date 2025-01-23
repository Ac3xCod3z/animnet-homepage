import p5 from 'p5';
import { SymbolProps } from './types';
import { SymbolState, SymbolPosition, SymbolConfig } from './symbol/types';
import { getRandomSymbol, calculateNewPosition } from './symbol/utils';

export class Symbol {
  public x: number;
  public y: number;
  private state: SymbolState;
  private position: SymbolPosition;
  private config: SymbolConfig;
  private p: p5;
  private isDissolving: boolean = false;

  constructor({ x, y, speed, first, streamIndex, p }: SymbolProps) {
    this.p = p;
    this.x = x;
    this.y = y;
    
    this.position = {
      x,
      y,
      targetX: x,
      targetY: y
    };

    this.config = {
      speed,
      first,
      updateInterval: this.p.random(50, 150),
      streamIndex
    };

    this.state = {
      value: '',
      opacity: first ? 255 : this.p.random(70, 100),
      isForming: false,
      lastUpdate: this.p.millis()
    };

    this.setToRandomSymbol();
  }

  startDissolving() {
    this.isDissolving = true;
    this.state.isForming = false;
  }

  updateDissolution(progress: number) {
    if (this.isDissolving) {
      this.state.opacity = this.p.map(progress, 0, 1, this.state.opacity, 0);
      this.config.speed *= 1.01;
    }
  }

  setToRandomSymbol() {
    this.state.value = getRandomSymbol(this.p);
  }

  update(formationStarted: boolean, numberBounds: any, streams: any[], symbolSize: number) {
    const currentTime = this.p.millis();
    
    if (this.isDissolving) {
      // During dissolution, symbols fall down
      this.y += this.config.speed;
      if (this.y >= numberBounds.maxY) {
        this.y = numberBounds.minY - symbolSize;
      }
    } else if (!formationStarted) {
      // Initial rain effect
      this.y += this.config.speed;
      if (this.y >= numberBounds.maxY) {
        this.y = numberBounds.minY - symbolSize;
      }
    } else if (this.state.isForming) {
      // Moving to form the number
      const { x, y, hasReachedTarget } = calculateNewPosition(
        { x: this.x, y: this.y },
        { x: this.position.targetX, y: this.position.targetY }
      );
      
      this.x = x;
      this.y = y;
      
      if (hasReachedTarget) {
        this.x = this.position.targetX;
        this.y = this.position.targetY;
        this.state.isForming = false;
      }
    }
    
    // Regular symbol updates for the matrix effect
    if (currentTime - this.state.lastUpdate > this.config.updateInterval && !this.isDissolving) {
      this.setToRandomSymbol();
      const stream = streams[this.config.streamIndex];
      if (stream && this.config.first) {
        stream.symbols.forEach((symbol: Symbol, index: number) => {
          if (!symbol.config.first) {
            setTimeout(() => {
              symbol.state.value = this.state.value;
            }, index * 25);
          }
        });
      }
      this.state.lastUpdate = currentTime;
    }
  }

  render(targetImage: p5.Graphics, formationStarted: boolean) {
    const pixelColor = targetImage.get(Math.floor(this.x), Math.floor(this.y));
    const isInNumber = pixelColor[0] > 0;

    if (!formationStarted || (formationStarted && isInNumber) || this.isDissolving) {
      this.p.fill(255, this.state.opacity);
      this.p.text(this.state.value, this.x, this.y);
    }
  }

  startForming(tx: number, ty: number) {
    this.state.isForming = true;
    this.position.targetX = tx;
    this.position.targetY = ty;
  }
}