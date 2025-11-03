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
import useMealLogsClickOutside from "../../hooks/useMealLogsClickOutside";
import useMealLogsDate from "../../hooks/useMealLogsDate";
import useFoodSearch from "../../hooks/useFoodSearch";
import useMealLogActions from "../../hooks/useMealLogActions";
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

  const [mealOptionsMenuOpenType, setMealOptionsMenuOpenType] = useState<string>('');
  const mealOptionsMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [mealFoodOptionsMenuOpenId, setMealFoodOptionsMenuOpenId] = useState<number | null>(null);
  const mealFoodOptionsMenuRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const [selectingMealLogFoods, setSelectingMealLogFoods] = useState<boolean>(false);
  const [allItemsSelected, setAllItemsSelected] = useState<boolean>(false);
  const [selectedMealTypes, setSelectedMealTypes] = useState<string[]>([]);
  const [selectedMealLogFoodIds, setSelectedMealLogFoodIds] = useState<number[]>([]);
  
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

  const [numServings, setNumServings] = useState<number | null>(1);

  const [servingSize, setServingSize] = useState<number | null>(null);
  const [selectServingSizeMenuOpen, setSelectServingSizeMenuOpen] = useState<boolean>(false);
  const selectServingSizeMenuRef = useRef<HTMLDivElement | null>(null);

  const [servingSizeUnit, setServingSizeUnit] = useState<string>('');

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

  useMealLogsClickOutside(
    setAccountMenuOpen,
    mealLogOptionsMenuOpen,
    setMealLogOptionsMenuOpen,
    mealOptionsMenuOpenType,
    setMealOptionsMenuOpenType,
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
    mealOptionsMenuRefs,
    mealFoodOptionsMenuRefs,
    foodsMenuRef,
    selectMealMenuRef,
    selectServingSizeMenuRef,
    calendarRef
  );

  // const {
  //   getDateLabel,
  //   handleChangeDate,
  //   handleSetCalendarDate
  // } = useMealLogsDate(
  //   currentMealLogDate,
  //   setCurrentMealLogDate,
  //   workoutLogs,
  //   setWorkoutLogs,
  //   setMealLogFoods,
  //   setFoods,
  //   setBrandedFoods,
  //   setCalendarOpenType,
  //   setCalendarDate
  // );

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

  // const {
  //   handleAddFood,
  //   handleLoadFoodNutrients,
  //   handleUpdateFood,
  //   handleCopyMealLogFoods,
  //   handleMoveMealLogFoods,
  //   handleDeleteMealLogFoods
  // } = useMealLogActions(
  //   currentMealLogDate,
  //   setCurrentMealLogDate,
  //   calendarDate,
  //   workoutLogs,
  //   setWorkoutLogs,
  //   foodsMenuOpenMealType,
  //   setMealLogFoods,
  //   setFoods,
  //   setFoodNutrients,
  //   setNutrients,
  //   setMacroAmountsGrams,
  //   setFoodCaloriesFromMacros,
  //   selectedMealLogFoodIds,
  //   setCalendarOpenType
  // );

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
              {/* <DateNav
                currentMealLogDate={currentMealLogDate}
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
                selectingMealLogFoods={selectingMealLogFoods}
                setSelectingMealLogFoods={setSelectingMealLogFoods}
                setAllItemsSelected={setAllItemsSelected}
                setSelectedMealTypes={setSelectedMealTypes}
                setSelectedMealLogFoodIds={setSelectedMealLogFoodIds}
                mealLogs={workoutLogs}
                mealLogFoods={mealLogFoods}
                mealLogOptionsMenuRef={mealLogOptionsMenuRef}
                handleSetCalendarDate={handleSetCalendarDate}
                handleCopyMealLogFoods={handleCopyMealLogFoods}
                handleMoveMealLogFoods={handleMoveMealLogFoods}
                handleDeleteMealLogFoods={handleDeleteMealLogFoods}
              />

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
                  ${selectingMealLogFoods && 'exercises-container-selecting-items'}`
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
                      mealOptionsMenuOpenType={mealOptionsMenuOpenType}
                      setMealOptionsMenuOpenType={setMealOptionsMenuOpenType}
                      mealFoodOptionsMenuOpenId={mealFoodOptionsMenuOpenId}
                      setMealFoodOptionsMenuOpenId={setMealFoodOptionsMenuOpenId}
                      setAllItemsSelected={setAllItemsSelected}
                      selectedMealTypes={selectedMealTypes}
                      setSelectedMealTypes={setSelectedMealTypes}
                      selectedMealLogFoodIds={selectedMealLogFoodIds}
                      setSelectedMealLogFoodIds={setSelectedMealLogFoodIds}
                      selectingMealLogFoods={selectingMealLogFoods}
                      setCalendarOpenType={setCalendarOpenType}
                      editingMealLogFoodId={editingMealLogFoodId}
                      setEditingMealLogFoodId={setEditingMealLogFoodId}
                      setFoodsMenuOpenMealType={setFoodsMenuOpenMealType}
                      viewFoodMenuOpenId={viewFoodMenuOpenId}
                      setViewFoodMenuOpenId={setViewFoodMenuOpenId}
                      setNumServings={setNumServings}
                      setServingSize={setServingSize}
                      setServingSizeUnit={setServingSizeUnit}
                      mealOptionsMenuRefs={mealOptionsMenuRefs}
                      mealFoodOptionsMenuRefs={mealFoodOptionsMenuRefs}
                      // handleDeleteMealLogFoods={handleDeleteMealLogFoods}
                      // handleLoadFoodNutrients={handleLoadFoodNutrients}
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
