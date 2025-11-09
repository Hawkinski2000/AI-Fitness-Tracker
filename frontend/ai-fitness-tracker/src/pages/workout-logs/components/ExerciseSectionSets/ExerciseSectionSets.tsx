import {
  type WorkoutLogExercise,
  type ExerciseSet
} from "../../types/workout-logs";
import ExerciseSectionSet from "../ExerciseSectionSet/ExerciseSectionSet";


type ExerciseSectionSetsProps = {
  workoutLogExercise: WorkoutLogExercise;
  exerciseSets: Record<number, ExerciseSet[]>;
}


export default function ExerciseSectionSets({
  workoutLogExercise,
  exerciseSets
}: ExerciseSectionSetsProps) {
  const setsForExercise: ExerciseSet[] = exerciseSets?.[workoutLogExercise.id] ?? [];

  return (
    <>
      {setsForExercise.map((exerciseSet: ExerciseSet) => (
        <ExerciseSectionSet
          key={exerciseSet.id}
          exerciseSet={exerciseSet}
        />
      ))}
    </>
  );
}
