import { useCallback } from "react";
import { type Exercise } from "../types/workout-logs";
import { useAuth } from "../../../context/auth/useAuth";
import { refreshAccessToken, isTokenExpired } from "../../../utils/auth";
import { getExercises } from "../../../utils/workout-logs";


const useExerciseSearch = (
  setExerciseSearchResults: React.Dispatch<React.SetStateAction<Exercise[]>>,
  setIsSearching: React.Dispatch<React.SetStateAction<boolean>>,
  setTotalPages: React.Dispatch<React.SetStateAction<number | null>>,
  setCurrentPageNumber: React.Dispatch<React.SetStateAction<number | null>>,
  setExerciseSearch: React.Dispatch<React.SetStateAction<string>>,
  searchTimeoutRef: React.RefObject<number | null>
) => {
  const { accessToken, setAccessToken } = useAuth();

  const MAX_RESULTS_PER_PAGE = 30;


  const handleExerciseSearch = useCallback(async (search: string, pageNumber: number) => {
    setExerciseSearch(search);

    if (search === '') {
      return;
    }

    setExerciseSearchResults([]);
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

        const foodSearchObject = await getExercises(
          MAX_RESULTS_PER_PAGE,
          skip,
          search,
          setExerciseSearchResults,
          token
        );

        const numPages = Math.ceil(foodSearchObject.total_count / MAX_RESULTS_PER_PAGE);
        setTotalPages(numPages);
        setCurrentPageNumber(pageNumber);

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
    setExerciseSearchResults,
    setIsSearching,
    setTotalPages,
    setCurrentPageNumber,
    setExerciseSearch,
    searchTimeoutRef
  ]);
  
// ---------------------------------------------------------------------------

  const updateExerciseSearch = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const search = event.target.value;

    setExerciseSearch(search);

    if (search === '') {
      return;
    }

    handleExerciseSearch(search, 1);
  }, [
    setExerciseSearch,
    handleExerciseSearch
  ]);


  return {
    handleExerciseSearch,
    updateExerciseSearch
  }
};


export default useExerciseSearch;
