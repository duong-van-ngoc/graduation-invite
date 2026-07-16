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
    // Giảm tốc độ ban đầu để pháo hoa nở ra chậm rãi, mềm mại và thanh lịch hơn
    const maxSpeed = isBig ? 4.8 : 3.2;
    const speed = Math.random() * maxSpeed + 1.2;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed - Math.random() * 1.5;
    this.alpha = 1;
    this.color = color;
    this.gravity = 0.04; // Giảm trọng lực để hạt rơi chậm, lơ lửng nhẹ nhàng
    // Giảm bớt ma sát để các hạt lửa bay xa và trôi nổi rộng hơn
    this.friction = 0.97;
    // Giảm độ phân rã để hạt pháo duy trì lâu hơn, lan xa hơn trước khi tắt
    this.decay = Math.random() * 0.01 + 0.004;
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

    // Vẽ quầng sáng tỏa nhẹ (bloom glow) - nhanh gấp 10 lần shadowBlur của Canvas
    ctx.globalAlpha = this.alpha * 0.25;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 2.2, 0, Math.PI * 2);
    ctx.fill();

    // Vẽ lõi hạt pháo sáng
    ctx.globalAlpha = this.alpha;
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
    // Tăng số steps lên (từ 40-55 thành 110-140) để quả pháo bay lên thật chậm rãi, thanh lịch, tránh bay vèo vèo quá nhanh
    const steps = 110 + Math.random() * 30;
    this.vx = dx / steps;
    this.vy = dy / steps;
    this.color = color;
    this.isDead = false;
    // 15% tỷ lệ nổ ra quả pháo hoa cầu vồng siêu to, 85% là pháo đơn sắc sắc nét (đỏ, xanh, tím...) để tránh nhàm chán
    this.isRainbow = Math.random() < 0.15;
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

    // Vẽ quầng sáng tỏa đầu quả đạn pháo
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // Vẽ nhân quả đạn pháo
    ctx.globalAlpha = 1.0;
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
      if (spawnTimer >= 3000) {
        spawnTimer = 0;
      }

      // ── NHỊP ĐIỆU PHÁO HOA ĐỀU ĐẶN 4 HƯỚNG BẮN (4-DIRECTION REGULAR RHYTHM) ──
      // Bắn pháo hoa đều đặn mỗi 110 frame (~1.8 giây ở 60fps), xoay vòng qua 4 điểm bắn chia đều dưới đáy màn hình
      if (spawnTimer % 110 === 0) {
        const launchIndex = Math.floor(spawnTimer / 110) % 4;
        let startX = 0;
        let targetX = 0;

        if (launchIndex === 0) {
          // Hướng 1: Góc dưới bên trái
          startX = canvas.width * 0.08;
          targetX = startX + Math.random() * (canvas.width * 0.25) + (canvas.width * 0.05);
        } else if (launchIndex === 1) {
          // Hướng 2: Trái trung tâm
          startX = canvas.width * 0.36;
          targetX = startX + (Math.random() - 0.5) * (canvas.width * 0.15);
        } else if (launchIndex === 2) {
          // Hướng 3: Phải trung tâm
          startX = canvas.width * 0.64;
          targetX = startX + (Math.random() - 0.5) * (canvas.width * 0.15);
        } else {
          // Hướng 4: Góc dưới bên phải
          startX = canvas.width * 0.92;
          targetX = startX - (Math.random() * (canvas.width * 0.25) + (canvas.width * 0.05));
        }

        const targetY = Math.random() * (canvas.height * 0.35) + (canvas.height * 0.15);
        rockets.push(new Rocket(startX, canvas.height, targetX, targetY, getRandomColor()));
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

      // Giới hạn số lượng hạt tối đa để đảm bảo hiệu năng cực mượt trên di động
      while (particles.length > 250) {
        particles.shift();
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
