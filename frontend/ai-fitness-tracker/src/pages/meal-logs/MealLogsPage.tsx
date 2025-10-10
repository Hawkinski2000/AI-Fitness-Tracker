import { useEffect, useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/auth/useAuth";
import { type User } from "../chat/ChatPage";
import { refreshAccessToken, logOut, getUserFromToken, isTokenExpired } from "../../utils/auth";
import { loadMealLogs,
         createMealLog,
         loadMealLogFoods,
         addMealLogFood,
         deleteMealLogFood,
         loadFood, getFoods,
         loadBrandedFood,
         loadFoodNutrients,
         loadNutrient } from "../../utils/meal-logs";
import { PropagateLoader } from 'react-spinners';
import MacroDoughnutChart from "../../components/MacroDoughnutChart";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import arrowLeftIcon from '../../assets/arrow-left-icon.svg';
import arrowRightIcon from '../../assets/arrow-right-icon.svg';
import closeIcon from '../../assets/close-icon.svg';
import addIcon from '../../assets/add-icon.svg';
import dotsIcon from '../../assets/dots-icon.svg';
import copyIcon from '../../assets/copy-icon.svg';
import moveIcon from '../../assets/move-icon.svg';
import deleteIcon from '../../assets/delete-icon.svg';
import backIcon from '../../assets/back-icon.svg';
import checkIcon from '../../assets/check-icon.svg';
import './MealLogsPage.css';


export interface MealLog {
  id: number;
  log_date: string;
  total_calories: number | null;
}
export interface MealLogFood {
  id: number;
  meal_log_id: number;
  food_id: number;
  meal_type: string;
  num_servings: number;
  serving_size: number;
  serving_unit: string;
  created_at: string;
  calories: number | null;
}
export interface Food {
  id: number;
  description: string;
  calories: number | null;
  user_id: number | null;
  user_created_at: string | null;
}
export interface BrandedFood {
  food_id: number;
  brand_owner: string | null;
  brand_name: string | null;
  subbrand_name: string | null;
  ingredients: string | null;
  serving_size: number | null;
  serving_size_unit: string | null;
  food_category: string | null;
}
export interface FoodNutrient {
  id: number;
  food_id: number;
  nutrient_id: number;
  amount: number;
}
export interface Nutrient {
  id: number;
  name: string;
  unit_name: string;
}

export default function MealLogsPage() {
  const { accessToken, setAccessToken } = useAuth();
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

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

  const [foodSearch, setFoodSearch] = useState<string>('');
  const searchTimeoutRef = useRef<number | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [foodMenuInputFocused, setFoodMenuInputFocused] = useState<boolean>(false);
  const [foodSearchResults, setFoodSearchResults] = useState<Food[]>([]);

  const [accountMenuOpen, setAccountMenuOpen] = useState<boolean>(false);
  const accountMenuRef = useRef<HTMLDivElement | null>(null);

  const [tokensRemaining, setTokensRemaining] = useState<number>(0);

// ---------------------------------------------------------------------------
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const token = await refreshAccessToken();  
  
          if (!token) {
            throw new Error("No access token");
          }
  
          setAccessToken(token);
  
          const userData = await getUserFromToken(token);
          setUserData(userData);
          setTokensRemaining(Math.min(userData.input_tokens_remaining, userData.output_tokens_remaining))

          const loadedMealLogs = await loadMealLogs(setMealLogs, token);

          const today = new Date().toISOString().split('T')[0];
          setToday(today);
          setCurrentMealLogDate(today);

          const currentMealLog = loadedMealLogs[today];

          if (!currentMealLog) {
            return;
          }
          
          const currentMealLogId = currentMealLog.id;

          const loadedMealLogFoods = await loadMealLogFoods(currentMealLogId, setMealLogFoods, token);

          await Promise.all(
            Object.values(loadedMealLogFoods).map(mealLogFood =>
              mealLogFood.forEach((mealLogFoodObject: MealLogFood) => {
                loadFood(mealLogFoodObject.food_id, setFoods, token);
                loadBrandedFood(mealLogFoodObject.food_id, setBrandedFoods, token);
              })
            )
          );

        } catch (err) {
          console.error(err);
          setAccessToken(null);
          navigate("/");
  
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, [setAccessToken, navigate]);

// ---------------------------------------------------------------------------

    useEffect(() => {
      if (!currentMealLogDate) {
        return;
      }

      const currentMealLog = mealLogs[currentMealLogDate];
      if (!currentMealLog) {
        setFoodCalories(0);
        return;
      }

      const currentMealLogFoods = mealLogFoods[currentMealLog.id] || [];

      let totalCalories = 0;

      currentMealLogFoods.forEach((mealLogFood: MealLogFood) => {
        totalCalories += mealLogFood.calories || 0;
      });

      setFoodCalories(totalCalories);
    }, [currentMealLogDate, mealLogs, mealLogFoods]);

// ---------------------------------------------------------------------------

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target;

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
        setViewFoodMenuOpenId(null);
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

  const handleLogOut = async () => {
    logOut();
    setAccessToken(null);
    navigate("/");
  };

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

    handleFoodSearch(search);
  };

// ---------------------------------------------------------------------------

  const handleFoodSearch = async (search: string) => {
    setFoodSearch(search);

    if (search === '') {
      return;
    }

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

        const foods = await getFoods(20, 0, search, setFoodSearchResults, token);

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

  const getMacroNutrient = (nutrientId: number) => {
    if (!viewFoodMenuOpenId || !foodNutrients[viewFoodMenuOpenId]) {
      return 0;
    }

    const foodMacroNutrient = foodNutrients[viewFoodMenuOpenId].find((foodNutrient: FoodNutrient) =>
      foodNutrient.nutrient_id === nutrientId
    );

    if (!foodMacroNutrient) {
      return 0;
    }

    return foodMacroNutrient.amount;
  };

// ---------------------------------------------------------------------------

  if (loading) {
    return (
      <div className='loading-screen'>
        <PropagateLoader size={20} color="#00ffcc" />
      </div>
    );
  }

// ---------------------------------------------------------------------------

  return (
    <>
      <div className='meal-logs-page'>

{/* ---------------------------------------------------------------------- */}

        <Header
          isRemovingTokens={null}
          tokensRemaining={tokensRemaining}
          accountMenuOpen={accountMenuOpen}
          setAccountMenuOpen={setAccountMenuOpen}
          userData={userData}
          accountMenuRef={accountMenuRef}
          handleLogOut={handleLogOut}
        />

{/* ---------------------------------------------------------------------- */}

        <div className="page-body">
          <Sidebar currentPage={'meal-logs'} />

{/* ---------------------------------------------------------------------- */}
{/* ---- Date Nav ---- */}

          <main className="meal-logs-page-main">
            <div className='meal-logs-page-content'>
              <div className="date-nav-container">
                <nav className="date-nav">
                  <button
                    className="date-nav-button"
                    onClick={() => handleChangeDate('previous')}
                  >
                    <img className="button-link-image" src={arrowLeftIcon} />
                  </button>
                  <button
                    className="date-nav-button"
                  >
                    {(currentMealLogDate && today) ? getDateLabel(currentMealLogDate, today) : ""}
                  </button>
                  <button
                    className="date-nav-button"
                    onClick={() => handleChangeDate('next')}
                  >
                    <img className="button-link-image" src={arrowRightIcon} />
                  </button>
                </nav>
              </div>

{/* ---------------------------------------------------------------------- */}
{/* ---- Calories Remaining Header ---- */}

              <header className="calories-header">
                <p className="calories-remaining-text">Calories Remaining</p>

                <div className="calories-remaining-calculation">
                  <div className="calories-remaining-section">
                    <p>3,500</p>
                    <p className="calories-remaining-section-label">Goal</p>
                  </div>

                  <div className="calories-remaining-section">
                    <p>-</p>
                  </div>

                  <div className="calories-remaining-section">
                    <p>{foodCalories}</p>
                    <p className="calories-remaining-section-label">Food</p>
                  </div>

                  <div className="calories-remaining-section">
                    <p>+</p>
                  </div>

                  <div className="calories-remaining-section">
                    <p>0</p>
                    <p className="calories-remaining-section-label">Exercise</p>
                  </div>

                  <div className="calories-remaining-section">
                    <p>=</p>
                  </div>

                  <div className="calories-remaining-section">
                    <p>3,500</p>
                    <p className="calories-remaining-section-label">Remaining</p>
                  </div>
                </div>
              </header>

{/* ---------------------------------------------------------------------- */}
{/* ---- Foods Menu ---- */}

              {viewFoodMenuOpenId ? (
                <div
                  className={`foods-menu ${foodsMenuOpenMealType && 'foods-menu-open'}`}
                  ref={foodsMenuRef}
                >
                  <header className="view-food-menu-header">
                    <div className="view-food-menu-section-content">
                      <button
                        className="view-food-menu-text-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setViewFoodMenuOpenId(null);
                        }}
                      >
                        <img className="button-link-image" src={backIcon} />
                      </button>
                      <p>Add Food</p>
                      <button
                        className="view-food-menu-text-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddFood(viewFoodMenuOpenId, numServings, servingSize);
                          setViewFoodMenuOpenId(null);
                        }}
                      >
                        <img className="button-link-image" src={checkIcon} />
                      </button>
                    </div>
                  </header>

                  {(!foodNutrients[viewFoodMenuOpenId] || !foodCaloriesFromMacros[viewFoodMenuOpenId]) ? (
                    <div className="food-menu-results-loading-container">
                      <PropagateLoader size={20} color="#00ffcc" />
                    </div>
                  ) : (
                    <div className="view-food-menu-content">
                      <section className="view-food-menu-section">
                        <div className="view-food-menu-section-content">
                          <h3 className="view-food-menu-content-heading">
                            {foodSearchResults.filter((food: Food) => food.id === viewFoodMenuOpenId)[0].description || ''}
                          </h3>
                        </div>
                      </section>

                      <section className="view-food-menu-section">
                        <div className="view-food-menu-section-content">
                          <p className="view-food-menu-section-column-text">Meal</p>
                          <div className="view-food-menu-section-column">
                            <button
                              className="view-food-menu-text-button select-meal-button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectMealMenuOpenType((prev) => (prev === foodsMenuOpenMealType ? '' : foodsMenuOpenMealType));
                              }}
                            >
                              {foodsMenuOpenMealType}
                            </button>

                            <div
                              ref={el => { selectMealMenuRef.current = el }}
                              className={`meal-options-menu select-meal-menu ${selectMealMenuOpenType && 'meal-options-menu-open'}`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              {foodsMenuOpenMealType !== 'breakfast' && (
                                <button
                                  className="meal-options-menu-button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setFoodsMenuOpenMealType('breakfast')
                                    setSelectMealMenuOpenType('');
                                  }}
                                >
                                  Breakfast
                                </button>
                              )}

                              {foodsMenuOpenMealType !== 'lunch' && (
                                <button
                                  className="meal-options-menu-button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setFoodsMenuOpenMealType('lunch');
                                    setSelectMealMenuOpenType('');
                                  }}
                                >
                                  Lunch
                                </button>
                              )}

                              {foodsMenuOpenMealType !== 'dinner' && (
                                <button
                                  className="meal-options-menu-button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setFoodsMenuOpenMealType('dinner');
                                    setSelectMealMenuOpenType('');
                                  }}
                                >
                                  Dinner
                                </button>
                              )}

                              {foodsMenuOpenMealType !== 'snacks' && (
                                <button
                                  className="meal-options-menu-button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setFoodsMenuOpenMealType('snacks');
                                    setSelectMealMenuOpenType('');
                                  }}
                                >
                                  Snacks
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </section>

                      <section className="view-food-menu-section">
                        <div className="view-food-menu-section-content">
                          <p className="view-food-menu-section-column-text">Number of Servings</p>
                            <input
                              className="view-food-menu-input"
                              type="number"
                              value={numServings === null ? '' : numServings}
                              onInput={(e) => {
                                e.preventDefault();
                                const value = e.currentTarget.value;
                                const parsed = parseFloat(value);
                                if (parsed < 0) {
                                  setNumServings(1);
                                }
                                else {
                                  setNumServings(parsed);
                                }
                              }}
                              onBlur={() => {
                                if (!numServings) {
                                  setNumServings(1);
                                }
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.currentTarget.blur();
                                }
                              }}
                            />
                        </div>
                      </section>

                      <section className="view-food-menu-section">
                        <div className="view-food-menu-section-content">
                          <p className="view-food-menu-section-column-text">Serving Size</p>
                          <div className="view-food-menu-section-column">
                            <button
                              className="view-food-menu-text-button serving-size-button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectServingSizeMenuOpen((prev) => !prev);
                              }}
                            >
                              {servingSize?.toFixed(1).replace(/\.0$/, '') || ''}{' '}
                              {servingSizeUnit || ''}
                            </button>

                            <div
                              ref={el => { selectServingSizeMenuRef.current = el }}
                              className={`meal-options-menu select-serving-size-menu ${selectServingSizeMenuOpen && 'meal-options-menu-open'}`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              {(selectServingSizeMenuOpen && servingSize === 1) && (
                                <button
                                  className="meal-options-menu-button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setServingSize(brandedFoods[viewFoodMenuOpenId].serving_size || null);
                                    setSelectServingSizeMenuOpen(false);
                                  }}
                                >
                                  {(brandedFoods[viewFoodMenuOpenId].serving_size)?.toFixed(1).replace(/\.0$/, '') || ''}{' '}
                                  {brandedFoods[viewFoodMenuOpenId].serving_size_unit || ''}
                                </button>
                              )}

                              {(selectServingSizeMenuOpen &&
                                servingSize === (brandedFoods[viewFoodMenuOpenId].serving_size || null)) && (
                                <button
                                  className="meal-options-menu-button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setServingSize(1);
                                    setSelectServingSizeMenuOpen(false);
                                  }}
                                >
                                  1 {brandedFoods[viewFoodMenuOpenId].serving_size_unit || ''}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </section>

                      <section className="view-food-menu-section">
                        <div className="view-food-menu-section-content">
                          <div className="view-food-menu-section-column">
                            <MacroDoughnutChart
                              calories={
                                Number(((foodSearchResults.find((food: Food) =>
                                food.id === viewFoodMenuOpenId)?.calories ?? 0)
                                * (numServings || 1)
                                * ((servingSize || (brandedFoods[viewFoodMenuOpenId].serving_size || 1))
                                / (brandedFoods[viewFoodMenuOpenId].serving_size || 1)))
                                .toFixed(1).replace(/\.0$/, ''))
                              }
                              carbsCalories={
                                getMacroNutrient(1005) * 4
                                * (numServings || 1)
                                * ((servingSize || (brandedFoods[viewFoodMenuOpenId].serving_size || 1))
                                / (brandedFoods[viewFoodMenuOpenId].serving_size || 1))
                              }
                              fatCalories={
                                getMacroNutrient(1004) * 9
                                * (numServings || 1)
                                * ((servingSize || (brandedFoods[viewFoodMenuOpenId].serving_size || 1))
                                / (brandedFoods[viewFoodMenuOpenId].serving_size || 1))
                              }
                              proteinCalories={
                                getMacroNutrient(1003) * 4
                                * (numServings || 1)
                                * ((servingSize || (brandedFoods[viewFoodMenuOpenId].serving_size || 1))
                                / (brandedFoods[viewFoodMenuOpenId].serving_size || 1))
                              }
                            />
                          </div>

                          <div className="view-food-menu-section-column">
                            <p className="view-food-menu-section-column-label" style={{color: '#00ffcc'}}>
                              {`${
                                  (
                                    (getMacroNutrient(1005) * 4
                                    * (numServings || 1)
                                    * ((servingSize || (brandedFoods[viewFoodMenuOpenId].serving_size || 1))
                                    / (brandedFoods[viewFoodMenuOpenId].serving_size || 1)))
                                    /
                                    (foodCaloriesFromMacros[viewFoodMenuOpenId]
                                    * (numServings || 1)
                                    * ((servingSize || (brandedFoods[viewFoodMenuOpenId].serving_size || 1))
                                    / (brandedFoods[viewFoodMenuOpenId].serving_size || 1)))
                                    * 100
                                  ).toFixed(1).replace(/\.0$/, '')
                                } %`
                              }
                            </p>
                            <p className="view-food-menu-section-column-text">
                              {`${(getMacroNutrient(1005)
                                * (numServings || 1)
                                * ((servingSize || (brandedFoods[viewFoodMenuOpenId].serving_size || 1))
                                / (brandedFoods[viewFoodMenuOpenId].serving_size || 1))
                                ).toFixed(1).replace(/\.0$/, '')} g`}
                            </p>
                            <p className="view-food-menu-section-column-label">Carbs</p>
                          </div>

                          <div className="view-food-menu-section-column">
                            <p className="view-food-menu-section-column-label" style={{color: '#ff00c8'}}>
                              {`${
                                  (
                                    (getMacroNutrient(1004) * 9
                                    * (numServings || 1)
                                    * ((servingSize || (brandedFoods[viewFoodMenuOpenId].serving_size || 1))
                                    / (brandedFoods[viewFoodMenuOpenId].serving_size || 1)))
                                    /
                                    (foodCaloriesFromMacros[viewFoodMenuOpenId]
                                    * (numServings || 1)
                                    * ((servingSize || (brandedFoods[viewFoodMenuOpenId].serving_size || 1))
                                    / (brandedFoods[viewFoodMenuOpenId].serving_size || 1)))
                                    * 100
                                  ).toFixed(1).replace(/\.0$/, '')
                                } %`
                              }
                            </p>
                            <p className="view-food-menu-section-column-text">
                              {`${(getMacroNutrient(1004)
                                * (numServings || 1)
                                * ((servingSize || (brandedFoods[viewFoodMenuOpenId].serving_size || 1))
                                / (brandedFoods[viewFoodMenuOpenId].serving_size || 1))
                                ).toFixed(1).replace(/\.0$/, '')} g`}
                            </p>
                            <p className="view-food-menu-section-column-label">Fat</p>
                          </div>

                          <div className="view-food-menu-section-column">
                            <p className="view-food-menu-section-column-label" style={{color: '#ffe600'}}>
                              {`${
                                  (
                                    (getMacroNutrient(1003) * 4
                                    * (numServings || 1)
                                    * ((servingSize || (brandedFoods[viewFoodMenuOpenId].serving_size || 1))
                                    / (brandedFoods[viewFoodMenuOpenId].serving_size || 1)))
                                    /
                                    (foodCaloriesFromMacros[viewFoodMenuOpenId]
                                    * (numServings || 1)
                                    * ((servingSize || (brandedFoods[viewFoodMenuOpenId].serving_size || 1))
                                    / (brandedFoods[viewFoodMenuOpenId].serving_size || 1)))
                                    * 100
                                  ).toFixed(1).replace(/\.0$/, '')
                                } %`
                              }
                            </p>
                            <p className="view-food-menu-section-column-text">
                              {`${(getMacroNutrient(1003)
                                * (numServings || 1)
                                * ((servingSize || (brandedFoods[viewFoodMenuOpenId].serving_size || 1))
                                / (brandedFoods[viewFoodMenuOpenId].serving_size || 1))
                                ).toFixed(1).replace(/\.0$/, '')} g`}
                            </p>
                            <p className="view-food-menu-section-column-label">Protein</p>
                          </div>
                        </div>
                      </section>

                      {foodNutrients[viewFoodMenuOpenId].map((foodNutrient: FoodNutrient) => {
                        return (
                          <section className="view-food-menu-section">
                            <div className="view-food-menu-section-content">
                              <p className="view-food-menu-section-column-text">
                                {nutrients[foodNutrient.nutrient_id]?.name}
                              </p>

                              <p className="view-food-menu-section-column-text">
                                {(foodNutrient.amount
                                * (numServings || 1)
                                * ((servingSize || (brandedFoods[viewFoodMenuOpenId].serving_size || 1))
                                / (brandedFoods[viewFoodMenuOpenId].serving_size || 1))
                                ).toFixed(1).replace(/\.0$/, '')}{' '}
                                {nutrients[foodNutrient.nutrient_id]?.unit_name.toLowerCase()}
                              </p>
                            </div>
                          </section>
                        )
                      })}

                      <section className="view-food-menu-section">
                        <div className="view-food-menu-section-content">
                          <p className="view-food-menu-section-column-text">
                            Ingredients: {brandedFoods[viewFoodMenuOpenId].ingredients}
                          </p>
                        </div>
                      </section>
                    </div>
                    )}
                </div>
              ) : (
                <div
                  className={`foods-menu ${foodsMenuOpenMealType && 'foods-menu-open'}`}
                  ref={foodsMenuRef}
                >

                  <button
                    className="foods-menu-close-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFoodsMenuOpenMealType('');
                    }}
                  >
                    <img className="button-link-image" src={closeIcon} />
                  </button>

                  <div className="foods-menu-input-container">
                    <div className="foods-menu-input-placeholder-container">
                      <input
                        className='foods-menu-input'
                        type='text'
                        value={foodSearch}
                        onChange={updateFoodSearch}
                        onFocus={() => setFoodMenuInputFocused(true)}
                        onBlur={() => setFoodMenuInputFocused(false)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            if (searchTimeoutRef.current) {
                              clearTimeout(searchTimeoutRef.current);
                            }
                            handleFoodSearch(foodSearch);
                            e.preventDefault();
                          }
                        }}
                      />
                      <span
                        className={
                          `placeholder foods-menu-placeholder
                          ${foodSearch ? 'float' : ''}
                          ${foodMenuInputFocused ? 'float focus' : ''}`
                        }
                      >
                        Search foods
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="foods-menu-results-header">Search Results</h3>

                    {isSearching ? (
                      <div className="food-menu-results-loading-container">
                        <PropagateLoader size={20} color="#00ffcc" />
                      </div>
                    ) : (
                      <div className="food-menu-results">
                        {foodSearchResults.map((food: Food) => {
                          return (
                            <div
                              key={food.id}
                              className="foods-menu-results-food"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLoadFoodNutrients(food.id);
                                setNumServings(1);
                                setServingSize(brandedFoods[food.id].serving_size || null);
                                setServingSizeUnit(brandedFoods[food.id].serving_size_unit || '');
                                setViewFoodMenuOpenId(food.id);
                              }}
                            >
                              <div className="meal-log-food-section">
                                <p className="meal-log-food-text">{food.description}</p>
                                <p className="meal-log-food-serving-text">
                                  {food.calories ? `${food.calories} cal, ` : ''}
                                  {brandedFoods[food.id].serving_size?.toFixed(1).replace(/\.0$/, '') || 1}
                                  {brandedFoods[food.id].serving_size_unit || ''}
                                </p>
                              </div>

                              <div className="meal-log-food-section">
                                <div className="meal-options-button-container">
                                  <button
                                    className="foods-menu-add-button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleAddFood(food.id);
                                    }}
                                  >
                                    <img className="button-link-image" src={addIcon} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                </div>
              )
              }

{/* ---------------------------------------------------------------------- */}
{/* ---- Breakfast Section Header ---- */}
              <div className="meals-container">
                <section className="meal-section">
                  <div className="meal-type-container">
                    <h3 className="meal-type">
                      Breakfast
                    </h3>

                    <button
                      className="meal-options-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMealOptionsMenuOpenType((prev) => (prev === 'breakfast' ? '' : 'breakfast'));
                      }}
                    >
                      <img className="button-link-image" src={dotsIcon} />
                    </button>

{/* ---------------------------------------------------------------------- */}
{/* ---- Breakfast Section Header Options Menu ---- */}

                    <div
                      ref={el => { mealOptionsMenuRefs.current['breakfast'] = el }}
                      className={`meal-options-menu ${mealOptionsMenuOpenType === 'breakfast' && 'meal-options-menu-open'}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="meal-options-menu-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          // handleCopyMeal('breakfast', ...);
                        }}
                      >
                        <img className="button-link-image" src={copyIcon} />
                        Copy to...
                      </button>

                      <button
                        className="meal-options-menu-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          // handleMoveMeal('breakfast', ...);
                        }}
                      >
                        <img className="button-link-image" src={moveIcon} />
                        Move to...
                      </button>

                      <button
                        className="meal-options-menu-button meal-options-delete-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteMeal('breakfast');
                        }}
                      >
                        <img className="button-link-image" src={deleteIcon} />
                        Delete Meal
                      </button>
                    </div>
                  </div>

{/* ---------------------------------------------------------------------- */}
{/* ---- Breakfast Section Foods ---- */}

                  {
                    currentMealLogDate &&
                    mealLogs[currentMealLogDate] &&
                    mealLogFoods[mealLogs[currentMealLogDate].id]
                      ?.filter(mealLogFoodItem => mealLogFoodItem.meal_type === "breakfast")
                      .map((mealLogFood: MealLogFood) => {
                        return (
                          <div
                            key={mealLogFood.id}
                            className="meal-log-food"
                          >
                            <div className="meal-log-food-section">
                              <p className="meal-log-food-text">{foods[mealLogFood.food_id]?.description ?? ''}</p>
                              <p className="meal-log-food-serving-text">
                                {(mealLogFood.num_servings * mealLogFood.serving_size).toFixed(1).replace(/\.0$/, '')}{' '}
                                {mealLogFood.serving_unit}
                              </p>
                            </div>

                            <div className="meal-log-food-section">
                              <p className="meal-log-food-text">{mealLogFood.calories ? `${mealLogFood.calories} calories` : ''}</p>
                              <div className="meal-options-button-container">
                                <button
                                  className="meal-log-food-options-button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setMealFoodOptionsMenuOpenId((prev) => (prev === mealLogFood.id ? null : mealLogFood.id));
                                  }}
                                >
                                  <img className="button-link-image" src={dotsIcon} />
                                </button>
                              </div>

{/* ---------------------------------------------------------------------- */}
{/* ---- Breakfast Section Foods Options Menu ---- */}

                              <div
                                ref={el => { mealFoodOptionsMenuRefs.current[mealLogFood.id] = el }}
                                className={`meal-options-menu meal-log-food-options-menu ${mealFoodOptionsMenuOpenId === mealLogFood.id && 'meal-options-menu-open'}`}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  className="meal-options-menu-button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // handleCopyMealFood('breakfast', ...);
                                  }}
                                >
                                  <img className="button-link-image" src={copyIcon} />
                                  Copy to...
                                </button>

                                <button
                                  className="meal-options-menu-button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // handleMoveMealFood('breakfast', ...);
                                  }}
                                >
                                  <img className="button-link-image" src={moveIcon} />
                                  Move to...
                                </button>

                                <button
                                  className="meal-options-menu-button meal-options-delete-button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteMealLogFood(mealLogFood.id);
                                  }}
                                >
                                  <img className="button-link-image" src={deleteIcon} />
                                  Delete Entry
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                      })
                  }
                
{/* ---------------------------------------------------------------------- */}

                  <button
                    className="add-food-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFoodSearch('');
                      setFoodMenuInputFocused(false);
                      setFoodsMenuOpenMealType((prev) => (prev === 'breakfast' ? '' : 'breakfast'));
                    }}
                  >
                    Add Food
                  </button>
                </section>

{/* ---------------------------------------------------------------------- */}
{/* ---- Lunch Section Header ---- */}

                <section className="meal-section">
                  <div className="meal-type-container">
                    <h3 className="meal-type">
                      Lunch
                    </h3>

                    <button
                      className="meal-options-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMealOptionsMenuOpenType((prev) => (prev === 'lunch' ? '' : 'lunch'));
                      }}
                    >
                      <img className="button-link-image" src={dotsIcon} />
                    </button>

{/* ---------------------------------------------------------------------- */}
{/* ---- Lunch Section Header Options Menu ---- */}

                    <div
                      ref={el => { mealOptionsMenuRefs.current['lunch'] = el }}
                      className={`meal-options-menu ${mealOptionsMenuOpenType === 'lunch' && 'meal-options-menu-open'}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="meal-options-menu-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          // handleCopyMeal('lunch', ...);
                        }}
                      >
                        <img className="button-link-image" src={copyIcon} />
                        Copy to...
                      </button>

                      <button
                        className="meal-options-menu-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          // handleMoveMeal('lunch', ...);
                        }}
                      >
                        <img className="button-link-image" src={moveIcon} />
                        Move to...
                      </button>

                      <button
                        className="meal-options-menu-button meal-options-delete-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteMeal('lunch');
                        }}
                      >
                        <img className="button-link-image" src={deleteIcon} />
                        Delete Meal
                      </button>
                    </div>
                  </div>

{/* ---------------------------------------------------------------------- */}
{/* ---- Lunch Section Foods ---- */}

                  {
                    currentMealLogDate &&
                    mealLogs[currentMealLogDate] &&
                    mealLogFoods[mealLogs[currentMealLogDate].id]
                      ?.filter(mealLogFoodItem => mealLogFoodItem.meal_type === "lunch")
                      .map((mealLogFood: MealLogFood) => {
                        return (
                          <div key={mealLogFood.id} className="meal-log-food">
                            <div className="meal-log-food-section">
                              <p className="meal-log-food-text">{foods[mealLogFood.food_id]?.description ?? ''}</p>
                              <p className="meal-log-food-serving-text">{mealLogFood.num_servings * mealLogFood.serving_size} {mealLogFood.serving_unit}</p>
                            </div>

                            <div className="meal-log-food-section">
                              <p className="meal-log-food-text">{mealLogFood.calories ? `${mealLogFood.calories} calories` : ''}</p>
                              <div className="meal-options-button-container">
                                <button
                                  className="meal-log-food-options-button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setMealFoodOptionsMenuOpenId((prev) => (prev === mealLogFood.id ? null : mealLogFood.id));
                                  }}
                                >
                                  <img className="button-link-image" src={dotsIcon} />
                                </button>
                              </div>

{/* ---------------------------------------------------------------------- */}
{/* ---- Lunch Section Foods Options Menu ---- */}

                              <div
                                ref={el => { mealFoodOptionsMenuRefs.current[mealLogFood.id] = el }}
                                className={`meal-options-menu meal-log-food-options-menu ${mealFoodOptionsMenuOpenId === mealLogFood.id && 'meal-options-menu-open'}`}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  className="meal-options-menu-button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // handleCopyMealFood('lunch', ...);
                                  }}
                                >
                                  <img className="button-link-image" src={copyIcon} />
                                  Copy to...
                                </button>

                                <button
                                  className="meal-options-menu-button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // handleMoveMealFood('lunch', ...);
                                  }}
                                >
                                  <img className="button-link-image" src={moveIcon} />
                                  Move to...
                                </button>

                                <button
                                  className="meal-options-menu-button meal-options-delete-button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteMealLogFood(mealLogFood.id);
                                  }}
                                >
                                  <img className="button-link-image" src={deleteIcon} />
                                  Delete Entry
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                      })
                  }

{/* ---------------------------------------------------------------------- */}

                  <button
                    className="add-food-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFoodSearch('');
                      setFoodMenuInputFocused(false);
                      setFoodsMenuOpenMealType((prev) => (prev === 'lunch' ? '' : 'lunch'));
                    }}
                    >
                    Add Food
                  </button>
                </section>

{/* ---------------------------------------------------------------------- */}
{/* ---- Dinner Section Header ---- */}

                <section className="meal-section">
                  <div className="meal-type-container">
                    <h3 className="meal-type">
                      Dinner
                    </h3>

                    <button
                      className="meal-options-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMealOptionsMenuOpenType((prev) => (prev === 'dinner' ? '' : 'dinner'));
                      }}
                    >
                      <img className="button-link-image" src={dotsIcon} />
                    </button>

{/* ---------------------------------------------------------------------- */}
{/* ---- Dinner Section Header Options Menu ---- */}

                    <div
                      ref={el => { mealOptionsMenuRefs.current['dinner'] = el }}
                      className={`meal-options-menu ${mealOptionsMenuOpenType === 'dinner' && 'meal-options-menu-open'}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="meal-options-menu-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          // handleCopyMeal('dinner', ...);
                        }}
                      >
                        <img className="button-link-image" src={copyIcon} />
                        Copy to...
                      </button>

                      <button
                        className="meal-options-menu-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          // handleMoveMeal('dinner', ...);
                        }}
                      >
                        <img className="button-link-image" src={moveIcon} />
                        Move to...
                      </button>

                      <button
                        className="meal-options-menu-button meal-options-delete-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteMeal('dinner');
                        }}
                      >
                        <img className="button-link-image" src={deleteIcon} />
                        Delete Meal
                      </button>
                    </div>
                  </div>

{/* ---------------------------------------------------------------------- */}
{/* ---- Dinner Section Foods ---- */}

                  {
                    currentMealLogDate &&
                    mealLogs[currentMealLogDate] &&
                    mealLogFoods[mealLogs[currentMealLogDate].id]
                      ?.filter(mealLogFoodItem => mealLogFoodItem.meal_type === "dinner")
                      .map((mealLogFood: MealLogFood) => {
                        return (
                          <div key={mealLogFood.id} className="meal-log-food">
                            <div className="meal-log-food-section">
                              <p className="meal-log-food-text">{foods[mealLogFood.food_id]?.description ?? ''}</p>
                              <p className="meal-log-food-serving-text">{mealLogFood.num_servings * mealLogFood.serving_size} {mealLogFood.serving_unit}</p>
                            </div>

                            <div className="meal-log-food-section">
                              <p className="meal-log-food-text">{mealLogFood.calories ? `${mealLogFood.calories} calories` : ''}</p>
                              <div className="meal-options-button-container">
                                <button
                                  className="meal-log-food-options-button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setMealFoodOptionsMenuOpenId((prev) => (prev === mealLogFood.id ? null : mealLogFood.id));
                                  }}
                                >
                                  <img className="button-link-image" src={dotsIcon} />
                                </button>
                              </div>

{/* ---------------------------------------------------------------------- */}
{/* ---- Dinner Section Foods Options Menu ---- */}

                              <div
                                ref={el => { mealFoodOptionsMenuRefs.current[mealLogFood.id] = el }}
                                className={`meal-options-menu meal-log-food-options-menu ${mealFoodOptionsMenuOpenId === mealLogFood.id && 'meal-options-menu-open'}`}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  className="meal-options-menu-button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // handleCopyMealFood('dinner', ...);
                                  }}
                                >
                                  <img className="button-link-image" src={copyIcon} />
                                  Copy to...
                                </button>

                                <button
                                  className="meal-options-menu-button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // handleMoveMealFood('dinner', ...);
                                  }}
                                >
                                  <img className="button-link-image" src={moveIcon} />
                                  Move to...
                                </button>

                                <button
                                  className="meal-options-menu-button meal-options-delete-button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteMealLogFood(mealLogFood.id);
                                  }}
                                >
                                  <img className="button-link-image" src={deleteIcon} />
                                  Delete Entry
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                      })
                  }

{/* ---------------------------------------------------------------------- */}

                  <button
                    className="add-food-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFoodSearch('');
                      setFoodMenuInputFocused(false);
                      setFoodsMenuOpenMealType((prev) => (prev === 'dinner' ? '' : 'dinner'));
                    }}
                  >
                    Add Food
                  </button>
                </section>

{/* ---------------------------------------------------------------------- */}
{/* ---- Snacks Section Header ---- */}

                <section className="meal-section">
                  <div className="meal-type-container">
                    <h3 className="meal-type">
                      Snacks
                    </h3>

                    <button
                      className="meal-options-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMealOptionsMenuOpenType((prev) => (prev === 'snacks' ? '' : 'snacks'));
                      }}
                    >
                      <img className="button-link-image" src={dotsIcon} />
                    </button>

{/* ---------------------------------------------------------------------- */}
{/* ---- Snacks Section Header Options Menu ---- */}

                    <div
                      ref={el => { mealOptionsMenuRefs.current['snacks'] = el }}
                      className={`meal-options-menu ${mealOptionsMenuOpenType === 'snacks' && 'meal-options-menu-open'}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="meal-options-menu-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          // handleCopyMeal('snacks', ...);
                        }}
                      >
                        <img className="button-link-image" src={copyIcon} />
                        Copy to...
                      </button>

                      <button
                        className="meal-options-menu-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          // handleMoveMeal('snacks', ...);
                        }}
                      >
                        <img className="button-link-image" src={moveIcon} />
                        Move to...
                      </button>

                      <button
                        className="meal-options-menu-button meal-options-delete-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteMeal('snacks');
                        }}
                      >
                        <img className="button-link-image" src={deleteIcon} />
                        Delete Meal
                      </button>
                    </div>
                  </div>

{/* ---------------------------------------------------------------------- */}
{/* ---- Snacks Section Foods ---- */}

                  {
                    currentMealLogDate &&
                    mealLogs[currentMealLogDate] &&
                    mealLogFoods[mealLogs[currentMealLogDate].id]
                      ?.filter(mealLogFoodItem => mealLogFoodItem.meal_type === "snacks")
                      .map((mealLogFood: MealLogFood) => {
                        return (
                          <div key={mealLogFood.id} className="meal-log-food">
                            <div className="meal-log-food-section">
                              <p className="meal-log-food-text">{foods[mealLogFood.food_id]?.description ?? ''}</p>
                              <p className="meal-log-food-serving-text">{mealLogFood.num_servings * mealLogFood.serving_size} {mealLogFood.serving_unit}</p>
                            </div>

                            <div className="meal-log-food-section">
                              <p className="meal-log-food-text">{mealLogFood.calories ? `${mealLogFood.calories} calories` : ''}</p>
                              <div className="meal-options-button-container">
                                <button
                                  className="meal-log-food-options-button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setMealFoodOptionsMenuOpenId((prev) => (prev === mealLogFood.id ? null : mealLogFood.id));
                                  }}
                                >
                                  <img className="button-link-image" src={dotsIcon} />
                                </button>
                              </div>

{/* ---------------------------------------------------------------------- */}
{/* ---- Snacks Section Foods Options Menu ---- */}

                              <div
                                ref={el => { mealFoodOptionsMenuRefs.current[mealLogFood.id] = el }}
                                className={`meal-options-menu meal-log-food-options-menu ${mealFoodOptionsMenuOpenId === mealLogFood.id && 'meal-options-menu-open'}`}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  className="meal-options-menu-button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // handleCopyMealFood('snacks', ...);
                                  }}
                                >
                                  <img className="button-link-image" src={copyIcon} />
                                  Copy to...
                                </button>

                                <button
                                  className="meal-options-menu-button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // handleMoveMealFood('snacks', ...);
                                  }}
                                >
                                  <img className="button-link-image" src={moveIcon} />
                                  Move to...
                                </button>

                                <button
                                  className="meal-options-menu-button meal-options-delete-button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteMealLogFood(mealLogFood.id);
                                  }}
                                >
                                  <img className="button-link-image" src={deleteIcon} />
                                  Delete Entry
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                      })
                  }

{/* ---------------------------------------------------------------------- */}

                  <button
                    className="add-food-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFoodSearch('');
                      setFoodMenuInputFocused(false);
                      setFoodsMenuOpenMealType((prev) => (prev === 'snacks' ? '' : 'snacks'));
                    }}
                  >
                    Add Food
                  </button>
                </section>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
