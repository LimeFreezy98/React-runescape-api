import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const FILTERS = [
  "All",
  "Friendly",
  "Hostile",
  "Puzzle",
  "Minigame",
  "XP Reward",
  "Utility"
];

function hasXPReward(rewards = []) {
    return rewards.some(r => r.toLowerCase().includes("xp"));
  }

const ENCOUNTER_DATA = {
    "Genie": {
      types: ["Friendly"],
      rewards: ["XP Lamp"]
    },
  
    "Evil Bob": {
      types: ["Hostile", "Minigame"],
      rewards: ["Fishing XP", "Items"]
    },
  
    "Maze": {
      types: ["Puzzle", "Minigame"],
      rewards: ["XP", "Random Items"]
    },
  
    "Dr Jekyll": {
      types: ["Utility"],
      rewards: ["Potion"]
    },
  
    "Sandwich lady": {
      types: ["Friendly"],
      rewards: ["Food", "Teleport"]
    },
  
    "Freaky Forester": {
      types: ["Minigame"],
      rewards: ["Woodcutting XP"]
    },
  
    "Drill Demon": {
      types: ["Minigame"],
      rewards: ["Agility XP"]
    },
  
    "River Troll": {
      types: ["Hostile"],
      rewards: ["None"]
    },
  
    "Mysterious Old Man": {
      types: ["Puzzle", "Minigame"],
      rewards: ["Teleport", "XP"]
    }
  };

  function inferTypes(title) {
    const t = title.toLowerCase();
  
    if (t.includes("genie")) return ["Friendly"];
    if (t.includes("sandwich")) return ["Friendly"];
    if (t.includes("jekyll")) return ["Utility"];
  
    if (t.includes("beekeeper")) return ["Minigame"];
    if (t.includes("maze")) return ["Puzzle", "Minigame"];
    if (t.includes("old man")) return ["Puzzle", "Minigame"];
    if (t.includes("forester")) return ["Minigame"];
    if (t.includes("demon")) return ["Minigame"];
  
    if (t.includes("bob")) return ["Hostile", "Minigame"];
    if (t.includes("troll")) return ["Hostile"];
  
    return ["Unknown"];
  }


  function inferRewards(title) {
    const t = title.toLowerCase();
  
    if (t.includes("genie")) return ["XP Lamp"];
    if (t.includes("beekeeper")) return ["Beekeeper outfit"];
    if (t.includes("maze")) return ["XP", "Random Items"];
    if (t.includes("forester")) return ["Woodcutting XP"];
    if (t.includes("demon")) return ["Agility XP"];
    if (t.includes("bob")) return ["Fishing XP", "Items"];
    if (t.includes("sandwich")) return ["Food", "Teleport"];
    if (t.includes("jekyll")) return ["Potion"];
    if (t.includes("troll")) return ["None"];
  
    return ["Unknown"];
  }
  
  

  function normalize(list) {
    return list.includes("Unknown") ? ["Other"] : list;
  }

  


export default function EncounterPage() {
  const [encounters, setEncounters] = useState([]);
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const PER_PAGE = 20;

  useEffect(() => {
    loadEncounters();
  }, []);

  async function loadEncounters() {
    setLoading(true);

    try {
      const url =
        "https://oldschool.runescape.wiki/api.php" +
        "?action=query" +
        "&list=categorymembers" +
        "&cmtitle=Category:Random_events" +
        "&cmlimit=500" +
        "&format=json" +
        "&origin=*";

      const res = await fetch(url);
      const data = await res.json();

      const mapped = data.query.categorymembers.map(e => {
        const meta = ENCOUNTER_DATA[e.title];

        return {
          title: e.title,
          types: normalize(meta?.types ?? inferTypes(e.title)),
          rewards: normalize(meta?.rewards ?? inferRewards(e.title))
        };
      });

      setEncounters(mapped);
    } catch (e) {
      console.error(e);
    }

    setLoading(false);
  }

  const filtered =
  filter === "All"
    ? encounters
    : encounters.filter(e => {
        if (e.types.includes(filter)) return true;

        if (filter === "XP Reward") 
          return hasXPReward(e.rewards);
        

        return false;
      });

  const paginated = filtered.slice(
    page * PER_PAGE,
    page * PER_PAGE + PER_PAGE
  );

  return (
    <div className="encounters-page">
      <h1>OSRS Random Encounters</h1>

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
        <p>Loading encounters…</p>
      ) : (
        <ul className="encounter-list">
          {paginated.map((e, i) => (
            <li key={i}>
              <Link to={`/article/${encodeURIComponent(e.title)}`}>
                {e.title}
              </Link>
              <span className="tags">
             {e.types.join(" · ")} · {e.rewards.join(" · ")}
             </span>
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