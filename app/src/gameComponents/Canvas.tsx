interface CanvasProps {
  canvasRef: React.LegacyRef<HTMLCanvasElement> | undefined;
}
export function Canvas({ canvasRef }: CanvasProps) {
  return (
    <canvas
      className="canvas"
      ref={canvasRef}
      width={1280}
      height={780}
    ></canvas>
  );
}
