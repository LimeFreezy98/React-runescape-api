import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ITEM_TYPES = [
    "All",
  "Food",
  "Weapon",
  "Armour",
  "Runes",
  "Crafting",
  "Currency",
  "Other"
];
  
const CURRENCY_NAMES = new Set([
    "Coins",
    "Platinum token",
    "Old school bond",
    "Tokkul",
    "Trading sticks",
    "Castle Wars ticket"
  ]);

export default function ItemPage() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    loadItems();
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
  
  async function loadItems() {
    setLoading(true);
  
    try {
      const [items, currency] = await Promise.all([
        loadCategory("Items"),
        loadCategory("Currency")
      ]);
  
      // Merge + deduplicate by title
      const map = new Map();
  
      [...items, ...currency].forEach(i => {
        map.set(i.title, {
          title: i.title,
          type: detectType(i.title)
        });
      });
  
      setItems(Array.from(map.values()));
    } catch (err) {
      console.error(err);
    }
  
    setLoading(false);
  }

  function detectType(title) {
    const clean = title.trim();
    
    if (CURRENCY_NAMES.has(clean)) {
      return "Currency";
    }
  
    const t = clean.toLowerCase();
  
    if (t.includes("rune")) return "Runes";
  
    if (
      t.includes("sword") ||
      t.includes("bow") ||
      t.includes("staff") ||
      t.includes("dagger") ||
      t.includes("axe") ||
      t.includes("mace")
    ) {
      return "Weapon";
    }
  
    if (
      t.includes("helm") ||
      t.includes("helmet") ||
      t.includes("plate") ||
      t.includes("chain") ||
      t.includes("shield") ||
      t.includes("armour")
    ) {
      return "Armour";
    }
  
    if (
      t.includes("shrimp") ||
      t.includes("lobster") ||
      t.includes("shark") ||
      t.includes("cake") ||
      t.includes("pie") ||
      t.includes("bread")
    ) {
      return "Food";
    }
  
    if (
      t.includes("log") ||
      t.includes("bar") ||
      t.includes("ore") ||
      t.includes("hide")
    ) {
      return "Crafting";
    }
  
    return "Other";
  }

  const filteredItems =
    filter === "All"
      ? items
      : items.filter(i => i.type === filter);

  const paginated = filteredItems.slice(
    page * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE + ITEMS_PER_PAGE
  );

  return (
    <div className="items-page">
      <h1>OSRS Items</h1>

      {/* Filters */}
      <div className="filters">
        {ITEM_TYPES.map(t => (
          <button
            key={t}
            onClick={() => {
              setFilter(t);
              setPage(0);
            }}
            className={filter === t ? "active" : ""}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading items…</p>
      ) : (
        <ul className="item-list">
          {paginated.map((item, idx) => (
            <li key={idx}>
              <Link to={`/article/${encodeURIComponent(item.title)}`}>
                {item.title}
              </Link>
              <span className="type">{item.type}</span>
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
          disabled={(page + 1) * ITEMS_PER_PAGE >= filteredItems.length}
          onClick={() => setPage(p => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}