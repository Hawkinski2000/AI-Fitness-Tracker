import { PropagateLoader } from 'react-spinners';
import { type Food, type BrandedFood } from "../../types/meal-logs";
import closeIcon from '../../../../assets/close-icon.svg';
import addIcon from '../../../../assets/add-icon.svg';
import arrowLeftIcon from '../../../../assets/arrow-left-icon.svg';
import arrowRightIcon from '../../../../assets/arrow-right-icon.svg';
import './FoodsMenu.css';


type FoodsMenuProps = {
  foodsMenuOpenMealType: string;
  setFoodsMenuOpenMealType: React.Dispatch<React.SetStateAction<string>>;
  foodSearch: string;
  foodMenuInputFocused: boolean;
  setFoodMenuInputFocused: React.Dispatch<React.SetStateAction<boolean>>;
  isSearching: boolean;
  foodSearchResults: Food[];
  setNumServings: React.Dispatch<React.SetStateAction<number | null>>;
  setServingSize: React.Dispatch<React.SetStateAction<number | null>>;
  setServingSizeUnit: React.Dispatch<React.SetStateAction<string>>;
  brandedFoods: Record<number, BrandedFood>;
  setViewFoodMenuOpenId: React.Dispatch<React.SetStateAction<number | null>>;
  totalPages: number | null;
  currentPageNumber: number | null;
  setCurrentPageNumber: React.Dispatch<React.SetStateAction<number | null>>;
  foodsMenuRef: React.RefObject<HTMLDivElement | null>;
  searchTimeoutRef: React.RefObject<number | null>;
  updateFoodSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleFoodSearch: (search: string, pageNumber: number) => Promise<void>;
  handleLoadFoodNutrients: (foodId: number) => Promise<void>;
  handleAddFood: (foodId: number, numServings?: number | null, servingSize?: number | null) => Promise<void>;
};


export default function FoodsMenu({
  foodsMenuOpenMealType,
  setFoodsMenuOpenMealType,
  foodSearch,
  foodMenuInputFocused,
  setFoodMenuInputFocused,
  isSearching,
  foodSearchResults,
  setNumServings,
  setServingSize,
  setServingSizeUnit,
  brandedFoods,
  setViewFoodMenuOpenId,
  totalPages,
  currentPageNumber,
  setCurrentPageNumber,
  foodsMenuRef,
  searchTimeoutRef,
  updateFoodSearch,
  handleFoodSearch,
  handleLoadFoodNutrients,
  handleAddFood
}: FoodsMenuProps) {
  const MAX_PAGE_BUTTONS = 10;
  let startPage = 1;
  let endPage = totalPages || 1;
  if (totalPages && currentPageNumber) {
    if (totalPages <= MAX_PAGE_BUTTONS) {
      startPage = 1;
      endPage = totalPages;

    } else {
      const blockIndex = Math.floor((currentPageNumber - 1) / MAX_PAGE_BUTTONS);
      startPage = blockIndex * MAX_PAGE_BUTTONS + 1;
      endPage = Math.min(totalPages, startPage + MAX_PAGE_BUTTONS - 1);

      if (totalPages >= MAX_PAGE_BUTTONS && (endPage - startPage + 1) < MAX_PAGE_BUTTONS) {
        endPage = totalPages;
        startPage = Math.max(1, totalPages - MAX_PAGE_BUTTONS + 1);
      }
    }
  }
  const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  return (
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
                handleFoodSearch(foodSearch, 1);
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

            {foodSearchResults.length > 0 && totalPages && pageNumbers && (
              <nav className="search-results-page-nav">
                {currentPageNumber !== 1 && (
                  <button
                    className="search-results-page-nav-button"
                    onClick={() => {
                      if (currentPageNumber) {
                        setCurrentPageNumber(currentPageNumber - 1);
                        handleFoodSearch(foodSearch, currentPageNumber - 1);
                      }
                    }}
                  >
                    <img className="button-link-image" src={arrowLeftIcon} />
                    Previous
                  </button>
                )}

                {currentPageNumber && (currentPageNumber > MAX_PAGE_BUTTONS) && (
                  <>
                    <button
                      className="search-results-page-nav-button"
                      onClick={() => {
                        if (currentPageNumber) {
                          setCurrentPageNumber(1);
                          handleFoodSearch(foodSearch, 1);
                        }
                      }}
                    >
                      1
                    </button>

                    <p className="search-results-page-nav-text">&hellip;</p>
                  </>
                )}

                {pageNumbers.map((pageNumber: number) => (
                  <button
                    key={pageNumber}
                    className="search-results-page-nav-button"
                    style={
                      pageNumber === currentPageNumber
                        ? {backgroundColor: "#8085a6", color: "#00ffcc"}
                        : undefined
                    }
                    onClick={() => {
                      if (currentPageNumber) {
                        setCurrentPageNumber(pageNumber);
                        handleFoodSearch(foodSearch, pageNumber);
                      }
                    }}
                  >
                    {pageNumber}
                  </button>
                ))}

                {currentPageNumber && (totalPages - currentPageNumber >= MAX_PAGE_BUTTONS) && (
                  <>
                    <p className="search-results-page-nav-text">&hellip;</p>

                    <button
                      className="search-results-page-nav-button"
                      onClick={() => {
                        if (currentPageNumber) {
                          setCurrentPageNumber(totalPages);
                          handleFoodSearch(foodSearch, totalPages);
                        }
                      }}
                    >
                      {totalPages}
                    </button>
                  </>
                )}

                {currentPageNumber !== totalPages && (
                  <button
                    className="search-results-page-nav-button"
                    onClick={() => {
                      if (currentPageNumber) {
                        setCurrentPageNumber(currentPageNumber + 1);
                        handleFoodSearch(foodSearch, currentPageNumber + 1);
                      }
                    }}
                  >
                    Next
                    <img className="button-link-image" src={arrowRightIcon} />
                  </button>
                )}
              </nav>
            )}
          </div>
        )}
    </div>
  );
}
