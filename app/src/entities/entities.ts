export interface Building {
  position: { x: number; y: number };
  size: number;
  projectiles: Projectile[];
  center: { x: number; y: number };
  radius: number;
  target: Enemy | null;
  frames: number;
  projectileFired: boolean;
}

export function createBuilding({ position = { x: 0, y: 0 } }): Building {
  const size = 64;
  const center = {
    x: position.x + size / 2,
    y: position.y + size / 2,
  };
  const projectiles: Projectile[] = [];
  const radius = 250;
  const target = null;
  const frames = 0;
  const projectileFired = false;

  return {
    position,
    size,
    projectiles,
    center,
    radius,
    target,
    frames,
    projectileFired,
  };
}

export function drawBuilding(
  ctx: CanvasRenderingContext2D,
  building: Building,
  zapper: HTMLImageElement
) {
  ctx.drawImage(
    zapper,
    building.position.x - building.size / 4.5,
    building.position.y,
    building.size + building.size / 2,
    building.size
  );
  ctx.beginPath();
  ctx.arc(
    building.center.x,
    building.center.y,
    building.radius,
    0,
    Math.PI * 2
  );
  ctx.fillStyle = "rgba(255, 255, 255, .05)";
  ctx.fill();
}

export function updateBuilding(
  ctx: CanvasRenderingContext2D,
  building: Building,
  zapper: HTMLImageElement,
  projectiles: Projectile[],
  frames: number
) {
  drawBuilding(ctx, building, zapper);
  if (frames % 100 === 0 && !building.projectileFired && building.target) {
    createProjectile({
      position: {
        x: building.center.x,
        y: building.center.y,
      },
      enemy: building.target,
    }).then((newProjectile) => {
      projectiles.push(newProjectile);
      building.projectileFired = true;
      setTimeout(() => {
        building.projectileFired = false;
      }, 1000);
    });
  }
}

export interface Enemy {
  position: { x: number; y: number };
  size: number;
  waypointIndex: number;
  center: { x: number; y: number };
  health: number;
  velocity: { x: number; y: number };
  draw: (ctx: CanvasRenderingContext2D, bee: HTMLImageElement) => void;
  update: (
    ctx: CanvasRenderingContext2D,
    bee: HTMLImageElement,
    waypoints: {
      x: number;
      y: number;
    }[],
    enemiesSpeed: number
  ) => void;
}

export function createEnemy({
  position = { x: 0, y: 0 },
}: {
  position?: { x: number; y: number };
}): Enemy {
  const size = 80;
  let waypointIndex = 0;
  const center = {
    x: position.x + size / 2,
    y: position.y + size / 2,
  };
  let health = 100;
  const velocity = { x: 0, y: 0 };

  function draw(ctx: CanvasRenderingContext2D, bee: HTMLImageElement) {
    ctx.drawImage(bee, position.x, position.y, size, size);
  }

  function update(
    ctx: CanvasRenderingContext2D,
    bee: HTMLImageElement,
    waypoints: {
      x: number;
      y: number;
    }[],
    enemiesSpeed: number
  ) {
    draw(ctx, bee);

    const waypoint = waypoints[waypointIndex];
    const yDistance = waypoint.y - center.y;
    const xDistance = waypoint.x - center.x;
    const angle = Math.atan2(yDistance, xDistance);

    velocity.x = Math.cos(angle) * enemiesSpeed;
    velocity.y = Math.sin(angle) * enemiesSpeed;

    position.x += velocity.x;
    position.y += velocity.y;
    center.x = position.x + size / 2;
    center.y = position.y + size / 2;

    if (
      Math.abs(Math.round(center.x) - Math.round(waypoint.x)) <
        Math.abs(velocity.x) &&
      Math.abs(Math.round(center.y) - Math.round(waypoint.y)) <
        Math.abs(velocity.y) &&
      waypointIndex < waypoints.length - 1
    ) {
      waypointIndex++;
    }
  }

  return {
    position,
    size,
    waypointIndex,
    center,
    health,
    velocity,
    draw,
    update,
  };
}

export interface Projectile {
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  enemy: Enemy;
  size: number;
  draw(ctx: CanvasRenderingContext2D): void;
  update(ctx: CanvasRenderingContext2D): void;
}

export function createProjectile({
  position,
  enemy,
}: {
  position: {
    x: number;
    y: number;
  };
  enemy: Enemy;
}): Promise<Projectile> {
  return loadImageAsync("./src/assets/electricBolt2.png").then(
    (electricBolt: HTMLImageElement) => {
      const velocity = { x: 0, y: 0 };
      const size = 40;

      function draw(ctx: CanvasRenderingContext2D) {
        ctx.drawImage(electricBolt, position.x, position.y, size, size);
      }

      function update(ctx: CanvasRenderingContext2D) {
        draw(ctx);

        const angle = Math.atan2(
          enemy.position.y - position.y,
          enemy.position.x - position.x
        );

        const projectileSpeed = 3;
        velocity.x = Math.cos(angle) * projectileSpeed;
        velocity.y = Math.sin(angle) * projectileSpeed;

        position.x += velocity.x;
        position.y += velocity.y;
      }

      return {
        position,
        velocity,
        enemy,
        size,
        draw,
        update,
      };
    }
  );
}

function loadImageAsync(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = url;
  });
}
