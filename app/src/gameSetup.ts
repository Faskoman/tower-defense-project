import { useEffect } from "react";
import { waypoints } from "./waypoints";
import { placements } from "./placements";

export function useGameSetup(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  setIsGameRunning: React.Dispatch<React.SetStateAction<boolean>>,
  setWave: React.Dispatch<React.SetStateAction<number>>,
  setLives: React.Dispatch<React.SetStateAction<number>>,
  setGameOver: React.Dispatch<React.SetStateAction<boolean>>,
  setCurrency: React.Dispatch<React.SetStateAction<number>>,
  isGameRunning: boolean
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const map = new Image();
    const bee = new Image();
    const zapper = new Image();
    const electricBolt = new Image();

    const placement2D = [];
    const tilesInARow = 40;
    const mouse = {
      x: 0,
      y: 0,
    };

    let enemiesSpeed = 1;
    let lives = 10;
    let currency = 100;

    for (let i = 0; i < placements.length; i += tilesInARow) {
      placement2D.push(placements.slice(i, i + tilesInARow));
    }

    class Enemy {
      position: { x: number; y: number };
      size: number;
      waypointIndex: number;
      center: { x: number; y: number };
      health: number;
      velocity: { x: number; y: number };

      constructor({ position = { x: 0, y: 0 } }) {
        this.position = position;
        this.size = 80;
        this.waypointIndex = 0;
        this.center = {
          x: this.position.x + this.size / 2,
          y: this.position.y + this.size / 2,
        };
        this.health = 100;
        this.velocity = {
          x: 0,
          y: 0,
        };
      }

      draw() {
        ctx!.drawImage(
          bee,
          this.position.x,
          this.position.y,
          this.size,
          this.size
        );
      }

      update() {
        this.draw();

        const waypoint = waypoints[this.waypointIndex];
        const yDistance = waypoint.y - this.center.y;
        const xDistance = waypoint.x - this.center.x;
        const angle = Math.atan2(yDistance, xDistance);

        this.velocity.x = Math.cos(angle) * enemiesSpeed;
        this.velocity.y = Math.sin(angle) * enemiesSpeed;

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.center = {
          x: this.position.x + this.size / 2,
          y: this.position.y + this.size / 2,
        };

        if (
          Math.abs(Math.round(this.center.x) - Math.round(waypoint.x)) <
            Math.abs(this.velocity.x) &&
          Math.abs(Math.round(this.center.y) - Math.round(waypoint.y)) <
            Math.abs(this.velocity.y) &&
          this.waypointIndex < waypoints.length - 1
        ) {
          this.waypointIndex++;
        }
      }
    }

    class PlacementTile {
      position = { x: 0, y: 0 };
      size: number;
      color: string;
      isOccupied: boolean;
      constructor({ position = { x: 0, y: 0 } }) {
        this.position = position;
        this.size = 64;
        this.color = "transparent";
        this.isOccupied = false;
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
      setIsGameRunning(true);
    };

    bee.src = "./src/assets/bee3.png";
    zapper.src = "./src/assets/bugZapper.png";
    electricBolt.src = "./src/assets/electricBolt2.png";
    map.src = "./src/assets/gameMapZoomed2.png";

    class Projectile {
      position: { x: number; y: number };
      velocity: { x: number; y: number };
      enemy: Enemy;
      size: number;
      constructor({
        position = { x: 0, y: 0 },
        enemy,
      }: {
        position?: { x: number; y: number };
        enemy: Enemy;
      }) {
        this.position = position;
        this.velocity = {
          x: 0,
          y: 0,
        };
        this.enemy = enemy;
        this.size = 40;
      }

      draw() {
        ctx!.drawImage(
          electricBolt,
          this.position.x,
          this.position.y,
          this.size,
          this.size
        );
      }

      update() {
        this.draw();

        const angle = Math.atan2(
          this.enemy.center.y - this.position.y,
          this.enemy.center.x - this.position.x
        );

        const projectileSpeed = 3;
        this.velocity.x = Math.cos(angle) * projectileSpeed;
        this.velocity.y = Math.sin(angle) * projectileSpeed;

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
      }
    }

    class Building {
      position: { x: number; y: number };
      size: number;
      projectiles: Projectile[];
      center: { x: number; y: number };
      radius: number;
      target: Enemy | null;
      frames: number;
      constructor({ position = { x: 0, y: 0 } }) {
        this.position = position;
        this.size = 64;
        this.center = {
          x: this.position.x + this.size / 2,
          y: this.position.y + this.size / 2,
        };
        this.projectiles = [];
        this.radius = 250;
        this.target = null;
        this.frames = 0;
      }

      draw() {
        ctx!.drawImage(
          zapper,
          this.position.x - this.size / 4.5,
          this.position.y,
          this.size + this.size / 2,
          this.size
        );
        ctx!.beginPath();
        ctx?.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2);
        ctx!.fillStyle = "rgba(255, 255, 255, .05)";
        ctx?.fill();
      }

      update() {
        this.draw();
        if (this.frames % 100 === 0 && this.target) {
          this.projectiles.push(
            new Projectile({
              position: {
                x: this.center.x,
                y: this.center.y,
              },
              enemy: this.target,
            })
          );
        }
        this.frames++;
      }
    }

    const enemies: Enemy[] = [];

    function spawnEnemies(spawnCount: number) {
      for (let i = 1; i <= spawnCount; i++) {
        const xOffset = i * 100;
        enemies.push(
          new Enemy({
            position: { x: waypoints[0].x - xOffset, y: waypoints[0].y },
          })
        );
      }
      enemiesSpeed += 0.1;
      setWave((wave) => wave + 1);
    }

    const buildings: Building[] = [];
    let activeTile: any = undefined;
    let enemyCount = 4;
    let hearts = lives;
    let money = currency;

    if (isGameRunning) {
      spawnEnemies(Math.round(enemyCount));
    }

    function animate() {
      const animationId = requestAnimationFrame(animate);

      ctx!.drawImage(map, 0, 0);

      for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        enemy.update();

        if (enemy.position.x > canvas!.width) {
          setLives((prevLives) => prevLives - 1);
          hearts--;
          enemies.splice(i, 1);

          if (hearts === 0) {
            cancelAnimationFrame(animationId);
            setGameOver(true);
          }
        }
      }

      if (enemies.length === 0 && isGameRunning) {
        enemyCount *= 1.25;
        spawnEnemies(enemyCount);
      }

      placementTiles.forEach((tile) => {
        tile.update(mouse);
      });

      buildings.forEach((building) => {
        building.update();
        building.target = null;
        const inRangeEnemies = enemies.filter((enemy) => {
          const xDifference = enemy.center.x - building.center.x;
          const yDifference = enemy.center.y - building.center.y;
          const distance = Math.hypot(xDifference, yDifference);
          return distance < enemy.size / 3 + building.radius;
        });
        building.target = inRangeEnemies[0];

        for (let i = building.projectiles.length - 1; i >= 0; i--) {
          const projectile = building.projectiles[i];

          projectile.update();

          const xDifference = projectile.enemy.center.x - projectile.position.x;
          const yDifference = projectile.enemy.center.y - projectile.position.y;
          const distance = Math.hypot(xDifference, yDifference);

          if (distance < projectile.enemy.size / 2) {
            projectile.enemy.health -= 50;
            if (projectile.enemy.health <= 0) {
              const enemyIndex = enemies.findIndex((enemy) => {
                return projectile.enemy === enemy;
              });

              if (enemyIndex > -1) {
                enemies.splice(enemyIndex, 1);
                setCurrency((prevCurrency) => prevCurrency + 15);
                money += 15;
              }
            }

            building.projectiles.splice(i, 1);
          }
        }
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

    canvas.addEventListener("click", () => {
      if (activeTile && !activeTile.isOccupied && money - 100 >= 0) {
        setCurrency((currency) => currency - 100);
        money -= 100;
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
  }, [isGameRunning]);
}
