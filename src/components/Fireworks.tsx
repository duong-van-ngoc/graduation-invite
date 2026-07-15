"use client";

import { useEffect, useRef } from "react";

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  gravity: number;
  friction: number;
  decay: number;
  size: number;
  trail: { x: number; y: number }[];

  constructor(x: number, y: number, color: string, isBig: boolean = false) {
    this.x = x;
    this.y = y;
    const angle = Math.random() * Math.PI * 2;
    // Tăng tốc độ ban đầu cho pháo nở to và lan rộng hơn
    const maxSpeed = isBig ? 7.5 : 5.5;
    const speed = Math.random() * maxSpeed + 2.5;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed - Math.random() * 2;
    this.alpha = 1;
    this.color = color;
    this.gravity = 0.05;
    // Giảm bớt ma sát để các hạt lửa bay xa và trôi nổi rộng hơn
    this.friction = 0.965;
    // Giảm độ phân rã để hạt pháo duy trì lâu hơn, lan xa hơn trước khi tắt
    this.decay = Math.random() * 0.012 + 0.005;
    this.size = Math.random() * 1.5 + 1.2;
    this.trail = [];
  }

  update() {
    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > 5) {
      this.trail.shift();
    }
    this.vx *= this.friction;
    this.vy *= this.friction;
    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= this.decay;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.shadowBlur = 6;
    ctx.shadowColor = this.color;
    ctx.fillStyle = this.color;

    // Vẽ điểm sáng hạt pháo
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();

    // Vẽ đuôi hạt pháo bay
    if (this.trail.length > 1) {
      ctx.beginPath();
      ctx.moveTo(this.trail[0].x, this.trail[0].y);
      for (let i = 1; i < this.trail.length; i++) {
        ctx.lineTo(this.trail[i].x, this.trail[i].y);
      }
      ctx.strokeStyle = this.color;
      ctx.lineWidth = this.size * 0.6;
      ctx.stroke();
    }
    ctx.restore();
  }
}

class Rocket {
  x: number;
  y: number;
  tx: number;
  ty: number;
  vx: number;
  vy: number;
  color: string;
  isDead: boolean;
  isRainbow: boolean;
  trail: { x: number; y: number }[];

  constructor(sx: number, sy: number, tx: number, ty: number, color: string) {
    this.x = sx;
    this.y = sy;
    this.tx = tx;
    this.ty = ty;
    const dx = tx - sx;
    const dy = ty - sy;
    const steps = 40 + Math.random() * 15;
    this.vx = dx / steps;
    this.vy = dy / steps;
    this.color = color;
    this.isDead = false;
    // 35% tỷ lệ nổ ra quả pháo hoa cầu vồng siêu to khổng lồ
    this.isRainbow = Math.random() < 0.35;
    this.trail = [];
  }

  update() {
    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > 10) {
      this.trail.shift();
    }
    this.x += this.vx;
    this.y += this.vy;

    const dx = this.tx - this.x;
    const dy = this.ty - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 6 || this.y <= this.ty) {
      this.isDead = true;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.shadowBlur = 8;
    ctx.shadowColor = this.color;
    ctx.fillStyle = this.color;

    // Vẽ đầu quả pháo
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fill();

    // Vẽ đuôi khói của quả pháo bay lên
    if (this.trail.length > 1) {
      ctx.beginPath();
      ctx.moveTo(this.trail[0].x, this.trail[0].y);
      for (let i = 1; i < this.trail.length; i++) {
        ctx.lineTo(this.trail[i].x, this.trail[i].y);
      }
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }
    ctx.restore();
  }
}

export default function Fireworks() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let rockets: Rocket[] = [];
    let particles: Particle[] = [];

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    // Tông màu pháo hoa đa sắc cực kỳ rực rỡ, phát sáng neon siêu nổi bật
    const colors = [
      "#FF0055", // Đỏ Neon cực sáng
      "#00FF66", // Xanh lá Neon cực sáng
      "#00FFFF", // Xanh ngọc Cyan sáng rực
      "#FFFF00", // Vàng chanh sáng chói
      "#FF00FF", // Tím hồng Magenta Neon
      "#FF9900", // Cam Neon rực rỡ
      "#9900FF", // Tím Neon đậm đà
      "#0099FF", // Xanh Sky sáng rực
      "#FF00AA", // Hồng rực rỡ
      "#FFFFFF", // Trắng tinh khiết phát sáng
    ];

    const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

    let spawnTimer = 0;

    const animate = () => {
      // Clear canvas và giữ nền trong suốt hoàn toàn
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      spawnTimer++;
      // Định kỳ bắn từ góc trái và góc phải lên nhiều hơn (mỗi 35 frame)
      if (spawnTimer % 35 === 0 || spawnTimer === 10) {
        // Góc dưới bên trái bắn lên phía giữa trái
        const leftTargetX = Math.random() * (canvas.width * 0.25) + (canvas.width * 0.05);
        const leftTargetY = Math.random() * (canvas.height * 0.35) + (canvas.height * 0.15);
        rockets.push(
          new Rocket(0, canvas.height, leftTargetX, leftTargetY, getRandomColor())
        );

        // Góc dưới bên phải bắn lên phía giữa phải
        setTimeout(() => {
          if (!canvas) return;
          const rightTargetX = canvas.width - (Math.random() * (canvas.width * 0.25) + (canvas.width * 0.05));
          const rightTargetY = Math.random() * (canvas.height * 0.35) + (canvas.height * 0.15);
          rockets.push(
            new Rocket(canvas.width, canvas.height, rightTargetX, rightTargetY, getRandomColor())
          );
        }, 300);
      }

      // Cập nhật & Vẽ đạn pháo
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.update();
        r.draw(ctx);

        if (r.isDead) {
          // Số lượng hạt tàn pháo tương ứng: Quả cầu vồng siêu to (isRainbow) sẽ bắn ra nhiều hạt hơn hẳn
          const numParticles = r.isRainbow ? 140 : 90;
          for (let p = 0; p < numParticles; p++) {
            // Nếu là quả pháo cầu vồng thì mỗi hạt một màu ngẫu nhiên, nếu không thì nổ đơn sắc (đỏ là đỏ, xanh là xanh)
            const particleColor = r.isRainbow ? getRandomColor() : r.color;
            particles.push(new Particle(r.x, r.y, particleColor, r.isRainbow));
          }
          rockets.splice(i, 1);
        }
      }

      // Cập nhật & Vẽ các hạt tàn pháo hoa
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw(ctx);

        if (p.alpha <= 0) {
          particles.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-10"
    />
  );
}
