import { useCallback } from "react";
import { type Food, type BrandedFood } from "../types/meal-logs";
import { useAuth } from "../../../context/auth/useAuth";
import { refreshAccessToken, isTokenExpired } from "../../../utils/auth";
import { getFoods, loadBrandedFood } from "../../../utils/meal-logs";


const useFoodSearch = (
  setFoodSearchResults: React.Dispatch<React.SetStateAction<Food[]>>,
  setIsSearching: React.Dispatch<React.SetStateAction<boolean>>,
  setTotalPages: React.Dispatch<React.SetStateAction<number | null>>,
  setCurrentPageNumber: React.Dispatch<React.SetStateAction<number | null>>,
  setBrandedFoods: React.Dispatch<React.SetStateAction<Record<number, BrandedFood>>>,
  setFoodSearch: React.Dispatch<React.SetStateAction<string>>,
  searchTimeoutRef: React.RefObject<number | null>
) => {
  const { accessToken, setAccessToken } = useAuth();

  const MAX_RESULTS_PER_PAGE = 30;


  const handleFoodSearch = useCallback(async (search: string, pageNumber: number) => {
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

        const foodSearchObject = await getFoods(
          MAX_RESULTS_PER_PAGE, skip, search, setFoodSearchResults, token
        );
        
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
  }, [
    accessToken,
    setAccessToken,
    setFoodSearchResults,
    setIsSearching,
    setTotalPages,
    setCurrentPageNumber,
    setBrandedFoods,
    setFoodSearch,
    searchTimeoutRef
  ]);
  
// ---------------------------------------------------------------------------

  const updateFoodSearch = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const search = event.target.value;

    setFoodSearch(search);

    if (search === '') {
      return;
    }

    handleFoodSearch(search, 1);
  }, [
    setFoodSearch,
    handleFoodSearch
  ]);


  return {
    handleFoodSearch,
    updateFoodSearch
  }
};


export default useFoodSearch;
