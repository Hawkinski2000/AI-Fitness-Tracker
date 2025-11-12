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
import useFoodSearch from "../../hooks/useFoodSearch";
import useWorkoutLogActions from "../../hooks/useWorkoutLogActions";
import LoadingScreen from "../../../../components/LoadingScreen/LoadingScreen";
import Header from "../../../../components/Header/Header";
import Sidebar from "../../../../components/Sidebar/Sidebar";
import DateNav from "../DateNav/DateNav";
import SelectItemsHeader from "../SelectExercisesHeader/SelectExercisesHeader";
import ViewFoodMenu from "../ViewFoodMenu/ViewFoodMenu";
import FoodsMenu from "../FoodsMenu/FoodsMenu";
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

  const [mealLogOptionsMenuOpen, setMealLogOptionsMenuOpen] = useState<boolean>(false);
  const mealLogOptionsMenuRef = useRef<HTMLDivElement | null>(null);

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

  const [foodsMenuOpenMealType, setFoodsMenuOpenMealType] = useState<string>('');
  const foodsMenuRef = useRef<HTMLDivElement | null>(null);

  const [foodSearch, setFoodSearch] = useState<string>('');
  const searchTimeoutRef = useRef<number | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [foodMenuInputFocused, setFoodMenuInputFocused] = useState<boolean>(false);
  const [foodSearchResults, setFoodSearchResults] = useState<Food[]>([]);

  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [currentPageNumber, setCurrentPageNumber] = useState<number | null>(null);

// ---------------------------------------------------------------------------

  const [viewFoodMenuOpenId, setViewFoodMenuOpenId] = useState<number | null>(null);

  const [editingMealLogFoodId, setEditingMealLogFoodId] = useState<number | null>(null);

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
    mealLogOptionsMenuOpen,
    setMealLogOptionsMenuOpen,
    exerciseOptionsMenuOpenName,
    setExerciseOptionsMenuOpenName,
    mealFoodOptionsMenuOpenId,
    setMealFoodOptionsMenuOpenId,
    foodsMenuOpenMealType,
    setFoodsMenuOpenMealType,
    setFoodSearch,
    setFoodMenuInputFocused,
    setEditingMealLogFoodId,
    setViewFoodMenuOpenId,
    selectMealMenuOpenType,
    setSelectMealMenuOpenType,
    selectServingSizeMenuOpen,
    setSelectServingSizeMenuOpen,
    calendarOpenType,
    setCalendarOpenType,
    setCalendarDate,
    currentWorkoutLogDate,
    accountMenuRef,
    mealLogOptionsMenuRef,
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

  // const {
  //   handleFoodSearch,
  //   updateFoodSearch
  // } = useFoodSearch(
  //   setFoodSearchResults,
  //   setIsSearching,
  //   setTotalPages,
  //   setCurrentPageNumber,
  //   setBrandedFoods,
  //   setFoodSearch,
  //   searchTimeoutRef
  // );

  const {
    // handleAddFood,
    // handleLoadFoodNutrients,
    // handleUpdateFood,
    handleCopyWorkoutLogExercises,
    handleMoveWorkoutLogExercises,
    handleDeleteWorkoutLogExercises
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
                mealLogOptionsMenuOpen={mealLogOptionsMenuOpen}
                setMealLogOptionsMenuOpen={setMealLogOptionsMenuOpen}
                selectingWorkoutLogExercises={selectingWorkoutLogExercises}
                setSelectingWorkoutLogExercises={setSelectingWorkoutLogExercises}
                setAllItemsSelected={setAllItemsSelected}
                setSelectedMealTypes={setSelectedMealTypes}
                setSelectedWorkoutLogExerciseIds={setSelectedWorkoutLogExerciseIds}
                // mealLogs={workoutLogs}
                // mealLogFoods={mealLogFoods}
                // mealLogOptionsMenuRef={mealLogOptionsMenuRef}
                handleSetCalendarDate={handleSetCalendarDate}
                handleCopyWorkoutLogExercises={handleCopyWorkoutLogExercises}
                handleMoveWorkoutLogExercises={handleMoveWorkoutLogExercises}
                // handleDeleteMealLogFoods={handleDeleteMealLogFoods}
              />

            {/* 
              <SelectItemsHeader
                allItemsSelected={allItemsSelected}
                setAllItemsSelected={setAllItemsSelected}
                setSelectedMealTypes={setSelectedMealTypes}
                selectingMealLogFoods={selectingMealLogFoods}
                setSelectingMealLogFoods={setSelectingMealLogFoods}
                selectedMealLogFoodIds={selectedMealLogFoodIds}
                setSelectedMealLogFoodIds={setSelectedMealLogFoodIds}
                currentMealLogDate={currentMealLogDate}
                mealLogs={workoutLogs}
                mealLogFoods={mealLogFoods}
              />

              {viewFoodMenuOpenId ? (
                <ViewFoodMenu
                  currentMealLogDate={currentMealLogDate}
                  mealLogs={workoutLogs}
                  mealLogFoods={mealLogFoods}
                  foods={foods}
                  brandedFoods={brandedFoods}
                  foodNutrients={foodNutrients}
                  nutrients={nutrients}
                  numServings={numServings}
                  setNumServings={setNumServings}
                  servingSize={servingSize}
                  setServingSize={setServingSize}
                  servingSizeUnit={servingSizeUnit}
                  foodCaloriesFromMacros={foodCaloriesFromMacros}
                  macroAmountsGrams={macroAmountsGrams}
                  foodsMenuOpenMealType={foodsMenuOpenMealType}
                  setFoodsMenuOpenMealType={setFoodsMenuOpenMealType}
                  editingMealLogFoodId={editingMealLogFoodId}
                  setEditingMealLogFoodId={setEditingMealLogFoodId}
                  viewFoodMenuOpenId={viewFoodMenuOpenId}
                  setViewFoodMenuOpenId={setViewFoodMenuOpenId}
                  foodSearchResults={foodSearchResults}
                  selectMealMenuOpenType={selectMealMenuOpenType}
                  setSelectMealMenuOpenType={setSelectMealMenuOpenType}
                  selectServingSizeMenuOpen={selectServingSizeMenuOpen}
                  setSelectServingSizeMenuOpen={setSelectServingSizeMenuOpen}
                  foodsMenuRef={foodsMenuRef}
                  selectMealMenuRef={selectMealMenuRef}
                  selectServingSizeMenuRef={selectServingSizeMenuRef}
                  handleUpdateFood={handleUpdateFood}
                  handleAddFood={handleAddFood}
                />
              ) : (
                <FoodsMenu
                  foodsMenuOpenMealType={foodsMenuOpenMealType}
                  setFoodsMenuOpenMealType={setFoodsMenuOpenMealType}
                  foodSearch={foodSearch}
                  foodMenuInputFocused={foodMenuInputFocused}
                  setFoodMenuInputFocused={setFoodMenuInputFocused}
                  isSearching={isSearching}
                  foodSearchResults={foodSearchResults}
                  setNumServings={setNumServings}
                  setServingSize={setServingSize}
                  setServingSizeUnit={setServingSizeUnit}
                  brandedFoods={brandedFoods}
                  setViewFoodMenuOpenId={setViewFoodMenuOpenId}
                  totalPages={totalPages}
                  currentPageNumber={currentPageNumber}
                  setCurrentPageNumber={setCurrentPageNumber}
                  foodsMenuRef={foodsMenuRef}
                  searchTimeoutRef={searchTimeoutRef}
                  updateFoodSearch={updateFoodSearch}
                  handleFoodSearch={handleFoodSearch}
                  handleLoadFoodNutrients={handleLoadFoodNutrients}
                  handleAddFood={handleAddFood}
                />
              )} */}

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
                      setFoodsMenuOpenMealType={setFoodsMenuOpenMealType}
                      viewFoodMenuOpenId={viewFoodMenuOpenId}
                      setViewFoodMenuOpenId={setViewFoodMenuOpenId}
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
