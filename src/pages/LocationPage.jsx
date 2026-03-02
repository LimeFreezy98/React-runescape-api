import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const FILTERS = [
  "All",
  "City",
  "Town",
  "Area",
  "Region",
  "Wilderness"
];

const KNOWN_CITIES = [
  "lumbridge",
  "varrock",
  "falador",
  "ardougne",
  "al kharid",
  "edgeville",
  "draynor",
  "seers' village"
];

export default function LocationPage() {
  const [locations, setLocations] = useState([]);
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const PER_PAGE = 20;

  useEffect(() => {
    loadLocations();
  }, []);

  async function loadCategory(category) {
    const url =
      "https://oldschool.runescape.wiki/api.php" +
      "?action=query" +
      "&list=categorymembers" +
      `&cmtitle=Category:${encodeURIComponent(category)}` +
      "&cmlimit=500" +
      "&format=json" +
      "&origin=*";

    const res = await fetch(url);
    const data = await res.json();
    return data.query.categorymembers || [];
  }

  async function loadLocations() {
    setLoading(true);

    try {
      const [locations, regions, wilderness] = await Promise.all([
        loadCategory("Locations"),
        loadCategory("Regions"),
        loadCategory("Wilderness")
      ]);

      const merged = [...locations, ...regions, ...wilderness];

      const mapped = merged.map(l => ({
        title: l.title,
        type: detectType(l.title)
      }));

      // dedupe
      const unique = Array.from(
        new Map(mapped.map(l => [l.title, l])).values()
      );

      setLocations(unique);
    } catch (e) {
      console.error(e);
    }

    setLoading(false);
  }

  function detectType(title) {
    const t = title.toLowerCase();

    if (t.includes("wilderness")) return "Wilderness";

    if (
      t.includes("desert") ||
      t.includes("island") ||
      t.includes("region") ||
      t.includes("province")
    ) {
      return "Region";
    }

    if (KNOWN_CITIES.some(c => t.includes(c))) {
      return "City";
    }

    if (
      t.includes("village") ||
      t.includes("town")
    ) {
      return "Town";
    }

    return "Area";
  }

  const filtered =
    filter === "All"
      ? locations
      : locations.filter(l => l.type === filter);

  const paginated = filtered.slice(
    page * PER_PAGE,
    page * PER_PAGE + PER_PAGE
  );

  return (
    <div className="locations-page">
      <h1>OSRS Locations</h1>

      <div className="filters">
        {FILTERS.map(f => (
          <button
            key={f}
            className={filter === f ? "active" : ""}
            onClick={() => {
              setFilter(f);
              setPage(0);
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading locations…</p>
      ) : (
        <ul className="location-list">
          {paginated.map((loc, i) => (
            <li key={i}>
              <Link to={`/article/${encodeURIComponent(loc.title)}`}>
                {loc.title}
              </Link>
              <span className="type">{loc.type}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="pagination">
        <button disabled={page === 0} onClick={() => setPage(p => p - 1)}>
          Prev
        </button>
        <span>Page {page + 1}</span>
        <button
          disabled={(page + 1) * PER_PAGE >= filtered.length}
          onClick={() => setPage(p => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}