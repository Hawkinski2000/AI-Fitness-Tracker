import { useState, useRef } from "react";
import {
  type WorkoutLog,
  type WorkoutLogExercise,
  type Exercise,
  type ExerciseSet
} from "../../types/workout-logs";
import { type Value } from 'react-calendar/dist/shared/types.js';
import { getDateKey } from '../../../../utils/dates';
import useInitializeWorkoutLogsPage from "../../hooks/useInitializeWorkoutLogsPage";
import useWorkoutLogsClickOutside from "../../hooks/useWorkoutLogsClickOutside";
import useWorkoutLogsDate from "../../hooks/useWorkoutLogsDate";
import useExerciseSearch from "../../hooks/useExerciseSearch";
import useWorkoutLogActions from "../../hooks/useWorkoutLogActions";
import LoadingScreen from "../../../../components/LoadingScreen/LoadingScreen";
import Header from "../../../../components/Header/Header";
import Sidebar from "../../../../components/Sidebar/Sidebar";
import DateNav from "../DateNav/DateNav";
import SelectItemsHeader from "../SelectExercisesHeader/SelectExercisesHeader";
import ViewExerciseMenu from "../ViewExerciseMenu/ViewExerciseMenu";
import ExercisesMenu from "../ExercisesMenu/ExercisesMenu";
import ExerciseSection from "../ExerciseSection/ExerciseSection";
import './WorkoutLogsPage.css';


export default function WorkoutLogsPage() {
  const [accountMenuOpen, setAccountMenuOpen] = useState<boolean>(false);
  const accountMenuRef = useRef<HTMLDivElement | null>(null);

  const [tokensRemaining, setTokensRemaining] = useState<number>(0);

// ---------------------------------------------------------------------------

  const [currentWorkoutLogDate, setCurrentWorkoutLogDate] = useState<Value>(new Date());
  const [today, setToday] = useState<Value>(new Date());
  
// ---------------------------------------------------------------------------

  const [workoutLogs, setWorkoutLogs] = useState<Record<string, WorkoutLog>>({});

  const [workoutLogExercises, setWorkoutLogExercises] = useState<Record<number, WorkoutLogExercise[]>>({});

  const [exercises, setExercises] = useState<Record<number, Exercise>>({});

  const [exerciseSets, setExerciseSets] = useState<Record<number, ExerciseSet[]>>({});

// ---------------------------------------------------------------------------

  const [workoutLogOptionsMenuOpen, setWorkoutLogOptionsMenuOpen] = useState<boolean>(false);
  const workoutLogOptionsMenuRef = useRef<HTMLDivElement | null>(null);

  const [exerciseOptionsMenuOpenName, setExerciseOptionsMenuOpenName] = useState<string>(''); // Switch to workout log exercise id!
  const exerciseOptionsMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [mealFoodOptionsMenuOpenId, setMealFoodOptionsMenuOpenId] = useState<number | null>(null);
  const mealFoodOptionsMenuRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const [selectingWorkoutLogExercises, setSelectingWorkoutLogExercises] = useState<boolean>(false);
  const [allItemsSelected, setAllItemsSelected] = useState<boolean>(false);
  const [selectedMealTypes, setSelectedMealTypes] = useState<string[]>([]);
  const [selectedWorkoutLogExerciseIds, setSelectedWorkoutLogExerciseIds] = useState<number[]>([]);
  
  const [calendarOpenType, setCalendarOpenType] = useState<string>('');
  const calendarRef = useRef<HTMLDivElement | null>(null);
  const [calendarDate, setCalendarDate] = useState<Value>(new Date());

// ---------------------------------------------------------------------------

  const [exercisesMenuOpen, setExercisesMenuOpen] = useState<boolean>(false);
  const foodsMenuRef = useRef<HTMLDivElement | null>(null);

  const [exerciseSearch, setExerciseSearch] = useState<string>('');
  const searchTimeoutRef = useRef<number | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [foodMenuInputFocused, setFoodMenuInputFocused] = useState<boolean>(false);
  const [exerciseSearchResults, setExerciseSearchResults] = useState<Exercise[]>([]);

  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [currentPageNumber, setCurrentPageNumber] = useState<number | null>(null);

// ---------------------------------------------------------------------------

  const [viewExerciseMenuOpenId, setViewExerciseMenuOpenId] = useState<number | null>(null);

  const [editingWorkoutLogExerciseId, setEditingWorkoutLogExerciseId] = useState<number | null>(null);

  const [selectMealMenuOpenType, setSelectMealMenuOpenType] = useState<string>('');
  const selectMealMenuRef = useRef<HTMLDivElement | null>(null);

  const [selectServingSizeMenuOpen, setSelectServingSizeMenuOpen] = useState<boolean>(false);
  const selectServingSizeMenuRef = useRef<HTMLDivElement | null>(null);

// ---------------------------------------------------------------------------

  const currentDateKey = currentWorkoutLogDate ? getDateKey(currentWorkoutLogDate) : null;
  const currentWorkoutLog = currentDateKey ? workoutLogs[currentDateKey] : undefined;

  const currentWorkoutLogId = currentWorkoutLog?.id ?? null;
  const currentWorkoutLogExercises = currentWorkoutLogId
    ? workoutLogExercises[currentWorkoutLogId] ?? []
    : [];

// ---------------------------------------------------------------------------

  const { userData, loading } = useInitializeWorkoutLogsPage(
    setTokensRemaining,
    setWorkoutLogs,
    setWorkoutLogExercises,
    setExercises,
    setExerciseSets,
    setToday,
    setCurrentWorkoutLogDate
  );

  useWorkoutLogsClickOutside(
    setAccountMenuOpen,
    workoutLogOptionsMenuOpen,
    setWorkoutLogOptionsMenuOpen,
    exerciseOptionsMenuOpenName,
    setExerciseOptionsMenuOpenName,
    mealFoodOptionsMenuOpenId,
    setMealFoodOptionsMenuOpenId,
    exercisesMenuOpen,
    setExercisesMenuOpen,
    setExerciseSearch,
    setFoodMenuInputFocused,
    setEditingWorkoutLogExerciseId,
    setViewExerciseMenuOpenId,
    selectMealMenuOpenType,
    setSelectMealMenuOpenType,
    selectServingSizeMenuOpen,
    setSelectServingSizeMenuOpen,
    calendarOpenType,
    setCalendarOpenType,
    setCalendarDate,
    currentWorkoutLogDate,
    accountMenuRef,
    workoutLogOptionsMenuRef,
    exerciseOptionsMenuRefs,
    mealFoodOptionsMenuRefs,
    foodsMenuRef,
    selectMealMenuRef,
    selectServingSizeMenuRef,
    calendarRef
  );

  const {
    getDateLabel,
    handleChangeDate,
    handleSetCalendarDate
  } = useWorkoutLogsDate(
    currentWorkoutLogDate,
    setCurrentWorkoutLogDate,
    workoutLogs,
    setWorkoutLogs,
    setWorkoutLogExercises,
    setExercises,
    setExerciseSets,
    setCalendarOpenType,
    setCalendarDate
  );

  const {
    handleExerciseSearch,
    updateExerciseSearch
  } = useExerciseSearch(
    setExerciseSearchResults,
    setIsSearching,
    setTotalPages,
    setCurrentPageNumber,
    setExerciseSearch,
    searchTimeoutRef
  );

  const {
    handleAddExercise,
    handleCopyWorkoutLogExercises,
    handleMoveWorkoutLogExercises,
    handleDeleteWorkoutLogExercises,
    handleAddExerciseSet,
    handleDeleteExerciseSet,
    handleUpdateExerciseSet,
  } = useWorkoutLogActions(
    currentWorkoutLogDate,
    setCurrentWorkoutLogDate,
    calendarDate,
    // foodsMenuOpenMealType,
    workoutLogs,
    setWorkoutLogs,
    setWorkoutLogExercises,
    setExercises,
    setExerciseSets,
    // setFoods,
    // setFoodNutrients,
    // setNutrients,
    // setMacroAmountsGrams,
    // setFoodCaloriesFromMacros,
    selectedWorkoutLogExerciseIds,
    setCalendarOpenType
  );

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <div className='meal-logs-page'>
        <Header
          isRemovingTokens={null}
          tokensRemaining={tokensRemaining}
          accountMenuOpen={accountMenuOpen}
          setAccountMenuOpen={setAccountMenuOpen}
          userData={userData}
          accountMenuRef={accountMenuRef}
        />

        <div className="page-body">
          <Sidebar currentPage={'workout-logs'} />

          <main className="workout-logs-page-main">
            <div className='workout-logs-page-content'>
              <DateNav
                currentWorkoutLogDate={currentWorkoutLogDate}
                today={today}
                handleChangeDate={handleChangeDate}
                getDateLabel={getDateLabel}
                calendarOpenType={calendarOpenType}
                setCalendarOpenType={setCalendarOpenType}
                calendarRef={calendarRef}
                calendarDate={calendarDate}
                setCalendarDate={setCalendarDate}
                setExercisesMenuOpen={setExercisesMenuOpen}
                setViewExerciseMenuOpenId={setViewExerciseMenuOpenId}
                setEditingWorkoutLogExerciseId={setEditingWorkoutLogExerciseId}
                workoutLogOptionsMenuOpen={workoutLogOptionsMenuOpen}
                setWorkoutLogOptionsMenuOpen={setWorkoutLogOptionsMenuOpen}
                selectingWorkoutLogExercises={selectingWorkoutLogExercises}
                setSelectingWorkoutLogExercises={setSelectingWorkoutLogExercises}
                setAllItemsSelected={setAllItemsSelected}
                setSelectedMealTypes={setSelectedMealTypes}
                selectedWorkoutLogExerciseIds={selectedWorkoutLogExerciseIds}
                setSelectedWorkoutLogExerciseIds={setSelectedWorkoutLogExerciseIds}
                workoutLogs={workoutLogs}
                workoutLogExercises={workoutLogExercises}
                workoutLogOptionsMenuRef={workoutLogOptionsMenuRef}
                handleSetCalendarDate={handleSetCalendarDate}
                handleCopyWorkoutLogExercises={handleCopyWorkoutLogExercises}
                handleMoveWorkoutLogExercises={handleMoveWorkoutLogExercises}
                handleDeleteWorkoutLogExercises={handleDeleteWorkoutLogExercises}
              />

              <SelectItemsHeader
                allItemsSelected={allItemsSelected}
                setAllItemsSelected={setAllItemsSelected}
                selectingWorkoutLogExercises={selectingWorkoutLogExercises}
                setSelectingWorkoutLogExercises={setSelectingWorkoutLogExercises}
                selectedWorkoutLogExerciseIds={selectedWorkoutLogExerciseIds}
                setSelectedWorkoutLogExerciseIds={setSelectedWorkoutLogExerciseIds}
                currentWorkoutLogDate={currentWorkoutLogDate}
                workoutLogs={workoutLogs}
                workoutLogExercises={workoutLogExercises}
              />

              {viewExerciseMenuOpenId ? (
                <ViewExerciseMenu
                  currentWorkoutLogDate={currentWorkoutLogDate}
                  workoutLogs={workoutLogs}
                  workoutLogExercises={workoutLogExercises}
                  exercises={exercises}
                  exerciseSets={exerciseSets}
                  exercisesMenuOpen={exercisesMenuOpen}
                  setExercisesMenuOpen={setExercisesMenuOpen}
                  editingWorkoutLogExerciseId={editingWorkoutLogExerciseId}
                  setEditingWorkoutLogExerciseId={setEditingWorkoutLogExerciseId}
                  viewExerciseMenuOpenId={viewExerciseMenuOpenId}
                  setViewExerciseMenuOpenId={setViewExerciseMenuOpenId}
                  exerciseSearchResults={exerciseSearchResults}
                  foodsMenuRef={foodsMenuRef}
                  handleAddExercise={handleAddExercise}
                  handleAddExerciseSet={handleAddExerciseSet}
                  handleUpdateExerciseSet={handleUpdateExerciseSet}
                  handleDeleteExerciseSet={handleDeleteExerciseSet}
                />
              ) : (
                <ExercisesMenu
                  exercisesMenuOpen={exercisesMenuOpen}
                  setExercisesMenuOpen={setExercisesMenuOpen}
                  exerciseSearch={exerciseSearch}
                  foodMenuInputFocused={foodMenuInputFocused}
                  setFoodMenuInputFocused={setFoodMenuInputFocused}
                  isSearching={isSearching}
                  exerciseSearchResults={exerciseSearchResults}
                  setViewExerciseMenuOpenId={setViewExerciseMenuOpenId}
                  totalPages={totalPages}
                  currentPageNumber={currentPageNumber}
                  setCurrentPageNumber={setCurrentPageNumber}
                  foodsMenuRef={foodsMenuRef}
                  searchTimeoutRef={searchTimeoutRef}
                  updateExerciseSearch={updateExerciseSearch}
                  handleExerciseSearch={handleExerciseSearch}
                  // handleAddExercise={handleAddExercise}
                />
              )} 

              <div
                className={
                  `exercises-container
                  ${selectingWorkoutLogExercises && 'exercises-container-selecting-items'}`
                }
              >
                {currentWorkoutLogExercises.map((workoutLogExercise) => {
                  return (
                    <ExerciseSection
                      key={workoutLogExercise.id}
                      workoutLogExercise={workoutLogExercise}
                      currentWorkoutLogDate={currentWorkoutLogDate}
                      workoutLogs={workoutLogs}
                      workoutLogExercises={workoutLogExercises}
                      exercises={exercises}
                      exerciseSets={exerciseSets}
                      exerciseOptionsMenuOpenName={exerciseOptionsMenuOpenName}
                      setExerciseOptionsMenuOpenName={setExerciseOptionsMenuOpenName}
                      setAllItemsSelected={setAllItemsSelected}
                      selectedMealTypes={selectedMealTypes}
                      setSelectedMealTypes={setSelectedMealTypes}
                      selectedWorkoutLogExerciseIds={selectedWorkoutLogExerciseIds}
                      setSelectedWorkoutLogExerciseIds={setSelectedWorkoutLogExerciseIds}
                      selectingWorkoutLogExercises={selectingWorkoutLogExercises}
                      setCalendarOpenType={setCalendarOpenType}
                      setExercisesMenuOpen={setExercisesMenuOpen}
                      viewExerciseMenuOpenId={viewExerciseMenuOpenId}
                      setViewExerciseMenuOpenId={setViewExerciseMenuOpenId}
                      editingWorkoutLogExerciseId={editingWorkoutLogExerciseId}
                      setEditingWorkoutLogExerciseId={setEditingWorkoutLogExerciseId}
                      exerciseOptionsMenuRefs={exerciseOptionsMenuRefs}
                      handleDeleteWorkoutLogExercises={handleDeleteWorkoutLogExercises}
                    />
                  )
                })}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
