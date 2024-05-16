import { useEffect, useState } from "react";
import { waypoints } from "./waypoints";
import { placements } from "./placements";
import {
  Enemy,
  createEnemy,
  Building,
  createBuilding,
  updateBuilding,
} from "./entities/entities.ts";

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

    for (let i = 0; i < placements.length; i += tilesInARow) {
      placement2D.push(placements.slice(i, i + tilesInARow));
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

    const enemies: Enemy[] = [];
    function spawnEnemies(spawnCount: number) {
      for (let i = 1; i <= spawnCount; i++) {
        const xOffset = i * 100;
        const enemy = createEnemy({
          position: { x: waypoints[0].x - xOffset, y: waypoints[0].y },
        });
        enemies.push(enemy);
      }
      enemiesSpeed += 0.1;
      setWave((wave) => wave + 1);
    }

    const buildings: Building[] = [];
    let activeTile: any = undefined;
    let enemyCount = 4;
    let hearts = lives;

    if (isGameRunning) {
      spawnEnemies(Math.round(enemyCount));
    }

    function animate() {
      const animationId = requestAnimationFrame(animate);

      ctx!.drawImage(map, 0, 0);

      for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        enemy.update(ctx!, bee, waypoints, enemiesSpeed);

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
        // Update building and draw it
        updateBuilding(
          ctx!,
          building,
          zapper,
          building.projectiles,
          building.frames
        );
        building.target = null;

        const inRangeEnemies = enemies.filter((enemy) => {
          const xDifference = enemy.position.x - building.center.x;
          const yDifference = enemy.position.y - building.center.y;
          const distance = Math.hypot(xDifference, yDifference);
          return distance < enemy.size / 3 + building.radius;
        });

        if (inRangeEnemies.length > 0) {
          building.target = inRangeEnemies[0];
        }

        for (let i = building.projectiles.length - 1; i >= 0; i--) {
          const projectile = building.projectiles[i];
          projectile.update(ctx!);

          const xDifference =
            projectile.enemy.position.x - projectile.position.x;
          const yDifference =
            projectile.enemy.position.y - projectile.position.y;
          const distance = Math.hypot(xDifference, yDifference);

          if (distance < projectile.enemy.size / 2) {
            projectile.enemy.health -= 50;
            if (projectile.enemy.health <= 0) {
              const enemyIndex = enemies.findIndex((enemy) => {
                return projectile.enemy === enemy;
              });

              if (enemyIndex > -1) {
                enemies.splice(enemyIndex, 1);
                setCurrency((prevCurrency) => prevCurrency + 5);
              }
            }
            building.projectiles.splice(i, 1);
          }
        }
      });

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

      canvas!.addEventListener("mousemove", handleMouseHover);

      canvas!.addEventListener("click", () => {
        if (activeTile && !activeTile.isOccupied && setCurrency) {
          setCurrency((prevCurrency) => {
            if (prevCurrency - 100 >= 0) {
              addBuilding(buildings, activeTile);
              return prevCurrency - 100;
            }
            return prevCurrency;
          });
        }
      });

      return () => {
        canvas!.removeEventListener("mousemove", handleMouseHover);
      };
    }
  }, [isGameRunning]);
}

function addBuilding(buildings: Building[], activeTile: any) {
  buildings.push(
    createBuilding({
      position: {
        x: activeTile.position.x,
        y: activeTile.position.y,
      },
    })
  );
  activeTile.isOccupied = true;
}
