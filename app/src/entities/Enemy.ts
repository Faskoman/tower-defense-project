// import { waypoints } from "../waypoints";

// export class Enemy {
//   position: { x: number; y: number };
//   width: number;
//   height: number;
//   waypointIndex: number;
//   center: { x: number; y: number };
//   health: number;
//   velocity: { x: number; y: number };

//   constructor({ position = { x: 0, y: 0 } }) {
//     this.position = position;
//     this.width = 80;
//     this.height = 80;
//     this.waypointIndex = 0;
//     this.center = {
//       x: this.position.x + this.width / 2,
//       y: this.position.y + this.height / 2,
//     };
//     this.health = 100;
//     this.velocity = {
//       x: 0,
//       y: 0,
//     };
//   }

//   draw(ctx: CanvasRenderingContext2D, beeImage: HTMLImageElement) {
//     ctx.drawImage(
//       beeImage,
//       this.position.x,
//       this.position.y,
//       this.width,
//       this.height
//     );
//   }

//   update() {
//     const waypoint = waypoints[this.waypointIndex];
//     const yDistance = waypoint.y - this.center.y;
//     const xDistance = waypoint.x - this.center.x;
//     const angle = Math.atan2(yDistance, xDistance);

//     this.velocity.x = Math.cos(angle) * enemiesSpeed;
//     this.velocity.y = Math.sin(angle) * enemiesSpeed;

//     this.position.x += this.velocity.x;
//     this.position.y += this.velocity.y;
//     this.center = {
//       x: this.position.x + this.width / 2,
//       y: this.position.y + this.height / 2,
//     };

//     if (
//       Math.abs(Math.round(this.center.x) - Math.round(waypoint.x)) <
//         Math.abs(this.velocity.x) &&
//       Math.abs(Math.round(this.center.y) - Math.round(waypoint.y)) <
//         Math.abs(this.velocity.y) &&
//       this.waypointIndex < waypoints.length - 1
//     ) {
//       this.waypointIndex++;
//     }
//   }
// }