import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const FILTERS = [
  "All",
  "Passive",
  "Aggressive",
  "Boss",
  "Quest Boss",
  "Low Combat",
  "Mid Combat",
  "High Combat"
];

const PASSIVE_MONSTERS = new Set([
  "Cow",
  "Chicken",
  "Sheep",
  "Duck",
  "Rat",
  "Butterfly"
]);

export default function MonsterPage() {
  const [monsters, setMonsters] = useState([]);
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const PER_PAGE = 20;

  useEffect(() => {
    loadMonsters();
  }, []);

  async function loadCategory(category) {
    let results = [];
    let cmcontinue = null;
  
    do {
      const url =
        "https://oldschool.runescape.wiki/api.php" +
        "?action=query" +
        "&list=categorymembers" +
        `&cmtitle=Category:${encodeURIComponent(category)}` +
        "&cmtype=page" +
        "&cmlimit=500" +
        (cmcontinue ? `&cmcontinue=${encodeURIComponent(cmcontinue)}` : "") +
        "&format=json" +
        "&origin=*";
  
      const res = await fetch(url);
      const data = await res.json();
  
      if (data.query?.categorymembers) {
        results.push(...data.query.categorymembers);
      }
  
      cmcontinue = data.continue?.cmcontinue ?? null;
    } while (cmcontinue);
  
    return results;
  }
  
  async function loadMonsters() {
    setLoading(true);
  
    try {
      const [monsters, questBosses] = await Promise.all([
        loadCategory("Monsters"),
        loadCategory("Quest  monsters")
      ]);
  
      const questSet = new Set(questBosses.map(q => q.title));
  
      const merged = [...monsters, ...questBosses];
  
      const mapped = merged.map(m => ({
        title: m.title,
        behavior: detectBehavior(m.title),
        type: questSet.has(m.title)
          ? "Quest Boss"
          : detectType(m.title),
        difficulty: detectDifficulty(m.title)
      }));
  
      setMonsters(mapped);
    } catch (e) {
      console.error(e);
    }
  
    setLoading(false);
  }

  function detectBehavior(title) {
    return PASSIVE_MONSTERS.has(title) ? "Passive" : "Aggressive";
  }

  function detectType(title) {
    const t = title.toLowerCase();
  
    if (
      t.includes("boss") ||
      t.includes("king") ||
      t.includes("queen") ||
      t.includes("lord") ||
      t.includes("dragon") ||
      t.includes("jad") ||
      t.includes("zulrah") ||
      t.includes("vorkath")
    ) {
      return "Boss";
    }
  
    return "Normal";
  }

  function detectDifficulty(title) {
    const t = title.toLowerCase();

    if (
      t.includes("cow") ||
      t.includes("chicken") ||
      t.includes("rat")
    ) {
      return "Low Combat";
    }

    if (
      t.includes("demon") ||
      t.includes("dragon")
    ) {
      return "High Combat";
    }

    return "Mid Combat";
  }

  const filtered =
    filter === "All"
      ? monsters
      : monsters.filter(m =>
          [m.behavior, m.type, m.difficulty].includes(filter)
        );

  const paginated = filtered.slice(
    page * PER_PAGE,
    page * PER_PAGE + PER_PAGE
  );

  return (
    <div className="monsters-page">
      <h1>OSRS Monsters</h1>

      {/* Filters */}
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
        <p>Loading monsters…</p>
      ) : (
        <ul className="monster-list">
          {paginated.map((m, i) => (
            <li key={i}>
              <Link to={`/article/${encodeURIComponent(m.title)}`}>
                {m.title}
              </Link>
              <span className="tags">
                {m.behavior} · {m.type} · {m.difficulty}
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
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