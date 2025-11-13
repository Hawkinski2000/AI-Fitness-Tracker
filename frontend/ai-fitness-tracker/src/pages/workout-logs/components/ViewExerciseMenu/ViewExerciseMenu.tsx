// import { PropagateLoader } from 'react-spinners';
import {
  type WorkoutLog,
  type WorkoutLogExercise,
  type Exercise,
  // type ExerciseSet
} from "../../types/workout-logs";
import type { Value } from 'react-calendar/dist/shared/types.js';
import { getDateKey } from '../../../../utils/dates';
import backIcon from './assets/back-icon.svg';
import checkIcon from './assets/check-icon.svg';
import './ViewFoodMenu.css';


type ViewExerciseMenuProps = {
  currentWorkoutLogDate: Value;
  workoutLogs: Record<string, WorkoutLog>;
  workoutLogExercises: Record<number, WorkoutLogExercise[]>;
  exercises: Record<number, Exercise>;
  // exerciseSets: Record<number, ExerciseSet[]>;
  exercisesMenuOpen: boolean;
  setExercisesMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editingWorkoutLogExerciseId: number | null;
  setEditingWorkoutLogExerciseId: React.Dispatch<React.SetStateAction<number | null>>;
  viewExerciseMenuOpenId: number | null;
  setViewExerciseMenuOpenId: React.Dispatch<React.SetStateAction<number | null>>;
  exerciseSearchResults: Exercise[];
  foodsMenuRef: React.RefObject<HTMLDivElement | null>;
  // handleUpdateFood: (
  //   mealLogFoodId: number,
  //   mealLogId: number | null,
  //   numServings?: number | null,
  //   servingSize?: number | null
  // ) => Promise<void>;
  // handleAddFood: (
  //   foodId: number,
  //   numServings?: number | null,
  //   servingSize?: number | null
  // ) => Promise<void>;
};


export default function ViewExerciseMenu({
  currentWorkoutLogDate,
  workoutLogs,
  workoutLogExercises,
  exercises,
  // exerciseSets,
  exercisesMenuOpen,
  setExercisesMenuOpen,
  editingWorkoutLogExerciseId,
  setEditingWorkoutLogExerciseId,
  viewExerciseMenuOpenId,
  setViewExerciseMenuOpenId,
  exerciseSearchResults,
  foodsMenuRef
}: ViewExerciseMenuProps) {
  const dateKey = getDateKey(currentWorkoutLogDate);

  
  return (
    <div
      className={`foods-menu ${exercisesMenuOpen && 'foods-menu-open'}`}
      ref={foodsMenuRef}
    >
      <header className="view-food-menu-header">
        <div className="view-food-menu-section-content">
          <button
            className="view-food-menu-text-button"
            onClick={(e) => {
              e.stopPropagation();
              setEditingWorkoutLogExerciseId(null);
              setViewExerciseMenuOpenId(null);
            }}
          >
            <img className="button-link-image" src={backIcon} />
          </button>
          <p>
            {editingWorkoutLogExerciseId ? 'Edit Entry' : 'Add Exercise'}
          </p>
          <button
            className="view-food-menu-text-button"
            onClick={(e) => {
              e.stopPropagation();
              if (editingWorkoutLogExerciseId && currentWorkoutLogDate && dateKey) {
                // handleUpdateFood(editingWorkoutLogExerciseId,
                //                  mealLogs[dateKey].id,
                //                  numServings,
                //                  servingSize);
                setViewExerciseMenuOpenId(null);
                setViewExerciseMenuOpenId(null);
                setExercisesMenuOpen(false);
              }
              else {
                if (viewExerciseMenuOpenId) {
                  // handleAddFood(viewFoodMenuOpenId, numServings, servingSize);
                }
              }
              setViewExerciseMenuOpenId(null);
            }}
          >
            <img className="button-link-image" src={checkIcon} />
          </button>
        </div>
      </header>

      {/* {(viewExerciseMenuOpenId) ? (
        <div className="food-menu-results-loading-container">
          <PropagateLoader
            size={20}
            cssOverride={{
              alignItems: "center",
              justifyContent: "center"
            }}
            color="#00ffcc"
          />
        </div>
      ) : ( */}
        <div className="view-food-menu-content">
          <section className="view-food-menu-section">
            <div className="view-food-menu-section-content">
              <h3 className="view-food-menu-content-heading">
                {
                  editingWorkoutLogExerciseId && currentWorkoutLogDate && dateKey
                    ? (
                        exercises[
                          workoutLogExercises[workoutLogs[dateKey].id]
                            ?.find((workoutLogExercise: WorkoutLogExercise) =>
                              workoutLogExercise.id === editingWorkoutLogExerciseId)
                            ?.exercise_id ?? -1
                        ]?.name ?? ''
                      )
                    : (
                        exerciseSearchResults.find((exercise: Exercise) =>
                          exercise.id === viewExerciseMenuOpenId)?.name || ''
                      )
                }
              </h3>
            </div>
          </section>

        </div>
        {/* )} */}
    </div>
  );
}
