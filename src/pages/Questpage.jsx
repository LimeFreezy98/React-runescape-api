import { Link } from "react-router-dom";

export default function QuestPage() {

  const freeQuests = [
    "Cook's Assistant",
    "The Restless Ghost",
    "Doric's Quest",
    "Rune Mysteries",
    "Shield of Arrav",
    "Ernest the Chicken",
    "Romeo & Juliet",
    "Imp Catcher",
    "Pirate's Treasure",
    "Prince Ali Rescue",
    "Vampyre Slayer",
    "Witch's Potion",
    "Black Knights' Fortress",
    "Goblin Diplomacy",
  ];

  const memberQuests = [
    "Dragon Slayer II",
    "Monkey Madness I",
    "Monkey Madness II",
    "Recipe for Disaster",
    "The Fremennik Trials",
    "The Fremennik Isles",
    "Desert Treasure I",
    "Desert Treasure II - The Fallen Empire",
    "Underground Pass",
    "Regicide",
    "Animal Magnetism",
    "Fairytale I - Growing Pains",
    "Fairytale II - Cure a Queen",
    "Mourning's End Part I",
    "Mourning's End Part II",
    "Goblin Diplomacy",
    "Plague City",
  ];

  return (
    <div className="quests-page">
      <h1>OSRS Quests</h1>

      <section>
        <h2>Free-to-play Quests</h2>
        <ul>
          {freeQuests.map((q) => (
            <li key={q}>
              <Link to={`/article/${encodeURIComponent(q)}`}>{q}</Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Members Quests</h2>
        <ul>
          {memberQuests.map((q) => (
            <li key={q}>
              <Link to={`/article/${encodeURIComponent(q)}`}>{q}</Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}