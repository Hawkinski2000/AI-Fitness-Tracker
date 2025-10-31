import { useState, useRef } from "react";
import {
  type MealLog,
  type MealLogFood,
  type Food,
  type BrandedFood,
  type FoodNutrient,
  type Nutrient
} from "../../types/meal-logs";
import { type Value } from 'react-calendar/dist/shared/types.js';
import useInitializeMealLogsPage from "../../hooks/useInitializeMealLogsPage";
import useMealLogsCaloriesHeader from "../../hooks/useMealLogsCaloriesHeader";
import useMealLogsClickOutside from "../../hooks/useMealLogsClickOutside";
import useMealLogsDate from "../../hooks/useMealLogsDate";
import useFoodSearch from "../../hooks/useFoodSearch";
import useMealLogActions from "../../hooks/useMealLogActions";
import LoadingScreen from "../../../../components/LoadingScreen/LoadingScreen";
import Header from "../../../../components/Header/Header";
import Sidebar from "../../../../components/Sidebar/Sidebar";
import DateNav from "../DateNav/DateNav";
import CaloriesHeader from "../CaloriesHeader/CaloriesHeader";
import SelectItemsHeader from "../SelectItemsHeader/SelectItemsHeader";
import ViewFoodMenu from "../ViewFoodMenu/ViewFoodMenu";
import FoodsMenu from "../FoodsMenu/FoodsMenu";
import MealSection from "../MealSection/MealSection";
import './MealLogsPage.css';


export default function MealLogsPage() {
  const [accountMenuOpen, setAccountMenuOpen] = useState<boolean>(false);
  const accountMenuRef = useRef<HTMLDivElement | null>(null);

  const [tokensRemaining, setTokensRemaining] = useState<number>(0);

// ---------------------------------------------------------------------------

  const [currentMealLogDate, setCurrentMealLogDate] = useState<Value>(new Date());
  const [today, setToday] = useState<Value>(new Date());
  
// ---------------------------------------------------------------------------

  const [mealLogs, setMealLogs] = useState<Record<string, MealLog>>({});

  const [mealLogFoods, setMealLogFoods] = useState<Record<number, MealLogFood[]>>({});

  const [foods, setFoods] = useState<Record<number, Food>>({});

  const [brandedFoods, setBrandedFoods] = useState<Record<number, BrandedFood>>({});

  const [foodNutrients, setFoodNutrients] = useState<Record<number, FoodNutrient[]>>({});

  const [nutrients, setNutrients] = useState<Record<number, Nutrient>>({});

// ---------------------------------------------------------------------------

  const [foodCalories, setFoodCalories] = useState<number>(0);

  const [foodCaloriesFromMacros, setFoodCaloriesFromMacros] = useState<Record<number, number>>({});

  const [macroAmountsGrams, setMacroAmountsGrams] = useState<Record<number, Record<number, number>>>({});

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

  const { userData, loading } = useInitializeMealLogsPage(
    setTokensRemaining,
    setMealLogs,
    setToday,
    setCurrentMealLogDate,
    setMealLogFoods,
    setFoods,
    setBrandedFoods
  );

  useMealLogsCaloriesHeader(
    currentMealLogDate,
    mealLogs,
    mealLogFoods,
    setFoodCalories
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
    currentMealLogDate,
    accountMenuRef,
    mealLogOptionsMenuRef,
    mealOptionsMenuRefs,
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
  } = useMealLogsDate(
    currentMealLogDate,
    setCurrentMealLogDate,
    mealLogs,
    setMealLogs,
    setMealLogFoods,
    setFoods,
    setBrandedFoods,
    setCalendarOpenType,
    setCalendarDate
  );

  const {
    handleFoodSearch,
    updateFoodSearch
  } = useFoodSearch(
    setFoodSearchResults,
    setIsSearching,
    setTotalPages,
    setCurrentPageNumber,
    setBrandedFoods,
    setFoodSearch,
    searchTimeoutRef
  );

  const {
    handleAddFood,
    handleLoadFoodNutrients,
    handleUpdateFood,
    handleCopyMealLogFoods,
    handleMoveMealLogFoods,
    handleDeleteMeal,
    handleDeleteMealLogFood
  } = useMealLogActions(
    currentMealLogDate,
    setCurrentMealLogDate,
    calendarDate,
    mealLogs,
    setMealLogs,
    foodsMenuOpenMealType,
    setMealLogFoods,
    setFoods,
    setFoodNutrients,
    setNutrients,
    setMacroAmountsGrams,
    setFoodCaloriesFromMacros,
    mealLogFoods,
    selectedMealLogFoodIds,
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
          <Sidebar currentPage={'meal-logs'} />

          <main className="meal-logs-page-main">
            <div className='meal-logs-page-content'>
              <DateNav
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
                mealLogs={mealLogs}
                mealLogFoods={mealLogFoods}
                mealLogOptionsMenuRef={mealLogOptionsMenuRef}
                handleSetCalendarDate={handleSetCalendarDate}
                handleCopyMealLogFoods={handleCopyMealLogFoods}
                handleMoveMealLogFoods={handleMoveMealLogFoods}
              />

              <CaloriesHeader foodCalories={foodCalories} />

              <SelectItemsHeader
                allItemsSelected={allItemsSelected}
                setAllItemsSelected={setAllItemsSelected}
                setSelectedMealTypes={setSelectedMealTypes}
                selectingMealLogFoods={selectingMealLogFoods}
                setSelectingMealLogFoods={setSelectingMealLogFoods}
                selectedMealLogFoodIds={selectedMealLogFoodIds}
                setSelectedMealLogFoodIds={setSelectedMealLogFoodIds}
                currentMealLogDate={currentMealLogDate}
                mealLogs={mealLogs}
                mealLogFoods={mealLogFoods}
              />

              {viewFoodMenuOpenId ? (
                <ViewFoodMenu
                  currentMealLogDate={currentMealLogDate}
                  mealLogs={mealLogs}
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
              )}

              <div
                className={
                  `meals-container
                  ${selectingMealLogFoods && 'meals-container-selecting-items'}`
                }
              >
                {['breakfast', 'lunch', 'dinner', 'snacks'].map((mealType: string) => {
                  return (
                    <MealSection
                      key={mealType}
                      mealType={mealType}
                      currentMealLogDate={currentMealLogDate}
                      mealLogs={mealLogs}
                      mealLogFoods={mealLogFoods}
                      foods={foods}
                      brandedFoods={brandedFoods}
                      foodNutrients={foodNutrients}
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
                      setViewFoodMenuOpenId={setViewFoodMenuOpenId}
                      setNumServings={setNumServings}
                      setServingSize={setServingSize}
                      setServingSizeUnit={setServingSizeUnit}
                      setFoodSearch={setFoodSearch}
                      setFoodMenuInputFocused={setFoodMenuInputFocused}
                      mealOptionsMenuRefs={mealOptionsMenuRefs}
                      mealFoodOptionsMenuRefs={mealFoodOptionsMenuRefs}
                      handleDeleteMeal={handleDeleteMeal}
                      handleDeleteMealLogFood={handleDeleteMealLogFood}
                      handleLoadFoodNutrients={handleLoadFoodNutrients}
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
