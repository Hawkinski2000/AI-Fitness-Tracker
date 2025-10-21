import { useEffect, useState, useRef } from "react";
import {
  type MealLog,
  type MealLogFood,
  type Food,
  type BrandedFood,
  type FoodNutrient,
  type Nutrient
} from "../../types/meal-logs";
import useInitializeMealLogsPage from "../../hooks/useInitializeMealLogsPage";
import useMealLogsCaloriesHeader from "../../hooks/useMealLogsCaloriesHeader";
import { useAuth } from "../../../../context/auth/useAuth";
import { refreshAccessToken, isTokenExpired } from "../../../../utils/auth";
import { createMealLog,
         loadMealLogFoods,
         addMealLogFood,
         updateMealLogFood,
         deleteMealLogFood,
         loadFood,
         getFoods,
         loadBrandedFood,
         loadFoodNutrients,
         loadNutrient } from "../../../../utils/meal-logs";
import LoadingScreen from "../../../../components/LoadingScreen/LoadingScreen";
import Header from "../../../../components/Header/Header";
import Sidebar from "../../../../components/Sidebar/Sidebar";
import DateNav from "../DateNav/DateNav";
import CaloriesHeader from "../CaloriesHeader/CaloriesHeader";
import ViewFoodMenu from "../ViewFoodMenu/ViewFoodMenu";
import FoodsMenu from "../FoodsMenu/FoodsMenu";
import MealSection from "../MealSection/MealSection";
import './MealLogsPage.css';


export default function MealLogsPage() {
  const { accessToken, setAccessToken } = useAuth();

  const [mealLogs, setMealLogs] = useState<Record<string, MealLog>>({});
  const [currentMealLogDate, setCurrentMealLogDate] = useState<string | null>(null);
  const [today, setToday] = useState<string | null>(null);

  const [mealLogFoods, setMealLogFoods] = useState<Record<number, MealLogFood[]>>({});

  const [foods, setFoods] = useState<Record<number, Food>>({});

  const [brandedFoods, setBrandedFoods] = useState<Record<number, BrandedFood>>({});

  const [foodNutrients, setFoodNutrients] = useState<Record<number, FoodNutrient[]>>({});

  const [nutrients, setNutrients] = useState<Record<number, Nutrient>>({});

  const [foodCalories, setFoodCalories] = useState<number>(0);

  const [foodCaloriesFromMacros, setFoodCaloriesFromMacros] = useState<Record<number, number>>({});

  const [macroAmountsGrams, setMacroAmountsGrams] = useState<Record<number, Record<number, number>>>({});

  const [mealOptionsMenuOpenType, setMealOptionsMenuOpenType] = useState<string>('');
  const mealOptionsMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [mealFoodOptionsMenuOpenId, setMealFoodOptionsMenuOpenId] = useState<number | null>(null);
  const mealFoodOptionsMenuRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const [foodsMenuOpenMealType, setFoodsMenuOpenMealType] = useState<string>('');
  const foodsMenuRef = useRef<HTMLDivElement | null>(null);

  const [viewFoodMenuOpenId, setViewFoodMenuOpenId] = useState<number | null>(null);

  const [selectMealMenuOpenType, setSelectMealMenuOpenType] = useState<string>('');
  const selectMealMenuRef = useRef<HTMLDivElement | null>(null);

  const [numServings, setNumServings] = useState<number | null>(1);

  const [servingSize, setServingSize] = useState<number | null>(null);
  const [servingSizeUnit, setServingSizeUnit] = useState<string>('');
  const [selectServingSizeMenuOpen, setSelectServingSizeMenuOpen] = useState<boolean>(false);
  const selectServingSizeMenuRef = useRef<HTMLDivElement | null>(null);

  const [editingMealLogFoodId, setEditingMealLogFoodId] = useState<number | null>(null);

  const [foodSearch, setFoodSearch] = useState<string>('');
  const searchTimeoutRef = useRef<number | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [foodMenuInputFocused, setFoodMenuInputFocused] = useState<boolean>(false);
  const [foodSearchResults, setFoodSearchResults] = useState<Food[]>([]);

  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [currentPageNumber, setCurrentPageNumber] = useState<number | null>(null);
  const MAX_RESULTS_PER_PAGE = 30;

  const [accountMenuOpen, setAccountMenuOpen] = useState<boolean>(false);
  const accountMenuRef = useRef<HTMLDivElement | null>(null);

  const [tokensRemaining, setTokensRemaining] = useState<number>(0);

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
    
// ---------------------------------------------------------------------------

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target;

      if (
        accountMenuRef.current &&
        target instanceof Node &&
        !accountMenuRef.current.contains(target) &&
        !(target instanceof HTMLElement && target.classList.contains('account-image'))
      ) {
        setAccountMenuOpen(false);
      }

      if (
        mealOptionsMenuOpenType &&
        mealOptionsMenuRefs.current[mealOptionsMenuOpenType] &&
        target instanceof Node &&
        !mealOptionsMenuRefs.current[mealOptionsMenuOpenType].contains(target) &&
        !(target instanceof HTMLElement && target.classList.contains('meal-options-button'))
      ) {
        setMealOptionsMenuOpenType('');
      }

      if (
        mealFoodOptionsMenuOpenId &&
        mealFoodOptionsMenuRefs.current[mealFoodOptionsMenuOpenId] &&
        target instanceof Node &&
        !mealFoodOptionsMenuRefs.current[mealFoodOptionsMenuOpenId].contains(target) &&
        !(target instanceof HTMLElement && target.classList.contains('meal-log-food-options-button'))
      ) {
        setMealFoodOptionsMenuOpenId(null);
      }

      if (
        foodsMenuOpenMealType &&
        foodsMenuRef.current &&
        target instanceof Node &&
        !foodsMenuRef.current.contains(target) &&
        !(target instanceof HTMLElement && target.classList.contains('add-food-button'))
      ) {
        setFoodsMenuOpenMealType('');
        setFoodSearch('');
        setFoodMenuInputFocused(false);
        setEditingMealLogFoodId(null);
      }

      if (target instanceof HTMLElement && target.classList.contains('add-food-button')) {
        setViewFoodMenuOpenId(null);
      }

      if (
        selectMealMenuOpenType &&
        selectMealMenuRef.current &&
        target instanceof Node &&
        !selectMealMenuRef.current.contains(target) &&
        !(target instanceof HTMLElement && target.classList.contains('select-meal-button'))
      ) {
        setSelectMealMenuOpenType('');
      }

      if (
        selectServingSizeMenuOpen &&
        selectServingSizeMenuRef.current &&
        target instanceof Node &&
        !selectServingSizeMenuRef.current.contains(target) &&
        !(target instanceof HTMLElement && target.classList.contains('serving-size-button'))
      ) {
        setSelectServingSizeMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mealOptionsMenuOpenType, mealFoodOptionsMenuOpenId, foodsMenuOpenMealType, selectMealMenuOpenType, selectServingSizeMenuOpen]);

// ---------------------------------------------------------------------------

  const getDateLabel = (currentMealLogDate: string | null, today: string | null) => {
    if (!currentMealLogDate || !today) {
      return "";
    }

    const mealLogDate = new Date(currentMealLogDate);
    const todayDate = new Date(today);
    mealLogDate.setHours(0, 0, 0, 0);
    todayDate.setHours(0, 0, 0, 0);
    const differenceTime = mealLogDate.getTime() - todayDate.getTime();
    const differenceInDays = Math.round(differenceTime / (1000 * 60 * 60 * 24));

    if (differenceInDays === 0) {
      return 'Today';
    } else if (differenceInDays === 1) {
      return 'Tomorrow';
    } else if (differenceInDays === -1) {
      return 'Yesterday';
    }
    return currentMealLogDate.split("T")[0];
  };

// ---------------------------------------------------------------------------

  const handleChangeDate = async (direction: string) => {
    try {
      let token: string | null = accessToken;
      if (!accessToken || isTokenExpired(accessToken)) {
        token = await refreshAccessToken();  
        setAccessToken(token);
      }
      if (!token) {
        throw new Error("No access token");
      }

      if (!currentMealLogDate) {
        return;
      }

      let dayDifference = 0;
      if (direction === 'previous') {
        dayDifference -= 1;
      }
      else if (direction === 'next') {
        dayDifference += 1;
      }

      const prevDate = new Date(currentMealLogDate);
      prevDate.setDate(prevDate.getDate() + dayDifference);
      const newDate = prevDate.toISOString().split('T')[0];
      setCurrentMealLogDate(newDate);

      const currentMealLog = mealLogs[newDate];

      if (!currentMealLog) {
        return;
      }
      
      const currentMealLogId = currentMealLog.id;

      const loadedMealLogFoods = await loadMealLogFoods(currentMealLogId, setMealLogFoods, token);

      await Promise.all(
        Object.values(loadedMealLogFoods).map((mealLogFoodArray: MealLogFood[]) =>
          mealLogFoodArray.forEach((mealLogFoodItem: MealLogFood) => {
            loadFood(mealLogFoodItem.food_id, setFoods, token);
            loadBrandedFood(mealLogFoodItem.food_id, setBrandedFoods, token);
          })
        )
      );
    
    } catch (err) {
      console.error(err);
      setAccessToken(null);
    }
  }

// ---------------------------------------------------------------------------

  const handleDeleteMeal = async (mealType: string) => {
    try {
      let token: string | null = accessToken;
      if (!accessToken || isTokenExpired(accessToken)) {
        token = await refreshAccessToken();  
        setAccessToken(token);
      }
      if (!token) {
        throw new Error("No access token");
      }

      if (!currentMealLogDate) {
        return;
      }

      const currentMealLog = mealLogs[currentMealLogDate];

      const currentMealLogId = currentMealLog.id;

      const currentMealLogFoods = mealLogFoods[currentMealLogId];

      const mealLogFoodsInMealType = currentMealLogFoods.filter((mealLogFood: MealLogFood) => mealLogFood.meal_type === mealType);

      const mealLogFoodIdsInMealType = mealLogFoodsInMealType.map((mealLogFood: MealLogFood) => mealLogFood.id);

      await Promise.all(
        mealLogFoodIdsInMealType.map((mealLogFoodId: number) =>
          deleteMealLogFood(mealLogFoodId, setMealLogFoods, token))
      );

      setMealOptionsMenuOpenType('');

    } catch (err) {
      console.error(err);
      setAccessToken(null);

    } finally {
      setMealOptionsMenuOpenType('');
    }
  };

// ---------------------------------------------------------------------------

  const handleDeleteMealLogFood = async (mealLogFoodId: number) => {
    try {
      let token: string | null = accessToken;
      if (!accessToken || isTokenExpired(accessToken)) {
        token = await refreshAccessToken();
        setAccessToken(token);
      }
      if (!token) {
        throw new Error("No access token");
      }

      await deleteMealLogFood(mealLogFoodId, setMealLogFoods, token);

      setMealFoodOptionsMenuOpenId(null);

    } catch (err) {
      console.error(err);
      setAccessToken(null);
    }
  };

// ---------------------------------------------------------------------------

  const updateFoodSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const search = event.target.value;

    setFoodSearch(search);

    if (search === '') {
      return;
    }

    handleFoodSearch(search, 1);
  };

// ---------------------------------------------------------------------------

  const handleFoodSearch = async (search: string, pageNumber: number) => {
    setFoodSearch(search);

    if (search === '') {
      return;
    }

    setFoodSearchResults([]);
    setIsSearching(true);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        let token: string | null = accessToken;
        if (!accessToken || isTokenExpired(accessToken)) {
          token = await refreshAccessToken();  
          setAccessToken(token);
        }
        if (!token) {
          throw new Error("No access token");
        }

        const skip = (pageNumber - 1) * MAX_RESULTS_PER_PAGE;

        const foodSearchObject = await getFoods(MAX_RESULTS_PER_PAGE, skip, search, setFoodSearchResults, token);
        
        const numPages = Math.ceil(foodSearchObject.total_count / MAX_RESULTS_PER_PAGE);
        setTotalPages(numPages);
        setCurrentPageNumber(pageNumber);

        const foods = foodSearchObject.foods;

        await Promise.all(
          foods.map((food: Food) => 
            loadBrandedFood(food.id, setBrandedFoods, token)
          )
        );

      } catch (err) {
        console.error(err);
        setAccessToken(null);

      } finally {
        setIsSearching(false);
      }
    }, 1000);
  };

// ---------------------------------------------------------------------------

  const handleAddFood = async (foodId: number,
                               numServings: number | null = null,
                               servingSize: number | null = null) => {
    try {
      let token: string | null = accessToken;
      if (!accessToken || isTokenExpired(accessToken)) {
        token = await refreshAccessToken();  
        setAccessToken(token);
      }
      if (!token) {
        throw new Error("No access token");
      }

      if (!currentMealLogDate) {
        return;
      }

      let mealLog;
      if (!mealLogs[currentMealLogDate]) {
        mealLog = await createMealLog(currentMealLogDate, setMealLogs, token);
      }
      else {
        mealLog = mealLogs[currentMealLogDate];
      }

      const mealLogId = mealLog.id;

      await addMealLogFood(mealLogId,
                           foodId,
                           numServings,
                           servingSize,
                           foodsMenuOpenMealType,
                           setMealLogFoods,
                           setFoods,
                           token);

    } catch (err) {
      console.error(err);
      setAccessToken(null);
    }
  };

// ---------------------------------------------------------------------------

  const handleUpdateFood = async (mealLogFoodId: number,
                                  mealLogId: number | null,
                                  numServings: number | null = null,
                                  servingSize: number | null = null) => {
    try {
      let token: string | null = accessToken;
      if (!accessToken || isTokenExpired(accessToken)) {
        token = await refreshAccessToken();  
        setAccessToken(token);
      }
      if (!token) {
        throw new Error("No access token");
      }

      await updateMealLogFood(mealLogFoodId,
                              mealLogId,
                              numServings,
                              servingSize,
                              foodsMenuOpenMealType,
                              setMealLogFoods,
                              token);

    } catch (err) {
      console.error(err);
      setAccessToken(null);
    }
  };

// ---------------------------------------------------------------------------

  const handleLoadFoodNutrients = async (foodId: number) => {
    try {
      let token: string | null = accessToken;
      if (!accessToken || isTokenExpired(accessToken)) {
        token = await refreshAccessToken();  
        setAccessToken(token);
      }
      if (!token) {
        throw new Error("No access token");
      }

      const newFoodNutrients = await loadFoodNutrients(foodId, setFoodNutrients, token);

      await Promise.all(
        newFoodNutrients.map((foodNutrient: FoodNutrient) =>
          loadNutrient(foodNutrient.nutrient_id, setNutrients, token)
        )
      );

      const macros = newFoodNutrients.filter((foodNutrient: FoodNutrient) =>
        [1003, 1004, 1005].includes(foodNutrient.nutrient_id));

      const caloriesFromMacros = macros.reduce((sum, macro) =>
        sum + macro.amount * (macro.nutrient_id === 1004 ? 9 : 4)
      , 1);

      macros.forEach((macro: FoodNutrient) =>
        setMacroAmountsGrams(prev => ({
          ...prev,
          [foodId]: {
            ...(prev[foodId] || {}),
            [macro.nutrient_id]: macro.amount
          }
        })
      ));

      setFoodCaloriesFromMacros(prev => ({
        ...prev,
        [foodId]: caloriesFromMacros
      }));

    } catch (err) {
      console.error(err);
      setAccessToken(null);
    }
  };

// ---------------------------------------------------------------------------

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
              />

              <CaloriesHeader foodCalories={foodCalories} />

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

              <div className="meals-container">
                <MealSection
                  mealType="breakfast"
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

                <MealSection
                  mealType="lunch"
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

                <MealSection
                  mealType="dinner"
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

                <MealSection
                  mealType="snacks"
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
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
