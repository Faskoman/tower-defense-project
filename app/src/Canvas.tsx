import { useRef, useEffect } from "react";
import { waypoint } from "./waypoints";

function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const map = new Image();

    map.onload = () => {
      ctx.drawImage(map, 0, 0);
    };

    map.src = "/src/assets/gameMapZoomed.png";
  }, []);

  return (
    <canvas ref={canvasRef} width={1200} height={960}>
    </canvas>
  );
}

export default Canvas;