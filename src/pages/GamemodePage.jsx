import { Link, useParams } from "react-router-dom";
import { useState } from "react";

export default function GameModePage() {
  const { id } = useParams();
  const [filter, setFilter] = useState("all");

  // -------------------
  // DETAIL VIEW
  // -------------------
  if (id) {
    const data = GAME_MODE_DATA[id];
    if (!data) return <p>Game mode not found.</p>;
  }

  // -------------------
  // LIST VIEW
  // -------------------
  const entries = Object.entries(GAME_MODE_DATA).filter(
    ([key]) => filter === "all" || key === filter
  );

  return (
    <div className="gamemode-page">
      <h1>OSRS Game Modes</h1>

      {/* FILTER BUTTONS */}
      <div className="filters">
     {FILTERS.map(f => (
       <button
        key={f.id}
       className={filter === f.id ? "active" : ""}
        onClick={() => setFilter(f.id)}
         >
        {f.label}
        </button>
       ))}
     </div>

      {/* LIST */}
      <ul className="gamemode-list">
  {entries.map(([id, data]) => (
    <li key={id} className="gamemode-card">
       <h2>
    <Link to={`/article/${encodeURIComponent(data.article)}`}>
      {data.name}
    </Link>
  </h2>

  <span className="tag">{data.category}</span>
  <p>{data.description}</p>

      <a
        href={`https://oldschool.runescape.wiki/w/${encodeURIComponent(
          data.article
        )}`}
        target="_blank"
        rel="noreferrer"
      >
        OSRS Wiki →
      </a>
    </li>
  ))}
</ul>
    </div>
  );
}

const GAME_MODE_DATA = {
  "normal-world": {
    name: "Normal world",
    category: "World Type",
    description:
      "Standard Old School RuneScape worlds. Includes both Free-to-play and Members worlds.",
    article: "World"
  },

  "pvp-world": {
    name: "PvP world",
    category: "World Type, pvp",
    description:
      "Players can attack each other almost anywhere. Death causes item loss.",
    article: "World"
  },

  "highrisk-pvp-world": {
    name: "High risk PvP world",
    category: "World Type, pvp",
    description:
      "A PvP world variant where no items are protected on death.",
    article: "World"
  },

  "deadman-mode": {
    name: "Deadman mode",
    category: "Gamemode, pvp",
    description:
      "Competitive mode with XP multipliers and full item loss.",
    article: "Deadman Mode"
  },

  "tournament-world": {
    name: "Tournament world",
    category: "World Type, pvp",
    description:
      "Special worlds used for official PvP tournaments.",
    article: "World"
  },

  "leagues-world": {
    name: "Leagues world",
    category: "Seasonal",
    description:
      "Limited-time mode with accelerated progression and unique relics.",
    article: "Leagues"
  },

  "quest-speedrun-world": {
    name: "Quest speedrun world",
    category: "Special",
    description:
      "Players attempt to complete quests as fast as possible using preset accounts.",
    article: "Quest Speedrunning"
  },

  "sailing-world": {
    name: "Sailing world",
    category: "Development",
    description:
      "Experimental worlds used to test the Sailing skill.",
    article: "World"
  },

  "iron-man-mode": {
    name: "Iron man mode",
    category: "Account Mode",
    description:
      "A self-sufficient mode where trading and assistance are restricted.",
    article: "Ironman Mode"
  }
};

const FILTERS = [
  { id: "all", label: "All" },
  { id: "normal-world", label: "Normal world" },
  { id: "pvp-world", label: "PvP world" },
  { id: "highrisk-pvp-world", label: "High risk PvP world" },
  { id: "deadman-mode", label: "Deadman mode" },
  { id: "tournament-world", label: "Tournament world" },
  { id: "leagues-world", label: "Leagues world" },
  { id: "quest-speedrun-world", label: "Quest speedrun world" },
  { id: "sailing-world", label: "Sailing world" },
  { id: "iron-man-mode", label: "Iron man mode" }
];
