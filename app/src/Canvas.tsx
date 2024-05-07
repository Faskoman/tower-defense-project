import { useRef, useEffect } from "react";
import { waypoints } from "./waypoints";
import Bee from "./Bee";
import "./bee.scss";

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
      center: { x: number; y: number };
      constructor({ position = { x: 0, y: 0 } }) {
        this.position = position;
        this.width = 50;
        this.height = 50;
        this.waypointIndex = 0;
        this.center = {
          x: this.position.x + this.width / 2,
          y: this.position.y + this.height / 2,
        };
      }

      draw() {
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
        const yDistance = waypoint.y - this.center.y;
        const xDistance = waypoint.x - this.center.x;
        const angle = Math.atan2(yDistance, xDistance);

        this.position.x += Math.cos(angle);
        this.position.y += Math.sin(angle);
        this.center = {
          x: this.position.x + this.width / 2,
          y: this.position.y + this.height / 2,
        };

        if (
          Math.round(this.center.x) === Math.round(waypoint.x) &&
          Math.round(this.center.y) === Math.round(waypoint.y) &&
          this.waypointIndex < waypoints.length - 1
        ) {
          this.waypointIndex++;
        }
      }
    }

    const enemies: Enemy[] = [];
    for (let i = 1; i < 11; i++) {
      const xOffset = i * 150;
      enemies.push(
        new Enemy({
          position: { x: waypoints[0].x - xOffset, y: waypoints[0].y },
        })
      );
    }

    function animate() {
      requestAnimationFrame(animate);

      ctx!.drawImage(map, 0, 0);
      enemies.forEach((enemy) => {
        enemy.update();
      });
    }
  }, []);

  return (
    <canvas
      className="canvas"
      ref={canvasRef}
      width={1200}
      height={960}
    ></canvas>
  );
}

export default Canvas;
