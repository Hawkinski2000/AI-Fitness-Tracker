import { useState } from "react";
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
import addIcon from '../../../../assets/add-icon.svg';
import removeIcon from '../../../../assets/remove-icon.svg';
import './ViewExerciseMenu.css';


type ViewExerciseMenuProps = {
  currentWorkoutLogDate: Value;
  workoutLogs: Record<string, WorkoutLog>;
  workoutLogExercises: Record<number, WorkoutLogExercise[]>;
  exercises: Record<number, Exercise>;
  exerciseSets: Record<number, ExerciseSet[]>;
  setExercisesMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editingWorkoutLogExerciseId: number | null;
  setEditingWorkoutLogExerciseId: React.Dispatch<React.SetStateAction<number | null>>;
  viewExerciseMenuOpenId: number | null;
  setViewExerciseMenuOpenId: React.Dispatch<React.SetStateAction<number | null>>;
  selectedExerciseSetId: number | null;
  setSelectedExerciseSetId: React.Dispatch<React.SetStateAction<number | null>>;
  exerciseSearchResults: Exercise[];
  exercisesMenuRef: React.RefObject<HTMLDivElement | null>;
  handleAddExercise: (exerciseId: number) => Promise<WorkoutLogExercise | undefined>;
  handleAddExerciseSet: (exerciseSet: ExerciseSetCreate) => Promise<void>;
  handleUpdateExerciseSet: (exerciseSetId: number, exerciseSet: ExerciseSetCreate) => Promise<void>;
  handleDeleteExerciseSet: (exerciseSetId: number) => Promise<void>;
};


export default function ViewExerciseMenu({
  currentWorkoutLogDate,
  workoutLogs,
  workoutLogExercises,
  exercises,
  exerciseSets,
  setExercisesMenuOpen,
  editingWorkoutLogExerciseId,
  setEditingWorkoutLogExerciseId,
  viewExerciseMenuOpenId,
  setViewExerciseMenuOpenId,
  selectedExerciseSetId,
  setSelectedExerciseSetId,
  exerciseSearchResults,
  exercisesMenuRef,
  handleAddExercise,
  handleAddExerciseSet,
  handleUpdateExerciseSet,
  handleDeleteExerciseSet
}: ViewExerciseMenuProps) {
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
      className={`exercises-menu ${viewExerciseMenuOpenId && 'exercises-menu-open'}`}
      ref={exercisesMenuRef}
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
              setExercisesMenuOpen(false);
              setEditingWorkoutLogExerciseId(null);
            }}
          >
            <img className="button-link-image" src={checkIcon} />
          </button>
        </div>
      </header>

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
                  <img className="button-link-image" src={removeIcon} />
                </button>
                
                <input
                  className="view-exercise-menu-input"
                  value={selectedSetWeight ?? ''}
                  type="number"
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
                  <img className="button-link-image" src={addIcon} />
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
                  <img className="button-link-image" src={removeIcon} />
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
                  <img className="button-link-image" src={addIcon} />
                </button>
              </div>

              <div className="view-exercise-menu-buttons-container">
                <button
                  className={`
                    view-exercise-menu-text-button
                    ${(!selectedSetWeight || !selectedSetReps) && 'view-exercise-menu-text-button-disabled'}
                  `}
                  onClick={async () => {
                    let workoutLogExerciseId = editingWorkoutLogExerciseId;
                    if (!editingWorkoutLogExerciseId && viewExerciseMenuOpenId) {
                      const newWorkoutLogExercise = await handleAddExercise(viewExerciseMenuOpenId);
                      if (!newWorkoutLogExercise) {
                        return;
                      }
                      workoutLogExerciseId = newWorkoutLogExercise.id;
                      setEditingWorkoutLogExerciseId(workoutLogExerciseId)
                    }

                    if (!workoutLogExerciseId) {
                      return;
                    }

                    if (selectedExerciseSetId && selectedSetWeight && selectedSetReps) {
                      const exerciseSet = {
                        workout_log_exercise_id: workoutLogExerciseId,
                        weight: selectedSetWeight,
                        reps: selectedSetReps,
                        unit: 'lbs',
                        rest_after_secs: null,
                        duration_secs: null,
                        calories_burned: null
                      };
                      handleUpdateExerciseSet(selectedExerciseSetId, exerciseSet);
                      return;
                    }
                  
                    const exerciseSet = {
                      workout_log_exercise_id: workoutLogExerciseId,
                      weight: selectedSetWeight,
                      reps: selectedSetReps,
                      unit: 'lbs',
                      rest_after_secs: null,
                      duration_secs: null,
                      calories_burned: null
                    };
                    handleAddExerciseSet(exerciseSet);
                  }}
                  disabled={!selectedSetWeight || !selectedSetReps}
                >
                  {selectedExerciseSetId ? 'Update' : 'Save'}
                </button>

                <button
                  className={`
                      view-exercise-menu-text-button
                      ${(!selectedSetWeight && !selectedSetReps) && 'view-exercise-menu-text-button-disabled'}
                    `}
                  onClick={() => {
                    if (!selectedExerciseSetId) {
                      setSelectedSetWeight(null);
                      setSelectedSetReps(null);
                      return;
                    }

                    handleDeleteExerciseSet(selectedExerciseSetId);
                    setSelectedExerciseSetId(null);
                  }}
                  disabled={!selectedSetWeight && !selectedSetReps}
                >
                  {selectedExerciseSetId ? 'Delete' : 'Clear'}
                </button>
              </div>
            </div>
          </div>
        </section>

      
        <header className="view-exercise-menu-sets-header">
          <div className="view-exercise-menu-section-content">
            <p className="view-exercise-menu-section-column-text">Sets</p>
          </div>
        </header>

        <div className="view-exercise-menu-sets-container">
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
      </div>
    </div>
  );
}
