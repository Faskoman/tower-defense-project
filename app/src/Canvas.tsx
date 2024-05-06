import { useRef, useEffect } from "react";

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
      constructor({ position = { x: 0, y: 0 }}) {
        this.position = position;
        this.width = 50;
        this.height = 50;
      }

      draw() {
        ctx!.fillStyle = "red";
        ctx!.fillRect(this.position.x, this.position.y, this.width, this.height);
      }

      update() {
        this.draw()
        this.position.x += 1
      }
    }

    const enemy = new Enemy( { position: {x: 200, y: 200}});

    function animate() {
      requestAnimationFrame(animate);

      ctx!.drawImage(map, 0, 0);
      enemy.update();
    }
  }, []);

  return <canvas ref={canvasRef} width={1200} height={960}></canvas>;
}

export default Canvas;
