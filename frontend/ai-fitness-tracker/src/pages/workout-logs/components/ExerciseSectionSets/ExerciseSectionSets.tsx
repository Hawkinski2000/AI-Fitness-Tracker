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
  return (
    <>
      {
        workoutLogExercise.id &&
        exerciseSets &&
        exerciseSets[workoutLogExercise.id]
          .map((exerciseSet: ExerciseSet) => {
            return (
              <ExerciseSectionSet
                key={exerciseSet.id}
                exerciseSet={exerciseSet}
              />
            )
          })
      }
    </>
  );
}
