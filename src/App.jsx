
import './App.css'
import { Routes, Route, Link } from "react-router-dom";

import HomePage from "./pages/DashboardPage";
import WikiSearch from "./pages/WikiSearch";
import ArticleView from "./pages/ArticleView";
import QuestPage from './pages/Questpage';


import WikiSearchPage from "./pages/WikiSearch";

<Route path="/search" element={<WikiSearchPage />} />

function App() {
  return (
    <>
      <header className="app-header">
        <Link to="/" className="logo">OSRS Explorer</Link>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />

          {/* Search + article viewer from earlier */}
          <Route path="/search" element={<WikiSearch />} />
          <Route path="/article/:title" element={<ArticleView />} />

          {/* Category pages (empty for now.) */}
          <Route path="/quests" element={<QuestPage />} />
          <Route path="/skills" element={<div>Skills Page</div>} />
          <Route path="/items" element={<div>Items Page</div>} />
          <Route path="/monsters" element={<div>Monsters Page</div>} />
          <Route path="/location" element={<div>Location Page</div>} />
          <Route path="/encounter" element={<div>Encounter Page</div>} />
          <Route path="/events"  element={<div>Events Page</div>} />
        </Routes>
      </main>

      
    </>
  );
}

export default App;