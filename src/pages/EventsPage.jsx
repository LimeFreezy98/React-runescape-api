import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const FILTERS = [
  "All",
  "Christmas",
  "Easter",
  "Halloween",
  "Anniversary",
  "Other"
];

// REAL wiki categories only
const CATEGORIES = [
  "Category:Christmas events",
  "Category:Easter events",
  "Category:Halloween events"
];

// Manual Anniversary events (OSRS-style)
const ANNIVERSARY_EVENTS = [
    {
      title: "8th Anniversary",
      article: "2021",
      type: "Anniversary",
      year: "2021",
      reward: "Anniversary cape"
    },
    {
      title: "10th Anniversary",
      article: "Old School RuneScape 10th Anniversary",
      type: "Anniversary",
      year: "2023",
      reward: "Cosmetic items"
    }
  ];

// Other special events
const OTHER_EVENTS = [
    {
      title: "Forestry",
      article: "Forestry",
      type: "Other",
      year: "2023"
    },
    {
      title: "April Fools",
      article: "2013 April Fools",
      type: "Other",
      year: "2013"
    }
  ];

function inferEventType(title) {
  const t = title.toLowerCase();
  if (t.includes("christmas") || t.includes("xmas")) return "Christmas";
  if (t.includes("easter")) return "Easter";
  if (t.includes("halloween")) return "Halloween";
  return "Other";
}

function inferYear(title) {
  const match = title.match(/\b(19|20)\d{2}\b/);
  return match ? match[0] : "Unknown";
}

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    setLoading(true);

    try {
      const fetchedEvents = [];

      for (const cat of CATEGORIES) {
        const url =
          "https://oldschool.runescape.wiki/api.php" +
          "?action=query" +
          "&list=categorymembers" +
          `&cmtitle=${encodeURIComponent(cat)}` +
          "&cmtype=page" +
          "&cmlimit=500" +
          "&format=json" +
          "&origin=*";

        const res = await fetch(url);
        const data = await res.json();

        if (!data?.query?.categorymembers) continue;

        fetchedEvents.push(
          ...data.query.categorymembers.map(e => ({
            title: e.title,
            type: inferEventType(e.title),
            year: inferYear(e.title)
          }))
        );
      }

      // Merge everything
      setEvents([
        ...fetchedEvents,
        ...ANNIVERSARY_EVENTS,
        ...OTHER_EVENTS
      ]);
    } catch (err) {
      console.error("Event load error:", err);
    }

    setLoading(false);
  }

  const filtered =
    filter === "All"
      ? events
      : events.filter(e => e.type === filter);

  return (
    <div className="events-page">
      <h1>OSRS Events</h1>

      <div className="filters">
        {FILTERS.map(f => (
          <button
            key={f}
            className={filter === f ? "active" : ""}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading events…</p>
      ) : filtered.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <ul className="event-list">
          {filtered.map((e, i) => (
            <li key={i}>
            <Link to={`/article/${encodeURIComponent(e.article || e.title)}`}>
                {e.title}
              </Link>
              <span className="tag">
                {e.type}
                {e.year !== "Unknown" && ` · ${e.year}`}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}