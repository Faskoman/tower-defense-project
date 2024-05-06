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

    let x = 200;
    function animate() {
      requestAnimationFrame(animate);

      ctx!.drawImage(map, 0, 0);

      ctx!.fillStyle = "red"
      ctx!.fillRect(x, 200, 50, 50);
      x++;
    }

    map.src = "/src/assets/gameMapZoomed.png";
  }, []);

  return <canvas ref={canvasRef} width={1200} height={960}></canvas>;
}

export default Canvas;
