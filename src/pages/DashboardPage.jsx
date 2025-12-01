import { Link } from "react-router-dom";


export default function HomePage() {
  return (
    <div className="home">
      <h1>Old School RuneScape Explorer</h1>
      <p>Choose a category:</p>

      <div className="category-grid">

        <Link to="/quests" className="category-card">
          <h2>Quests</h2>
          <p>Browse all OSRS quests with details & requirements.</p>
        </Link>

        <Link to="/skills" className="category-card">
          <h2>Skills</h2>
          <p>View training info, XP rates, and skill info.</p>
        </Link>

        <Link to="/items" className="category-card">
          <h2>Items</h2>
          <p>See items, armor, equipment, and more.</p>
        </Link>

        <Link to="/monsters" className="category-card">
          <h2>Monsters</h2>
          <p>Lookup stats, drops, weakness.</p>
        </Link>

        <Link to="/location" className="category-card">
          <h2>Locations</h2>
          <p>Lookup locations, and area for Explorer.</p>
        </Link>

        <Link to="/encounter" className="category-card">
          <h2>Encounters</h2>
          <p>Lookup Random Encounters, what the encounters do.</p>
        </Link>

        <Link to="/events" className="category-card">
          <h2>Events</h2>
          <p>Lookup Events every seasonal or months. </p>
        </Link>

      </div>

      <div style={{ marginTop: "40px", textAlign: "center" }}>
        <Link to="/search" className="search-link">Go to Wiki Search  </Link>
      </div>
    </div>
  );
}