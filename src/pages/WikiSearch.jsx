import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
// import SearchInput from "../components/SearchInput";
// import { wikiSearch as fetchWikiSearch } from "../api/runescape";

async function fetchWikiSearch(query) {
    const url =
    `https://oldschool.runescape.wiki/api.php?action=query` +
    `&generator=search` +
    `&gsrsearch=${encodeURIComponent(query)}` +
    `&gsrlimit=20` +
    `&prop=pageimages|extracts` +
    `&piprop=thumbnail` +
    `&pithumbsize=200` +
    `&exintro&explaintext` +
    `&format=json&origin=*`;

  
    const res = await fetch(url);
    const data = await res.json();
  
    return data?.query?.pages 
    ? Object.values(data.query.pages) : [];
  }

export default function WikiSearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const doSearch = useCallback(async (q) => {
    setError(null);
    setResults([]);

    if (!q || q.trim().length < 1) return;

    setLoading(true);

    try {
      const items = await fetchWikiSearch(q); // renamed
      setResults(items);
    } catch (err) {
      setError(err.message || "Search failed");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="page">
      <h1>Search the OSRS Wiki</h1>

       <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          doSearch(e.target.value);
        }}
        placeholder="Search items, monsters, quests…"
        className="search-box"
      />
      
      {loading && <p>Loading results…</p>}
      {error && <p className="error">Error: {error}</p>}

      <ul className="results-list">
        {results.map((r) => (
          <li key={r.pageid} className="result">
            <Link to={`/article/${encodeURIComponent(r.title)}`}>
                <div className="result-item">
                {r.thumbnail?.source && (
                  <img 
                    src={r.thumbnail.source}
                    alt={r.title}
                    className="thumb"
                    />  
                )}

                <div>
                 <strong>{r.title}</strong>
                  <p className="snippet">{r.extract} </p>
                </div>
               </div>
            </Link>
           
              {r.snippet?.replace(/<\/?span[^>]*>/g, "")}…
            
          </li>
        ))}
      </ul>

      {!loading && !error && results.length === 0 && query.trim().length > 0 && (
        <p>No results found.</p>
      )}
    </div>
  );
}