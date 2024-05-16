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
