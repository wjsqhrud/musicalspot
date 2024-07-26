import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { SEARCH_MUSICALS_BY_TITLE } from "utils/APIUrlUtil/apiUrlUtil";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const SearchPage: React.FC = () => {
  const query = useQuery();
  const searchQuery = query.get("query") || "";
  const [searchInput, setSearchInput] = useState<string>(searchQuery);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [noResults, setNoResults] = useState<boolean>(false);
  const navigate = useNavigate();

  const searchMusicalsByTitle = async (title: string) => {
    try {
      const result = await axios.get(SEARCH_MUSICALS_BY_TITLE(title));
      console.log(result.data); // 검색 결과 콘솔 출력
      return result.data;
    } catch (error) {
      return { data: [], message: "No results found" };
    }
  };

  const handleSearchInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchInput(event.target.value);
  };

  const handleSearchSubmit = async () => {
    navigate(`/search?query=${encodeURIComponent(searchInput)}`);
    const results = await searchMusicalsByTitle(searchInput);
    if (results.data.length === 0) {
      setNoResults(true);
    } else {
      setNoResults(false);
      setSearchResults(results.data);
    }
  };

  useEffect(() => {
    if (searchQuery) {
      (async () => {
        const results = await searchMusicalsByTitle(searchQuery);
        if (results.data.length === 0) {
          setNoResults(true);
        } else {
          setNoResults(false);
          setSearchResults(results.data);
        }
      })();
    }
  }, [searchQuery]);

  return (
    <div className="search-page">
      <header className="search-header">
        <h1>'{searchQuery}'에 대한 검색 결과 입니다.</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search"
            value={searchInput}
            onChange={handleSearchInputChange}
          />
          <button onClick={handleSearchSubmit}>
            <FaSearch />
          </button>
        </div>
      </header>
      <div className="search-results">
        {noResults ? (
          <div className="no-results">No results found</div>
        ) : searchResults.length > 0 ? (
          searchResults.map((result) => (
            <div key={result.id} className="search-result-item">
              <img src={result.imageUrl} alt={result.title} />
              <div>
                <h2>{result.title}</h2>
                <p>{result.venue}</p>
                <p>
                  {result.startDate} ~ {result.endDate}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">Loading...</div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
