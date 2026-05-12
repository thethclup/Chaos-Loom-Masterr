export interface Thread {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  type: 'base' | 'void' | 'splinter' | 'volatile';
  life: number;
  history: {x: number, y: number}[];
  radius: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number;
  maxLife: number;
  size: number;
}

export class LoomEngine {
  width: number = 0;
  height: number = 0;
  threads: Thread[] = [];
  particles: Particle[] = [];
  
  score: number = 0;
  multiplier: number = 1.0;
  instability: number = 0;
  highestCombo: number = 0;
  
  comboTimer: number = 0;
  nextSpawn: number = 60;
  
  colors = ['#ff4e00', '#8a2be2', '#00ffaa', '#ff0055'];

  init(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.threads = [];
    this.particles = [];
    this.score = 0;
    this.multiplier = 1.0;
    this.instability = 0;
    this.highestCombo = 0;
    
    // Spawn initial threads
    for(let i=0; i<3; i++) this.spawnThread();
  }

  resize(w: number, h: number) {
    this.width = w;
    this.height = h;
  }

  spawnThread(forceType?: 'void' | 'volatile') {
    const isVoid = Math.random() < 0.05 || forceType === 'void';
    const isVolatile = Math.random() < 0.1 || forceType === 'volatile';
    
    this.threads.push({
      id: Math.random(),
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      vx: (Math.random() - 0.5) * 5,
      vy: (Math.random() - 0.5) * 5,
      color: isVoid ? '#220044' : isVolatile ? '#ffaa00' : this.colors[Math.floor(Math.random() * this.colors.length)],
      type: isVoid ? 'void' : isVolatile ? 'volatile' : 'base',
      life: 1000,
      history: [],
      radius: isVoid ? 12 : 6
    });
  }

  fling(startX: number, startY: number, endX: number, endY: number) {
    // Fling nearest thread
    let nearest = null;
    let minDist = 100000;
    for (const t of this.threads) {
      const d = Math.hypot(t.x - startX, t.y - startY);
      if (d < minDist && d < 100) { // must be relatively close to grab
        minDist = d;
        nearest = t;
      }
    }

    const dx = endX - startX;
    const dy = endY - startY;

    if (nearest) {
      nearest.vx += dx * 0.1;
      nearest.vy += dy * 0.1;
      this.instability += 1; // Direct interference adds instability
    } else {
      // Create new thread at start if empty space
      const newT: Thread = {
        id: Math.random(),
        x: startX,
        y: startY,
        vx: dx * 0.1,
        vy: dy * 0.1,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        type: 'base',
        life: 1000,
        history: [],
        radius: 6
      };
      this.threads.push(newT);
      this.instability += 2;
    }
  }

  createExplosion(x: number, y: number, color: string, intensity: number) {
    for(let i=0; i<intensity; i++) {
        this.particles.push({
            x, y,
            vx: (Math.random() - 0.5) * 10,
            vy: (Math.random() - 0.5) * 10,
            color,
            life: Math.random() * 30 + 10,
            maxLife: 40,
            size: Math.random() * 4 + 1
        });
    }
  }

  update() {
    this.nextSpawn--;
    if (this.nextSpawn <= 0) {
      this.spawnThread();
      this.nextSpawn = 60 - Math.min(40, this.instability / 2); // Spawns faster as instability rises
    }

    if (this.comboTimer > 0) {
      this.comboTimer--;
      if (this.comboTimer <= 0) {
        this.multiplier = 1.0;
      }
    }

    // Passive instability growth
    this.instability += this.threads.length * 0.005;

    // Update threads
    for (let i = this.threads.length - 1; i >= 0; i--) {
      const t = this.threads[i];
      
      t.history.push({x: t.x, y: t.y});
      if (t.history.length > 20) t.history.shift();

      t.x += t.vx;
      t.y += t.vy;

      // Chaos Physics: erratic movement
      t.vx += (Math.random() - 0.5) * 0.5;
      t.vy += (Math.random() - 0.5) * 0.5;
      
      // Friction
      t.vx *= 0.99;
      t.vy *= 0.99;

      // Bounding box
      if (t.x < 0) { t.x = 0; t.vx *= -1; }
      if (t.x > this.width) { t.x = this.width; t.vx *= -1; }
      if (t.y < 0) { t.y = 0; t.vy *= -1; }
      if (t.y > this.height) { t.y = this.height; t.vy *= -1; }

      // Check collisions
      for (let j = i - 1; j >= 0; j--) {
        const other = this.threads[j];
        const dx = t.x - other.x;
        const dy = t.y - other.y;
        const dist = Math.hypot(dx, dy);

        if (dist < t.radius + other.radius) {
            // Collision response
            this.handleCollision(t, other, i, j);
        }
      }
    }

    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        p.size *= 0.95;
        if (p.life <= 0) this.particles.splice(i, 1);
    }
    
    // Bounds check arrays
    if(this.threads.length > 100) {
        this.threads.splice(0, this.threads.length - 100);
    }
  }

  handleCollision(t1: Thread, t2: Thread, idx1: number, idx2: number) {
      const speed = Math.hypot(t1.vx, t1.vy) + Math.hypot(t2.vx, t2.vy);
      
      // Bounce
      const tempX = t1.vx;
      const tempY = t1.vy;
      t1.vx = t2.vx * 0.8;
      t1.vy = t2.vy * 0.8;
      t2.vx = tempX * 0.8;
      t2.vy = tempY * 0.8;

      if (speed > 5) {
          // Chain Reaction
          this.createExplosion((t1.x + t2.x)/2, (t1.y + t2.y)/2, t1.color, speed * 2);
          
          this.score += 10 * this.multiplier * speed;
          this.multiplier += 0.1;
          this.comboTimer = 120; // 2 seconds at 60fps
          if (this.multiplier > this.highestCombo) this.highestCombo = this.multiplier;
          
          this.instability += speed * 0.1;

          // Mutations
          if (t1.type === 'volatile' || t2.type === 'volatile') {
             this.instability += 5;
             this.createExplosion((t1.x + t2.x)/2, (t1.y + t2.y)/2, '#ffffff', 20);
          }

          if (t1.type === 'void') {
              // consumes t2
              t1.radius += 1;
              this.instability -= 2; // Void stabilizes by consuming
              this.score += 500 * this.multiplier;
              t2.life = 0; // mark for deletion later, or splice now
          }
      }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'rgba(10, 5, 2, 0.2)'; // trailing effect
    ctx.fillRect(0, 0, this.width, this.height);

    // Grid effect
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    const gridStep = 40;
    const offsetX = (Date.now() / 50) % gridStep;
    const offsetY = (Date.now() / 50) % gridStep;

    ctx.beginPath();
    for (let x = offsetX; x < this.width; x += gridStep) {
        ctx.moveTo(x, 0); ctx.lineTo(x, this.height);
    }
    for (let y = offsetY; y < this.height; y += gridStep) {
        ctx.moveTo(0, y); ctx.lineTo(this.width, y);
    }
    ctx.stroke();

    ctx.globalCompositeOperation = 'screen';

    // Draw lines between close threads
    ctx.lineWidth = 0.5;
    for(let i=0; i<this.threads.length; i++) {
        for(let j=i+1; j<this.threads.length; j++) {
            const t1 = this.threads[i];
            const t2 = this.threads[j];
            const d = Math.hypot(t1.x-t2.x, t1.y-t2.y);
            if (d < 80) {
                ctx.strokeStyle = `rgba(255,255,255,${0.2 * (1 - d/80)})`;
                ctx.beginPath();
                ctx.moveTo(t1.x, t1.y);
                ctx.lineTo(t2.x, t2.y);
                ctx.stroke();
            }
        }
    }

    // Draw threads
    for (const t of this.threads) {
        if (t.life <= 0) continue; // Skip dead ones

        // Trail
        if (t.history.length > 0) {
            ctx.beginPath();
            ctx.moveTo(t.history[0].x, t.history[0].y);
            for (let i = 1; i < t.history.length; i++) {
                ctx.lineTo(t.history[i].x, t.history[i].y);
            }
            ctx.strokeStyle = t.color;
            ctx.lineWidth = t.radius;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.stroke();
        }

        // Head
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.radius * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.shadowColor = t.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    // Clean up dead threads here to avoid index shift mid-draw
    this.threads = this.threads.filter(t => t.life > 0);

    // Draw particles
    for (const p of this.particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
    }
    
    ctx.globalCompositeOperation = 'source-over';
  }
}
