type Particle = {
  x: number;
  y: number;
  z: number;
  size: number;
  warm: boolean;
  opacity: number;
  delay: number;
  burstRadius: number;
  swirl: number;
  trail: boolean;
};

export const SNAP_TIME = 1.12;
export const ORBIT_TIME = 3.1;
const TAU = Math.PI * 2;
const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};

// The three arms meet at exactly the same junction as the original symbol.
const SHARDS = [
  { from: [18, 50], to: [59, 50], offset: [-1.08, 0], rotation: -.42 },
  { from: [59, 50], to: [81, 12], offset: [.7, -.86], rotation: .62 },
  { from: [59, 50], to: [81, 88], offset: [.7, .86], rotation: -.62 },
];

export function createResearchAnimation() {
  let seed = 4127;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  const particles: Particle[] = [];
  for (let index = 0; index < 2200; index++) {
    const theta = random() * TAU;
    const ring = Math.floor(random() * 9);
    const tilt = (ring / 9 - .5) * 2.6;
    const radius = .64 + random() * .28;
    const spread = (random() - .5) * .028;
    const y = Math.sin(theta) * radius;
    particles.push({
      x: Math.cos(theta) * radius,
      y: y * Math.cos(tilt) + spread,
      z: y * Math.sin(tilt) + spread,
      size: random() < .965 ? .45 + random() * .5 : 1.2,
      warm: random() > .28,
      opacity: .3 + random() * .7,
      delay: random() * .12,
      burstRadius: .95 + random() * .55,
      swirl: (random() - .5) * 1.1,
      trail: index % 6 === 0,
    });
  }

  return function draw(
    context: CanvasRenderingContext2D,
    width: number,
    height: number,
    elapsed: number,
    pointerX = 0,
    pointerY = 0,
  ) {
    context.clearRect(0, 0, width, height);
    const cx = width / 2;
    const cy = height / 2;
    const scale = Math.min(width * .49, height * .46);
    const impactTime = elapsed - SNAP_TIME;

    // A single shock wave marks the collision; it does not repeat in orbit.
    if (impactTime >= 0 && impactTime < .65) {
      const progress = impactTime / .65;
      const radius = 8 + (1 - Math.pow(1 - progress, 3)) * scale * 1.3;
      context.save();
      context.translate(cx, cy);
      context.scale(1, .74);
      context.strokeStyle = `rgba(255,140,84,${Math.pow(1 - progress, 2) * .45})`;
      context.lineWidth = 1;
      context.beginPath();
      context.arc(0, 0, radius, 0, TAU);
      context.stroke();
      context.restore();
    }

    if (impactTime >= 0) {
      const orbitTime = Math.max(0, elapsed - SNAP_TIME);
      const angle = .0325 + orbitTime * .035 + pointerX * .04;
      const tilt = -.38 + pointerY * .04;
      const rotation = -.42;
      const projected = particles.map(particle => {
        const x = particle.x * Math.cos(angle) + particle.z * Math.sin(angle);
        const z = -particle.x * Math.sin(angle) + particle.z * Math.cos(angle);
        const y = particle.y * Math.cos(tilt) - z * Math.sin(tilt);
        const depth = particle.y * Math.sin(tilt) + z * Math.cos(tilt);
        const perspective = 2.8 / (2.8 - depth * .32);
        return {
          particle,
          x: (x * Math.cos(rotation) - y * Math.sin(rotation)) * scale * perspective,
          y: (x * Math.sin(rotation) + y * Math.cos(rotation)) * scale * perspective,
          depth,
        };
      }).sort((a, b) => a.depth - b.depth);

      for (const point of projected) {
        const particle = point.particle;
        const age = impactTime - particle.delay;
        if (age < 0) continue;
        const settle = smooth((age - .3) / (ORBIT_TIME - SNAP_TIME - .42));
        const expansion = 1 - Math.exp(-age * 8.5);
        const direction = Math.atan2(point.y, point.x) + particle.swirl * (1 - settle);
        const burstRadius = scale * particle.burstRadius * expansion;
        const burstX = Math.cos(direction) * burstRadius;
        const burstY = Math.sin(direction) * burstRadius * .74;
        const x = cx + burstX * (1 - settle) + point.x * settle;
        const y = cy + burstY * (1 - settle) + point.y * settle;
        const alpha = Math.max(.08, (.36 + point.depth * .32) * particle.opacity)
          * smooth(age / .075) * (1 + (1 - settle) * .8);
        const color = particle.warm ? `255,${125 + Math.round(point.depth * 24)},64` : "216,216,216";

        if (particle.trail && age < .65) {
          const length = (1 - settle) * Math.exp(-age * 2.5) * scale * .055;
          context.strokeStyle = `rgba(${color},${alpha * .35})`;
          context.lineWidth = .7;
          context.beginPath();
          context.moveTo(x - Math.cos(direction) * length, y - Math.sin(direction) * length * .74);
          context.lineTo(x, y);
          context.stroke();
        }
        context.fillStyle = `rgba(${color},${alpha * (particle.warm ? 1 : .65)})`;
        context.beginPath();
        context.arc(x, y, particle.size * (1 + point.depth * .25), 0, TAU);
        context.fill();
      }
    }

    // Three separate pieces accelerate into place, then rebound as one mark.
    const convergence = clamp((elapsed - .28) / (SNAP_TIME - .28));
    const separation = 1 - Math.pow(convergence, 4);
    const fade = smooth(elapsed / .2);
    const rebound = impactTime >= 0 && impactTime < .6
      ? 1 - .12 * Math.exp(-impactTime * 9) * Math.cos(impactTime * 24)
      : 1;
    const logoScale = width < 440 ? .54 : .64;
    context.save();
    context.translate(cx, cy);
    context.scale(rebound, rebound);
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = `rgba(255,122,54,${fade})`;
    context.lineWidth = 8;
    for (const shard of SHARDS) {
      const middleX = (shard.from[0] + shard.to[0]) / 2;
      const middleY = (shard.from[1] + shard.to[1]) / 2;
      context.save();
      context.translate(
        shard.offset[0] * scale * separation + (middleX - 50) * logoScale,
        shard.offset[1] * scale * separation + (middleY - 50) * logoScale,
      );
      context.rotate(shard.rotation * separation);
      context.scale(logoScale, logoScale);
      context.beginPath();
      context.moveTo(shard.from[0] - middleX, shard.from[1] - middleY);
      context.lineTo(shard.to[0] - middleX, shard.to[1] - middleY);
      context.stroke();
      context.restore();
    }
    context.restore();
  };
}
