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
      isOccipied: boolean;
      constructor({ position = { x: 0, y: 0 } }) {
        this.position = position;
        this.size = 64;
        this.color = "transparent";
        this.isOccipied = false;
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
          this.color = "rgba(255, 255, 255, 0.4)";
        } else {
          this.color = "transparent";
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
    map.src = "/src/assets/gameMapZoomed2.png";

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

    class Projectile {
      position: { x: number; y: number };
      velocity: { x: number; y: number };
      enemy: Enemy;
      constructor({ position = { x: 0, y: 0 }, enemy }: { position?: { x: number; y: number }; enemy: Enemy }) {
        this.position = position;
        this.velocity = {
          x: 0,
          y: 0,
        };
        this.enemy = enemy;
      }

      draw() {
        ctx?.beginPath();
        ctx!.arc(this.position.x, this.position.y, 10, 0, Math.PI * 2);
        ctx!.fillStyle = "red";
        ctx?.fill();
      }

      update() {
        this.draw();

        const angle = Math.atan2(
          enemies[0].center.y - this.position.y,
          enemies[0].center.x - this.position.x
        );

        this.velocity.x = Math.cos(angle);
        this.velocity.y = Math.sin(angle);

        this.position.x += this.velocity.x * 2;
        this.position.y += this.velocity.y * 2;
      }
    }

    class Building {
      position: { x: number; y: number };
      size: number;
      projectiles: Projectile[];
      center: { x: number; y: number };
      constructor({ position = { x: 0, y: 0 } }) {
        this.position = position;
        this.size = 64;
        this.center = {
          x: this.position.x + this.size / 2,
          y: this.position.y + this.size / 2,
        };
        this.projectiles = [
          new Projectile({
            position: {
              x: this.center.x,
              y: this.center.y,
            },
            enemy: enemies[0],
          }),
        ];
      }

      draw() {
        ctx!.fillStyle = "blue";
        ctx?.fillRect(this.position.x, this.position.y, this.size, this.size);
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

    const buildings: Building[] = [];
    let activeTile: any = undefined;

    function animate() {
      requestAnimationFrame(animate);

      ctx!.drawImage(map, 0, 0);
      enemies.forEach((enemy) => {
        enemy.update();
      });

      placementTiles.forEach((tile) => {
        tile.update(mouse);
      });

      buildings.forEach((building) => {
        building.draw();

        building.projectiles.forEach((projectile) => {
          projectile.update();

          const xDifference = projectile.enemy.center.x - projectile.position.x
          const yDifference = projectile.enemy.center.y - projectile.position.y
          const distance = Math.hypot(xDifference, yDifference)
          console.log(distance)
        });
      });
    }

    const handleMouseHover = (e: { clientX: number; clientY: number }) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      activeTile = null;
      for (let i = 0; i < placementTiles.length; i++) {
        const tile = placementTiles[i];
        if (
          mouse.x > tile.position.x &&
          mouse.x < tile.position.x + tile.size &&
          mouse.y > tile.position.y &&
          mouse.y < tile.position.y + tile.size
        ) {
          activeTile = tile;
          break;
        }
      }
    };

    canvas.addEventListener("mousemove", handleMouseHover);

    canvas.addEventListener("click", (e) => {
      if (activeTile && !activeTile.isOccupied) {
        buildings.push(
          new Building({
            position: {
              x: activeTile.position.x,
              y: activeTile.position.y,
            },
          })
        );
        activeTile.isOccupied = true;
      }
    });

    return () => {
      canvas.removeEventListener("mousemove", handleMouseHover);
    };
  }, []);

  return (
    <canvas
      className="canvas"
      ref={canvasRef}
      width={1280}
      height={820}
    ></canvas>
  );
}

export default Canvas;
