import React, { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { SEARCH_MUSICALS_BY_TITLE } from "utils/APIUrlUtil/apiUrlUtil";

interface MusicalSearchProps {
  onMusicalSelect: (musicalId: string, imageUrl?: string) => void;
}

const MusicalSearch: React.FC<MusicalSearchProps> = ({ onMusicalSelect }) => {
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] =
    useState<boolean>(false);
  const [noResults, setNoResults] = useState<boolean>(false);
  const searchDropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchDropdownRef.current &&
        !searchDropdownRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setIsSearchDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const searchMusicalsByTitle = async (title: string) => {
    try {
      const result = await axios.get(SEARCH_MUSICALS_BY_TITLE(title));
      console.log(result.data);
      return result.data;
    } catch (error) {
      return { data: [], message: "No results found" };
    }
  };

  const handleSearchInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setSearchInput(value);
    if (value) {
      const encodedValue = encodeURIComponent(value);
      console.log(encodedValue);
      const results = await searchMusicalsByTitle(encodedValue);
      if (results.data.length === 0) {
        setNoResults(true);
      } else {
        setNoResults(false);
        setSearchResults(results.data);
      }
      setIsSearchDropdownOpen(true);
    } else {
      setSearchResults([]);
      setIsSearchDropdownOpen(false);
      setNoResults(false);
    }
  };

  const handleSearchSubmit = (
    event: React.KeyboardEvent | React.MouseEvent
  ) => {
    if (
      searchInput &&
      (event.type === "click" || (event as React.KeyboardEvent).key === "Enter")
    ) {
      // 여기서는 뮤지컬을 선택하는 동작을 수행합니다.
      if (searchResults.length > 0) {
        onMusicalSelect(searchResults[0].id, searchResults[0].imageUrl);
      }
    }
  };

  const handleSearchResultClick = (result: any) => {
    onMusicalSelect(result.id, result.imageUrl);
    setSearchInput("");
    setIsSearchDropdownOpen(false);
  };

  return (
    <div className="mt-4 relative">
      <div
        ref={searchInputRef}
        className="flex items-center border-b-2 border-black"
      >
        <input
          type="text"
          placeholder="뮤지컬 검색..."
          className="w-full p-2 focus:outline-none"
          value={searchInput}
          onChange={handleSearchInputChange}
          onKeyDown={handleSearchSubmit}
          onClick={() => setIsSearchDropdownOpen(true)}
        />
        <button className="p-1" onClick={handleSearchSubmit}>
          <FaSearch />
        </button>
      </div>
      {isSearchDropdownOpen && (
        <div
          ref={searchDropdownRef}
          className="absolute top-12 left-0 right-0 bg-white border border-gray-300 z-10"
          style={{ maxHeight: "300px", overflowY: "auto" }}
        >
          {noResults ? (
            <div className="p-2">검색 결과가 없습니다.</div>
          ) : searchResults.length > 0 ? (
            searchResults.map((result) => (
              <div
                key={result.id}
                className="p-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSearchResultClick(result)}
              >
                {result.title}
              </div>
            ))
          ) : (
            <div className="p-2">검색 중...</div>
          )}
        </div>
      )}
    </div>
  );
};

export default MusicalSearch;
