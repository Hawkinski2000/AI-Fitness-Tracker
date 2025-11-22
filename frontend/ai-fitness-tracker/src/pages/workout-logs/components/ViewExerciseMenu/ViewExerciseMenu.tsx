import { useState } from "react";
// import { PropagateLoader } from 'react-spinners';
import {
  type WorkoutLog,
  type WorkoutLogExercise,
  type Exercise,
  type ExerciseSet,
  type ExerciseSetCreate
} from "../../types/workout-logs";
import type { Value } from 'react-calendar/dist/shared/types.js';
import { getDateKey } from '../../../../utils/dates';
import backIcon from './assets/back-icon.svg';
import checkIcon from './assets/check-icon.svg';
import './ViewExerciseMenu.css';


type ViewExerciseMenuProps = {
  currentWorkoutLogDate: Value;
  workoutLogs: Record<string, WorkoutLog>;
  workoutLogExercises: Record<number, WorkoutLogExercise[]>;
  exercises: Record<number, Exercise>;
  exerciseSets: Record<number, ExerciseSet[]>;
  exercisesMenuOpen: boolean;
  setExercisesMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editingWorkoutLogExerciseId: number | null;
  setEditingWorkoutLogExerciseId: React.Dispatch<React.SetStateAction<number | null>>;
  viewExerciseMenuOpenId: number | null;
  setViewExerciseMenuOpenId: React.Dispatch<React.SetStateAction<number | null>>;
  exerciseSearchResults: Exercise[];
  foodsMenuRef: React.RefObject<HTMLDivElement | null>;
  handleAddExercise: (exerciseId: number) => Promise<void>;
  handleAddExerciseSet: (exerciseSet: ExerciseSetCreate) => Promise<void>;
  // handleUpdateExerciseSet: (exerciseSetId: number) => Promise<void>;
  handleDeleteExerciseSet: (exerciseSetId: number) => Promise<void>;
};


export default function ViewExerciseMenu({
  currentWorkoutLogDate,
  workoutLogs,
  workoutLogExercises,
  exercises,
  exerciseSets,
  exercisesMenuOpen,
  setExercisesMenuOpen,
  editingWorkoutLogExerciseId,
  setEditingWorkoutLogExerciseId,
  viewExerciseMenuOpenId,
  setViewExerciseMenuOpenId,
  exerciseSearchResults,
  foodsMenuRef,
  handleAddExercise,
  handleAddExerciseSet,
  // handleUpdateExerciseSet
  handleDeleteExerciseSet
}: ViewExerciseMenuProps) {
  const [selectedExerciseSetId, setSelectedExerciseSetId] = useState<number | null>(null);
  const [selectedSetWeight, setSelectedSetWeight] = useState<number | null>(null);
  const [selectedSetReps, setSelectedSetReps] = useState<number | null>(null);

  const dateKey = getDateKey(currentWorkoutLogDate);

  const currentExercise = editingWorkoutLogExerciseId && currentWorkoutLogDate && dateKey
    ? (
        exercises[
          workoutLogExercises[workoutLogs[dateKey].id]
            ?.find((workoutLogExercise: WorkoutLogExercise) =>
              workoutLogExercise.id === editingWorkoutLogExerciseId)
                ?.exercise_id ?? -1
        ]
    )
    : (
        exerciseSearchResults.find((exercise: Exercise) =>
          exercise.id === viewExerciseMenuOpenId)
    );

  
  return (
    <div
      className={`foods-menu ${exercisesMenuOpen && 'foods-menu-open'}`}
      ref={foodsMenuRef}
    >
      <header className="view-exercise-menu-header">
        <div className="view-exercise-menu-section-content">
          <button
            className="view-exercise-menu-text-button"
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
            className="view-exercise-menu-text-button"
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
                  handleAddExercise(viewExerciseMenuOpenId);
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
        <div className="view-exercise-menu-content">
          <section className="view-exercise-menu-section">
            <div className="view-exercise-menu-section-content">
              <h3 className="view-exercise-menu-content-heading">
                {currentExercise?.name}
              </h3>
            </div>
          </section>

          <section className="view-exercise-menu-section">
            <div className="view-exercise-menu-section-content">
              <div className="view-exercise-menu-section-container">
                <p className="view-exercise-menu-section-column-text">
                  Weight ({currentExercise?.base_unit || 'lbs'})
                </p>

                <div className="view-exercise-menu-buttons-container">
                  <button
                    className="view-exercise-menu-text-button"
                    onClick={() => {
                      setSelectedSetWeight(prev => Math.max((prev || 0) - 5, 0));
                    }}
                  >
                    -
                  </button>
                  
                  <input
                    className="view-exercise-menu-input"
                    value={selectedSetWeight ?? ''}
                    onInput={(e) => {
                      const value = e.currentTarget.value;
                      setSelectedSetWeight(value === '' ? null : parseFloat(value));
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.currentTarget.blur();
                      }
                    }}
                  />

                  <button
                    className="view-exercise-menu-text-button"
                    onClick={() => {
                      setSelectedSetWeight(prev => (prev || 0) + 5);
                    }}
                  >
                    +
                  </button>
                </div>

                <p className="view-exercise-menu-section-column-text">
                  Reps
                </p>

                <div className="view-exercise-menu-buttons-container">
                  <button
                    className="view-exercise-menu-text-button"
                    onClick={() => {
                      setSelectedSetReps(prev => Math.max((prev || 0) - 1, 0));
                    }}
                  >
                    -
                  </button>
                  
                  <input
                    className="view-exercise-menu-input"
                    value={selectedSetReps ?? ''}
                    onInput={(e) => {
                      const value = e.currentTarget.value;
                      setSelectedSetReps(value === '' ? null : parseFloat(value));
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.currentTarget.blur();
                      }
                    }}
                  />

                  <button
                    className="view-exercise-menu-text-button"
                    onClick={() => {
                      setSelectedSetReps(prev => Math.max((prev || 0) + 1, 0));
                    }}
                  >
                    +
                  </button>
                </div>

                <div className="view-exercise-menu-buttons-container">
                  <button
                    className="view-exercise-menu-text-button"
                    onClick={() => {
                      if (selectedExerciseSetId || !editingWorkoutLogExerciseId || !selectedSetWeight || !selectedSetReps) {
                        return;
                      }

                      const exerciseSet = {
                        workout_log_exercise_id: editingWorkoutLogExerciseId,
                        weight: selectedSetWeight,
                        reps: selectedSetReps,
                        unit: 'lbs',
                        rest_after_secs: null,
                        duration_secs: null,
                        calories_burned: null
                      };
                      handleAddExerciseSet(exerciseSet);
                    }}
                  >
                    {selectedExerciseSetId ? 'Update' : 'Save'}
                  </button>

                  <button
                    className="view-exercise-menu-text-button"
                    onClick={() => {
                      if (!selectedExerciseSetId) {
                        return;
                      }

                      handleDeleteExerciseSet(selectedExerciseSetId);
                      setSelectedExerciseSetId(null);
                    }}
                  >
                    {selectedExerciseSetId ? 'Delete' : 'Clear'}
                  </button>
                </div>
              </div>
            </div>
          </section>

          <div className="view-exercise-menu-section-content">
            <p className="view-exercise-menu-section-column-text">
              Sets
            </p>
          </div>
          {
            editingWorkoutLogExerciseId &&
            exerciseSets[editingWorkoutLogExerciseId]?.map((exerciseSet: ExerciseSet, index: number) => {
              return (
                <section
                  className={`
                    view-exercise-menu-set
                    view-exercise-menu-section
                    ${exerciseSet.id === selectedExerciseSetId && 'view-exercise-menu-set-selected'}
                  `}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (selectedExerciseSetId === exerciseSet.id) {
                      setSelectedExerciseSetId(null);
                      setSelectedSetWeight(null);
                      setSelectedSetReps(null);
                      return;
                    }

                    setSelectedExerciseSetId(exerciseSet.id);
                    setSelectedSetWeight(exerciseSet.weight);
                    setSelectedSetReps(exerciseSet.reps);
                  }}
                >
                  <div className="view-exercise-menu-section-content">
                    <p className="view-exercise-menu-section-column-text">
                      {index + 1}
                    </p>

                    <p className="view-exercise-menu-section-column-text">
                      {exerciseSet.weight}{" "}
                      {exerciseSet.unit}{" "}
                    </p>
                    
                    <p className="view-exercise-menu-section-column-text">
                      {exerciseSet.reps} reps
                    </p>
                  </div>
                </section>
              );
            })
          }
        </div>
        {/* )} */}
    </div>
  );
}
