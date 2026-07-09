import { useEffect, useRef, useState } from "react";
import { searchCities } from "../api.js";

const MIN_CHARS = 3;
const DEBOUNCE_MS = 300;

const SearchBar = ({ onSearch, loading }) => {
  const [term, setTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const abortRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (term.trim().length < MIN_CHARS) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(() => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      searchCities(term.trim(), controller.signal)
        .then((results) => {
          setSuggestions(results);
          setActiveIndex(-1);
        })
        .catch(() => {});
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [term]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectSuggestion = (location) => {
    onSearch(location);
    setTerm("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      selectSuggestion(suggestions[activeIndex]);
      return;
    }
    if (!term.trim()) return;
    onSearch(term.trim());
    setTerm("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleKeyDown = (event) => {
    if (!showSuggestions || suggestions.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => (i - 1 + suggestions.length) % suggestions.length);
    } else if (event.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="search-bar" ref={containerRef}>
      <form className="input-group" onSubmit={handleSubmit} autoComplete="off">
        <input
          placeholder="Search for a city..."
          className="form-control"
          value={term}
          onChange={(e) => {
            setTerm(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
        />
        <button type="submit" className="btn btn-secondary" disabled={loading}>
          {loading ? "Loading..." : "Search"}
        </button>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((location, index) => (
            <li
              key={`${location.latitude},${location.longitude}`}
              className={index === activeIndex ? "active" : ""}
              onMouseDown={() => selectSuggestion(location)}
              onMouseEnter={() => setActiveIndex(index)}
            >
              <span className="suggestion-name">{location.name}</span>
              <span className="suggestion-meta">
                {[location.admin1, location.country].filter(Boolean).join(", ")}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
