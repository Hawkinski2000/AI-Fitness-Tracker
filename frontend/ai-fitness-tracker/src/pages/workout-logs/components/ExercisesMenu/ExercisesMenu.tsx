import { PropagateLoader } from 'react-spinners';
import { type Exercise } from "../../types/workout-logs";
import closeIcon from '../../../../assets/close-icon.svg';
import arrowLeftIcon from '../../../../assets/arrow-left-icon.svg';
import arrowRightIcon from '../../../../assets/arrow-right-icon.svg';
import './ExercisesMenu.css';


type ExercisesMenuProps = {
  exercisesMenuOpen: boolean;
  setExercisesMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  exerciseSearch: string;
  foodMenuInputFocused: boolean;
  setFoodMenuInputFocused: React.Dispatch<React.SetStateAction<boolean>>;
  isSearching: boolean;
  exerciseSearchResults: Exercise[];
  setViewExerciseMenuOpenId: React.Dispatch<React.SetStateAction<number | null>>;
  totalPages: number | null;
  currentPageNumber: number | null;
  setCurrentPageNumber: React.Dispatch<React.SetStateAction<number | null>>;
  foodsMenuRef: React.RefObject<HTMLDivElement | null>;
  searchTimeoutRef: React.RefObject<number | null>;
  updateExerciseSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleExerciseSearch: (search: string, pageNumber: number) => Promise<void>;
};


export default function ExercisesMenu({
  exercisesMenuOpen,
  setExercisesMenuOpen,
  exerciseSearch,
  foodMenuInputFocused,
  setFoodMenuInputFocused,
  isSearching,
  exerciseSearchResults,
  setViewExerciseMenuOpenId,
  totalPages,
  currentPageNumber,
  setCurrentPageNumber,
  foodsMenuRef,
  searchTimeoutRef,
  updateExerciseSearch,
  handleExerciseSearch,
}: ExercisesMenuProps) {
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
      className={`exercises-menu ${exercisesMenuOpen && 'exercises-menu-open'}`}
      ref={foodsMenuRef}
    >

      <button
        className="exercises-menu-close-button"
        onClick={(e) => {
          e.stopPropagation();
          setExercisesMenuOpen(false);
        }}
      >
        <img className="button-link-image" src={closeIcon} />
      </button>

      <div className="foods-menu-input-container">
        <div className="foods-menu-input-placeholder-container">
          <input
            className='foods-menu-input'
            type='text'
            value={exerciseSearch}
            onChange={updateExerciseSearch}
            onFocus={() => setFoodMenuInputFocused(true)}
            onBlur={() => setFoodMenuInputFocused(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (searchTimeoutRef.current) {
                  clearTimeout(searchTimeoutRef.current);
                }
                handleExerciseSearch(exerciseSearch, 1);
                e.preventDefault();
              }
            }}
          />
          <span
            className={
              `placeholder foods-menu-placeholder
              ${exerciseSearch ? 'float' : ''}
              ${foodMenuInputFocused ? 'float focus' : ''}`
            }
          >
            Search exercises
          </span>
        </div>
      </div>
      
      <h3 className="foods-menu-results-header">Search Results</h3>

        {isSearching ? (
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
          <div className="food-menu-results">
            {exerciseSearchResults.map((exercise: Exercise) => {
              return (
                <div
                  key={exercise.id}
                  className="foods-menu-results-food"
                  onClick={(e) => {
                    e.stopPropagation();
                    setViewExerciseMenuOpenId(exercise.id);
                  }}
                >
                  <div className="meal-log-food-section">
                    <p className="meal-log-food-text">{exercise.name}</p>
                  </div>
                </div>
              )
            })}

            {exerciseSearchResults.length > 0 && totalPages && pageNumbers && (
              <nav className="search-results-page-nav">
                {currentPageNumber !== 1 && (
                  <button
                    className="search-results-page-nav-button"
                    onClick={() => {
                      if (currentPageNumber) {
                        setCurrentPageNumber(currentPageNumber - 1);
                        handleExerciseSearch(exerciseSearch, currentPageNumber - 1);
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
                          handleExerciseSearch(exerciseSearch, 1);
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
                        handleExerciseSearch(exerciseSearch, pageNumber);
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
                          handleExerciseSearch(exerciseSearch, totalPages);
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
                        handleExerciseSearch(exerciseSearch, currentPageNumber + 1);
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
