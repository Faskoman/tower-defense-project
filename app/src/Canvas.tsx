import { useRef, useEffect } from "react";
import { waypoints } from "./waypoints";
import "./canvas.scss";
import { placements } from "./placements";

function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const map = new Image();
    const bee = new Image();

    const placement2D = [];
    const tilesInARow = 40;
    const mouse = {
      x: 0,
      y: 0,
    };

    for (let i = 0; i < placements.length; i += tilesInARow) {
      placement2D.push(placements.slice(i, i + tilesInARow));
    }

    class PlacementTile {
      position = { x: 0, y: 0 };
      size: number;
      color: string;
      constructor({ position = { x: 0, y: 0 } }) {
        this.position = position;
        this.size = 32;
        this.color = "rgba(255, 255, 255, 0.3)";
      }

      draw() {
        ctx!.fillStyle = this.color;
        ctx!.fillRect(this.position.x, this.position.y, this.size, this.size);
      }

      update(mouse: { x: number; y: number }) {
        this.draw();

        if (
          mouse.x > this.position.x &&
          mouse.x < this.position.x + this.size &&
          mouse.y > this.position.y &&
          mouse.y < this.position.y + this.size
        ) {
          console.log("Hovered!")
        }
      }
    }

    const placementTiles: PlacementTile[] = [];

    placement2D.forEach((row, y) => {
      row.forEach((symbol, x) => {
        if (symbol === 1) {
          placementTiles.push(
            new PlacementTile({
              position: {
                x: x * 32,
                y: y * 32,
              },
            })
          );
        }
      });
    });

    map.onload = () => {
      animate();
    };

    bee.src = "/src/assets/bee2.png";
    map.src = "/src/assets/gameMapZoomed.png";

    class Enemy {
      position: { x: number; y: number };
      width: number;
      height: number;
      waypointIndex: number;
      center: { x: number; y: number };
      component: any;
      constructor({ position = { x: 0, y: 0 } }) {
        this.position = position;
        this.width = 80;
        this.height = 80;
        this.waypointIndex = 0;
        this.center = {
          x: this.position.x + this.width / 2,
          y: this.position.y + this.height / 2,
        };
      }

      draw() {
        ctx!.drawImage(
          bee,
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
    for (let i = 1; i < 21; i++) {
      const xOffset = i * 100;
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

      placementTiles.forEach((tile) => {
        tile.update(mouse);
      });
    }

    const handleMouseHover = (event: { clientX: number; clientY: number }) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    };

    canvas.addEventListener("mousemove", handleMouseHover);

    return () => {
      canvas.removeEventListener("mousemove", handleMouseHover);
    };
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
