import { type ExerciseSet } from "../../types/workout-logs";
import './ExerciseSectionSet.css';


type ExerciseSectionSetProps = {
  exerciseSet: ExerciseSet;
};


export default function ExerciseSectionSet({
  exerciseSet
}: ExerciseSectionSetProps) {
  return (
    <>
      <div className="exercise-set">
        <p>{`${exerciseSet.weight} ${exerciseSet.unit}`}</p>

        <p>{`${exerciseSet.reps} reps`}</p>
      </div>

    </>
  );
}
