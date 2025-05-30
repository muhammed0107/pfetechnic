export interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight?: string;
  duration?: string;
  notes?: string;
}

export interface WorkoutPlan {
  [day: string]: Exercise[];
}
