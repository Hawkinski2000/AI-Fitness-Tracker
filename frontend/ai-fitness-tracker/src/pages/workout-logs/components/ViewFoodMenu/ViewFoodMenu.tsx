import { PropagateLoader } from 'react-spinners';
import {
  type MealLog,
  type MealLogFood,
  type Food,
  type BrandedFood,
  type FoodNutrient,
  type Nutrient
} from "../../types/workout-logs";
import type { Value } from 'react-calendar/dist/shared/types.js';
import MacroDoughnutChart from "../MacroDoughnutChart/MacroDoughnutChart";
import { getDateKey } from '../../../../utils/dates';
import backIcon from './assets/back-icon.svg';
import checkIcon from './assets/check-icon.svg';
import './ViewFoodMenu.css';


type ViewFoodMenuProps = {
  currentMealLogDate: Value;
  mealLogs: Record<string, MealLog>;
  mealLogFoods: Record<number, MealLogFood[]>;
  foods: Record<number, Food>;
  brandedFoods: Record<number, BrandedFood>;
  foodNutrients: Record<number, FoodNutrient[]>;
  nutrients: Record<number, Nutrient>;
  numServings: number | null;
  setNumServings: React.Dispatch<React.SetStateAction<number | null>>;
  servingSize: number | null;
  setServingSize: React.Dispatch<React.SetStateAction<number | null>>;
  servingSizeUnit: string;
  foodCaloriesFromMacros: Record<number, number>;
  macroAmountsGrams: Record<number, Record<number, number>>;
  foodsMenuOpenMealType: string;
  setFoodsMenuOpenMealType: React.Dispatch<React.SetStateAction<string>>;
  editingMealLogFoodId: number | null;
  setEditingMealLogFoodId: React.Dispatch<React.SetStateAction<number | null>>;
  viewFoodMenuOpenId: number | null;
  setViewFoodMenuOpenId: React.Dispatch<React.SetStateAction<number | null>>;
  foodSearchResults: Food[];
  selectMealMenuOpenType: string;
  setSelectMealMenuOpenType: React.Dispatch<React.SetStateAction<string>>;
  selectServingSizeMenuOpen: boolean;
  setSelectServingSizeMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  foodsMenuRef: React.RefObject<HTMLDivElement | null>;
  selectMealMenuRef: React.RefObject<HTMLDivElement | null>;
  selectServingSizeMenuRef: React.RefObject<HTMLDivElement | null>;
  handleUpdateFood: (
    mealLogFoodId: number,
    mealLogId: number | null,
    numServings?: number | null,
    servingSize?: number | null
  ) => Promise<void>;
  handleAddFood: (
    foodId: number,
    numServings?: number | null,
    servingSize?: number | null
  ) => Promise<void>;
};


export default function ViewFoodMenu({
  currentMealLogDate,
  mealLogs,
  mealLogFoods,
  foods,
  brandedFoods,
  foodNutrients,
  nutrients,
  numServings,
  setNumServings,
  servingSize,
  setServingSize,
  servingSizeUnit,
  foodCaloriesFromMacros,
  macroAmountsGrams,
  foodsMenuOpenMealType,
  setFoodsMenuOpenMealType,
  editingMealLogFoodId,
  setEditingMealLogFoodId,
  viewFoodMenuOpenId,
  setViewFoodMenuOpenId,
  foodSearchResults,
  selectMealMenuOpenType,
  setSelectMealMenuOpenType,
  selectServingSizeMenuOpen,
  setSelectServingSizeMenuOpen,
  foodsMenuRef,
  selectMealMenuRef,
  selectServingSizeMenuRef,
  handleUpdateFood,
  handleAddFood
}: ViewFoodMenuProps) {
  const dateKey = getDateKey(currentMealLogDate);

  return (
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
              setEditingMealLogFoodId(null);
              setViewFoodMenuOpenId(null);
            }}
          >
            <img className="button-link-image" src={backIcon} />
          </button>
          <p>
            {editingMealLogFoodId ? 'Edit Entry' : 'Add Food'}
          </p>
          <button
            className="view-food-menu-text-button"
            onClick={(e) => {
              e.stopPropagation();
              if (editingMealLogFoodId && currentMealLogDate && dateKey) {
                handleUpdateFood(editingMealLogFoodId,
                                 mealLogs[dateKey].id,
                                 numServings,
                                 servingSize);
                setEditingMealLogFoodId(null);
                setViewFoodMenuOpenId(null);
                setFoodsMenuOpenMealType('');
              }
              else {
                if (viewFoodMenuOpenId) {
                  handleAddFood(viewFoodMenuOpenId, numServings, servingSize);
                }
              }
              setViewFoodMenuOpenId(null);
            }}
          >
            <img className="button-link-image" src={checkIcon} />
          </button>
        </div>
      </header>

      {(viewFoodMenuOpenId && !foodCaloriesFromMacros[viewFoodMenuOpenId]) ? (
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
      ) : (
        <div className="view-food-menu-content">
          <section className="view-food-menu-section">
            <div className="view-food-menu-section-content">
              <h3 className="view-food-menu-content-heading">
                {
                  editingMealLogFoodId && currentMealLogDate && dateKey
                    ? (
                        foods[
                          mealLogFoods[mealLogs[dateKey].id]
                            ?.find((mealLogFood: MealLogFood) =>
                              mealLogFood.id === editingMealLogFoodId)
                            ?.food_id ?? -1
                        ]?.description ?? ''
                      )
                    : (
                        foodSearchResults.find((food: Food) =>
                          food.id === viewFoodMenuOpenId)?.description || ''
                      )
                }
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
                    setSelectMealMenuOpenType((prev) =>
                      prev === foodsMenuOpenMealType ? '' : foodsMenuOpenMealType);
                  }}
                >
                  {foodsMenuOpenMealType}
                </button>

                <div
                  ref={el => { selectMealMenuRef.current = el }}
                  className={
                    `meal-options-menu
                    select-meal-menu 
                    ${selectMealMenuOpenType && 'meal-options-menu-open'}`
                  }
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
                  className={
                    `meal-options-menu
                    select-serving-size-menu
                    ${selectServingSizeMenuOpen && 'meal-options-menu-open'}`
                  }
                  onClick={(e) => e.stopPropagation()}
                >
                  {(selectServingSizeMenuOpen && servingSize === 1) && (
                    <button
                      className="meal-options-menu-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (viewFoodMenuOpenId) {
                          setServingSize(brandedFoods[viewFoodMenuOpenId].serving_size || null);
                        }
                        setSelectServingSizeMenuOpen(false);
                      }}
                    >
                      {
                        viewFoodMenuOpenId &&
                        (brandedFoods[viewFoodMenuOpenId].serving_size)
                        ?.toFixed(1)
                        .replace(/\.0$/, '') || ''
                       }{' '}
                      {
                        viewFoodMenuOpenId &&
                        brandedFoods[viewFoodMenuOpenId].serving_size_unit || ''
                      }
                    </button>
                  )}

                  {(selectServingSizeMenuOpen && servingSize !== 1) && (
                    <button
                      className="meal-options-menu-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setServingSize(1);
                        setSelectServingSizeMenuOpen(false);
                      }}
                    >
                      1{' '}
                      {
                        viewFoodMenuOpenId &&
                        brandedFoods[viewFoodMenuOpenId].serving_size_unit || ''
                      }
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>

          {viewFoodMenuOpenId && macroAmountsGrams[viewFoodMenuOpenId] && (
            <section className="view-food-menu-section">
              <div className="view-food-menu-section-content">
                <div className="view-food-menu-section-column">
                  <MacroDoughnutChart
                    calories={
                      Number(
                        (
                          (
                            editingMealLogFoodId &&
                            currentMealLogDate &&
                            dateKey &&
                            mealLogFoods[mealLogs[dateKey].id]
                              ? (
                                  foods[mealLogFoods[mealLogs[dateKey].id]
                                    .find((mealLogFood: MealLogFood) =>
                                      mealLogFood.id === editingMealLogFoodId
                                    )?.food_id ?? -1]
                                    ?.calories ?? foodCaloriesFromMacros[viewFoodMenuOpenId]
                                )
                              : (
                                  foodSearchResults.find((food: Food) => {
                                    console.log(`food.id: ${food.id}\nfood.calories: ${food.calories}`)
                                    return food.id === viewFoodMenuOpenId
                                  }
                                  )?.calories ?? foodCaloriesFromMacros[viewFoodMenuOpenId]
                                )
                          )
                          * (numServings || 1)
                          * (
                              (servingSize || (brandedFoods[viewFoodMenuOpenId].serving_size || 1))
                              / (brandedFoods[viewFoodMenuOpenId].serving_size || 1)
                            )
                        ).toFixed(1)
                      )
                    }
                    carbsCalories={
                      (macroAmountsGrams[viewFoodMenuOpenId][1005] || 0) * 4
                      * (numServings || 1)
                      * ((servingSize || (brandedFoods[viewFoodMenuOpenId].serving_size || 1))
                      / (brandedFoods[viewFoodMenuOpenId].serving_size || 1))
                    }
                    fatCalories={
                      (macroAmountsGrams[viewFoodMenuOpenId][1004] || 0) * 9
                      * (numServings || 1)
                      * ((servingSize || (brandedFoods[viewFoodMenuOpenId].serving_size || 1))
                      / (brandedFoods[viewFoodMenuOpenId].serving_size || 1))
                    }
                    proteinCalories={
                      (macroAmountsGrams[viewFoodMenuOpenId][1003] || 0) * 4
                      * (numServings || 1)
                      * ((servingSize || (brandedFoods[viewFoodMenuOpenId].serving_size || 1))
                      / (brandedFoods[viewFoodMenuOpenId].serving_size || 1))
                    }
                  />
                </div>

                <div className="view-food-menu-section-column">
                  <p className="view-food-menu-section-column-label" style={{color: '#00ffcc'}}>
                    {
                      `${
                        (
                          ((macroAmountsGrams[viewFoodMenuOpenId][1005] || 0) * 4
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
                    {
                      `${
                        (macroAmountsGrams[viewFoodMenuOpenId][1005] || 0
                        * (numServings || 1)
                        * ((servingSize || (brandedFoods[viewFoodMenuOpenId].serving_size || 1))
                        / (brandedFoods[viewFoodMenuOpenId].serving_size || 1))
                        ).toFixed(1).replace(/\.0$/, '')
                      } g`
                    }
                  </p>
                  <p className="view-food-menu-section-column-label">Carbs</p>
                </div>

                <div className="view-food-menu-section-column">
                  <p className="view-food-menu-section-column-label" style={{color: '#ff00c8'}}>
                    {
                      `${
                        (
                          ((macroAmountsGrams[viewFoodMenuOpenId][1004] || 0) * 9
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
                    {
                      `${
                        (macroAmountsGrams[viewFoodMenuOpenId][1004] || 0
                        * (numServings || 1)
                        * ((servingSize || (brandedFoods[viewFoodMenuOpenId].serving_size || 1))
                        / (brandedFoods[viewFoodMenuOpenId].serving_size || 1))
                        ).toFixed(1).replace(/\.0$/, '')
                      } g`
                    }
                  </p>
                  <p className="view-food-menu-section-column-label">Fat</p>
                </div>

                <div className="view-food-menu-section-column">
                  <p className="view-food-menu-section-column-label" style={{color: '#ffe600'}}>
                    {
                      `${
                        (
                          ((macroAmountsGrams[viewFoodMenuOpenId][1003] || 0) * 4
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
                    {
                      `${
                        (macroAmountsGrams[viewFoodMenuOpenId][1003] || 0
                        * (numServings || 1)
                        * ((servingSize || (brandedFoods[viewFoodMenuOpenId].serving_size || 1))
                        / (brandedFoods[viewFoodMenuOpenId].serving_size || 1))
                        ).toFixed(1).replace(/\.0$/, '')
                      } g`
                    }
                  </p>
                  <p className="view-food-menu-section-column-label">Protein</p>
                </div>
              </div>
            </section>
          )}

          {viewFoodMenuOpenId && foodNutrients[viewFoodMenuOpenId] &&
          foodNutrients[viewFoodMenuOpenId].map((foodNutrient: FoodNutrient) => {
            return (
              <section key={foodNutrient.id} className="view-food-menu-section">
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
                Ingredients: {viewFoodMenuOpenId && brandedFoods[viewFoodMenuOpenId].ingredients}
              </p>
            </div>
          </section>
        </div>
        )}
    </div>
  );
}
