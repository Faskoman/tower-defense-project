import { useRef, useEffect } from "react";
import { waypoint, waypoints } from "./waypoints";

function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const map = new Image();

    map.onload = () => {
      animate();
    };

    map.src = "/src/assets/gameMapZoomed.png";

    class Enemy {
      position: { x: number; y: number };
      width: number;
      height: number;
      waypointIndex: number;
      constructor({ position = { x: 0, y: 0 } }) {
        this.position = position;
        this.width = 50;
        this.height = 50;
        this.waypointIndex = 0;
      }

      draw() {
        ctx!.fillStyle = "red";
        ctx!.fillRect(
          this.position.x,
          this.position.y,
          this.width,
          this.height
        );
      }

      update() {
        this.draw();

        const waypoint = waypoints[this.waypointIndex];
        const yDistance = waypoint.y - this.position.y;
        const xDistance = waypoint.x - this.position.x;
        const angle = Math.atan2(yDistance, xDistance);

        this.position.x += Math.cos(angle);
        this.position.y += Math.sin(angle);

        if (
          this.position.x === waypoint.x &&
          this.position.y === waypoint.y &&
          this.waypointIndex < waypoints.length - 1
        ) {
          this.waypointIndex++;
        }
      }
    }

    const enemy = new Enemy({ position: { x: waypoints[0].x, y: waypoints[0].y } });

    function animate() {
      requestAnimationFrame(animate);

      ctx!.drawImage(map, 0, 0);
      enemy.update();
    }
  }, []);

  return <canvas ref={canvasRef} width={1200} height={960}></canvas>;
}

export default Canvas;
