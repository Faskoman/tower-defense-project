export interface User {
  id: string;
  userName: string;
  hashedPassword: string;
  userId: string;
  bestWave?: number;
  achievedAt?: string;
};