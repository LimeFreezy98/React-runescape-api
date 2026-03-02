
import './App.css'
import { Routes, Route, Link } from "react-router-dom";

import HomePage from "./pages/DashboardPage";
import WikiSearch from "./pages/WikiSearch";
import ArticleView from "./pages/ArticleView";
import QuestPage from './pages/Questpage';
import SkillPage from './pages/SkillPage';
import ItemPage from './pages/ItemPage';
import MonsterPage from './pages/MonsterPage';
import LocationPage from './pages/LocationPage';
import EncounterPage from './pages/EncounterPage';
import EventsPage from './pages/EventsPage';

import SpellPage from './pages/SpellPage';

import GameModePage from './pages/GamemodePage';
import WorldMapPage from './pages/WorldMapPage';
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
          <Route path="/skills" element={<SkillPage/>} />
          <Route path="/items" element={<ItemPage />} />
          <Route path="/monsters" element={<MonsterPage />} />
          <Route path="/location" element={< LocationPage/>} />
          <Route path="/encounter" element={<EncounterPage/>} />
          <Route path="/events"  element={<EventsPage/>} />
          <Route path="/spells"  element={<SpellPage/>} />
          <Route path="/gamemode"  element={<GameModePage/>} />
          <Route path="/Worldmap" element={<WorldMapPage/>} />
        </Routes>
      </main>

      
    </>
  );
}

export default App;