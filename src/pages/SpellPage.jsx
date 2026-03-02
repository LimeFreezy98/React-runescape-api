import { Link, useParams } from "react-router-dom";
import { useState } from "react";

export default function SpellsPage() {
  const { id } = useParams();
  const [filter, setFilter] = useState("all");

  // ---------------------
  // DETAIL VIEW
  // ---------------------
  if (id) {
    const spell = SPELL_DATA[id];
    if (!spell) return <p>Spell not found.</p>;





    return (
        <div className="spell-detail">
        <h1>{spell.name}</h1>
      
        {spell.spellbook && (
          <p><strong>Spellbook:</strong> {spell.spellbook}</p>
        )}
      
        {spell.level !== undefined && (
          <p><strong>Level required:</strong> {spell.level} Magic</p>
        )}
      
        {spell.members !== undefined && (
          <p>
            <strong>Members:</strong>{" "}
            {spell.members ? "Yes" : "No"}
          </p>
        )}
      
        {spell.cooldown && (
          <p><strong>Cooldown:</strong> {spell.cooldown}</p>
        )}
      
        {spell.runes && spell.runes.length > 0 && (
          <>
            <h3>Runes required</h3>
            <ul>
              {spell.runes.map(r => (
                <li key={r.rune}>
                  {r.amount} × {r.rune}
                </li>
              ))}
            </ul>
          </>
        )}
      
        <p>{spell.description}</p>
      
        <a
          href={`https://oldschool.runescape.wiki/w/${encodeURIComponent(
            spell.article
          )}`}
          target="_blank"
          rel="noreferrer"
        >
          OSRS Wiki →
        </a>
      </div>
    );
  }

  // ---------------------
  // LIST VIEW
  // ---------------------
  const entries = Object.entries(SPELL_DATA).filter(([_, data]) => {
    if (filter === "all") return true;
    if (filter === "spell-books") return data.type === "spellbooks";
    return data.type === "spell" && data.spellbook === filter;
  });
  

  return (
    <div className="spell-page">
      <h1>OSRS Spells</h1>

      {/* FILTER BUTTONS */}
      <div className="filters">
        {SPELLBOOK_FILTERS.map(f => (
          <button
            key={f.id}
            className={filter === f.id ? "active" : ""}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* SPELL LIST */}
      <ul className="spell-list">
  {entries.map(([id, data]) => (
    <li key={id} className="spell-card">
      <h2>
        <Link to={`/article/${encodeURIComponent(data.article)}`}>
          {data.name}
        </Link>
      </h2>

      <span className="tag">{data.category}</span>

      {data.type === "spell" && (
        <p>
          Level {data.level} • {data.members ? "Members" : "Free-to-play"}
        </p>
      )}

      <p>{data.description}</p>

      <a
        href={`https://oldschool.runescape.wiki/w/${encodeURIComponent(data.article)}`}
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



const SPELL_DATA = {
    "standard-book": { 
      name: "Standard spellbook",
      spellbook: "standard",
      type: "spellbooks",
      description:
        "The standard spellbook is a group of Magic spells available to all players, being unlocked by default upon character creation. Standard spells make use of all runes except Astral.",
      article: "Standard spellbook"
    },

    "ancient-book": {
        name: "Ancient magicks",
        type: "spellbooks",
        spellbook: "ancient",
        description:
        "Ancient Magicks (also known as Ancients) are a series of Magic spells unlocked upon completion of the quest Desert Treasure I. Unlike the Lunar spellbook, which primarily focuses on utility spells, and both the standard spellbook and the Arceuus spellbook, which feature a mixture of combat and utility spells, the Ancient Magicks is significantly combat-oriented, including some of the most powerful combat spells in the game.",
        article: "Ancient Magicks"
    },

    "lunar-book": {
      name: "Lunar spellbook",
      type: "spellbooks",
      spellbook: "lunar",
      description: 
      "The Lunar spellbook is a spellbook that players can access upon completion of the quest Lunar Diplomacy, associated with the magicks of the Moon Clan. Making extensive use of astral runes, the spellbook is primarily oriented towards utility spells and combat-support spells, reducing or eliminating the need for certain items and equipment to carry out certain tasks.",
      article: "Lunar spellbook"
        
    },
  
    "arceuus-book": {
      name: "Arceuus spellbook",
      type: "spellbooks",
      spellbook: "arceuus",
      description:
        "The Arceuus spellbook is a spellbook that players can immediately access upon speaking to Tyss in Arceuus; with a focus on necromancy, prayer, demon-slaying, and augmenting combat. Like the standard spellbook, it has a variety of combat and utility spells at its disposal, unlike the Lunar spellbook, which is primarily focused on utility spells, and the Ancient Magicks, which is heavily combat-oriented.",
      article: "Arceuus spellbook"
    },
  
     // -----------------
  // STANDARD SPELLS
  // -----------------
  "lumbridge-home-teleport": {
    type: "spell",
    spellbook: "standard",
    name: "Lumbridge Home Teleport",
    level: 0,
    members: false,
    cooldown: "30 min",
    runes: [],
    // description:
    //   "Free teleport to Lumbridge every 30 minutes.",
    article: "Lumbridge Home Teleport"
  },

  "wind-strike": {
    type: "spell",
    spellbook: "standard",
    name: "Wind Strike",
    level: 1,
    members: false,
    runes: [
      { rune: "Air rune", amount: 1 },
      { rune: "Mind rune", amount: 1 }
    ],
    description:
      "An early combat spell that deals low damage.",
    article: "Wind Strike"
  },


  "confuse": {
    type: "spell", 
    spellbook: "standard",
    name: "Confuse",
    level: 3,
    members: false,
    runes: [
      { rune: "Water rune", amount: 3},
      { rune: "Earth rune", amount: 2},
      { rune: "Body rune", amount: 1},
      
    ],
    description: 
    "reduce attack level by 5%",
    article: "Confuse"
  },


  "water-strike": {
    type: "spell", 
    spellbook: "standard",
    name: "Water Strike",
    level: 5,
    members: false,
    runes: [
      
      
    ],
    description: 
    "",
    article: "Water Strike"
  },
  
  "lvl-1-enchant": {
    type: "spell", 
    spellbook: "standard",
    name: "Lvl-1 Enchant",
    level: 7,
    members: false,
    runes: [
      
      
    ],
    description: 
    "",
    article: "Lvl-1 Enchant"
  },

  "earth-strike": {
    type: "spell", 
    spellbook: "standard",
    name: "Earth Strike",
    level: 9,
    members: false,
    runes: [
      
      
    ],
    description: 
    "",
    article: "Earth Strike"
  },

  "weaken": {
    type: "spell", 
    spellbook: "standard",
    name: "Weaken",
    level: 11,
    members: false,
    runes: [
        { rune: "Water rune", amount: 3},
        { rune: "Earth rune", amount: 2},
        { rune: "Body rune", amount: 1},
      
    ],
    description: 
    "reduse strength level by 5%",
    // note: its exact same as confuse but its reduse strength 
    article: "Weaken"
  },

  "fire-strike": {
    type: "spell", 
    spellbook: "standard",
    name: "Fire Strike",
    level: 13,
    members: false,
    runes: [
      
      
    ],
    description: 
    "",
    article: "Fire Strike"
  },


  "bones-to-bananas": {
    type: "spell", 
    spellbook: "standard",
    name: "Bones to Bananas",
    level: 15,
    members: false,
    runes: [
        { rune: "Water rune", amount: 2},
        { rune: "Earth rune", amount: 2},
        { rune: "Nature rune", amount: 1},
      
    ],
    description: 
    "turns any bones into bananas",
    article: "Bones to Bananas"
  },


  "wind-bolt": {
    type: "spell",
    spellbook: "standard",
    name: "Wind Bolt",
    level: 17,
    members: false,
    runes: [

    ],
    description:
    "",
    article: "Wind bolt"
  },

  "curse": {
    type: "spell",
    spellbook: "standard",
    name: "Curse",
    level: 19,
    members: false,
    runes: [

    ],
    description:
    "reduse defence level by 5%",
    // note: its exact  same as  weaken and confuse same reduse combat states  
    article: "curse"
  },

  "bind": {
    type: "spell",
    spellbook: "standard",
    name: "Bind",
    level: 20,
    members: false,
    runes: [
        { rune: "Nature rune", amount: 2},
        { rune: "Earth rune", amount: 3},
        { rune: "Water rune", amount: 3},
    ],
    description:
    "Casting bind on an opponent will prevent it from moving for 8 ticks (4.8 seconds)",
    article: "Bind"
  },

  "water-bolt": {
    type: "spell",
    spellbook: "standard",
    name: "Water Bolt",
    level: 23,
    members: false,
    runes: [

    ],
    description:
    "",
    article: "Water bolt"
  },
   
  "varrock-teleport": {
    type: "spell",
    spellbook: "standard",
    name: "Varrock Teleport",
    level: 25,
    members: false,
    runes: [

    ],
    description:
    "teleport to varrock town square",
    article: "Varrock Teleport"
  },


  "lvl-2-enchant": {
    type: "spell", 
    spellbook: "standard",
    name: "Lvl-2 Enchant",
    level: 27,
    members: false,
    runes: [
      
      
    ],
    description: 
    "",
    article: "Lvl-2 Enchant"
  },

  "earth-bolt": {
    type: "spell",
    spellbook: "standard",
    name: "Earth Bolt",
    level: 29,
    members: false,
    runes: [

    ],
    description:
    "",
    article: "Earth bolt"
  },

   "lumbridge-teleport": {
    type: "spell",
    spellbook: "standard",
    name: "Lumbridge Teleport",
    level: 31,
    members: false,
    runes: [

    ],
    description: 
    "able to teleport lumbridge without cooldown and its faster teleport",
    article: "Lumbridge Teleport"
   },
 
   "telekinetic-grab": {
    type: "spell",
    spellbook: "standard",
    name: "Telekinetic Grab",
    level: 33,
    members: false,
    runes: [

    ],
    description: 
    "able to pick up an item (or a pile of a stackable item) up to 10 tiles away, including over or through obstacles such as fences, gates, and rivers.",
    article: "Telekinetic Grab"
   },

   "fire-bolt": {
    type: "spell",
    spellbook: "standard",
    name: "Fire Bolt",
    level: 35,
    members: false,
    runes: [

    ],
    description:
    "",
    article: "Fire bolt"
  },

  "falador-teleport": {
    type: "spell",
    spellbook: "standard",
    name: "Falador Teleport",
    level: 37,
    members: false,
    runes: [

    ],
    description: 
    "able to teleport Falador",
    article: "Falador Teleport"
   },


   "crumble-undead": {
    type: "spell",
    spellbook: "standard",
    name: "Crumble Undead",
    level: 39,
    members: false,
    runes: [
        { rune: "Air rune", amount: 2},
        { rune: "Earth rune", amount: 2},
        { rune: "chaos rune", amount: 1},
    ],
    description:
    "able damage to undead enemey such as skeletons, zombies, ghosts and shades",
    article: "Crumble Undead"
  },


  "wind-blast": {
    type: "spell",
    spellbook: "standard",
    name: "Wind Blast",
    level: 41,
    members: false,
    runes: [

    ],
    description:
    "",
    article: "Wind Blast"
  },


  "superheat-item": {
    type: "spell",
    spellbook: "standard",
    name: "Superheat Item",
    level: 43,
    members: false,
    runes: [

    ],
    description:
    "to able smelt ores into bars without furnace",
    article: "Superheat Item"
  },

  "camelot-teleport": {
    type: "spell",
    spellbook: "standard",
    name: "Camelot Teleport",
    level: 45,
    members: false,
    runes: [

    ],
    description: 
    "able to teleport Camelot",
    article: "Camelot Teleport"
   },

   "water-blast": {
    type: "spell",
    spellbook: "standard",
    name: "Water Blast",
    level: 47,
    members: false,
    runes: [

    ],
    description:
    "",
    article: "Water Blast"
  },

    
  "lvl-3-enchant": {
    type: "spell", 
    spellbook: "standard",
    name: "Lvl-3 Enchant",
    level: 49,
    members: false,
    runes: [
      
      
    ],
    description: 
    "",
    article: "Lvl-3 Enchant"
  },

  "iban-blast": {
    type: "spell",
    spellbook: "standard",
    name: "Iban Blast",
    level: 50,
    members: false,
    runes: [



    ],
    description:
    "",
    article: "Iban Blast"
  },

  "snare": {
    type: "spell",
    spellbook: "standard",
    name: "Snare",
    level: 50,
    members: false,
    runes: [
     

    ],
    // its same as bind but longer effects
    description:
    "Casting Snare on an opponent will prevent it from moving for 16 ticks (9.6 seconds)",
    article: "Snare"
  },


  "earth-blast": {
    type: "spell",
    spellbook: "standard",
    name: "Earth Blast",
    level: 53,
    members: false,
    runes: [

    ],
    description:
    "",
    article: "Earth Blast"
  },


  "high-level-alchemy": {
    type: "spell",
    spellbook: "standard",
    name: "High Level Alchemy",
    level: 55,
    members: false,
    runes: [

    ],
    description:
    "When cast on an item in the player's inventory, the item is converted into a number of coins equivalent to 60% of the item's value (not the item's Grand Exchange price).",
    article: "High Level Alchemy"
  },


  "charge-water-orb": {
    type: "spell",
    spellbook: "standard",
    name: "Charge Water Orb",
    level: 56,
    members: false,
    runes: [

    ],
    description:
    "It can only be used on the Obelisk of Water.",
    article: "Charge Water Orb"
  },


  "lvl-4-enchant": {
    type: "spell", 
    spellbook: "standard",
    name: "Lvl-4 Enchant",
    level: 57,
    members: false,
    runes: [
      
      
    ],
    description: 
    "",
    article: "Lvl-4 Enchant"
  },


  "watchtower-teleport": {
    type: "spell",
    spellbook: "standard",
    name: "Watchtower Teleport",
    level: 58,
    members: false,
    runes: [

    ],
    description: 
    "able to teleport Watchtower, just north of Yanille. ",
    article: "Watchtower Teleport"
   },

     
   "fire-blast": {
    type: "spell",
    spellbook: "standard",
    name: "Fire Blast",
    level: 59,
    members: false,
    runes: [

    ],
    description:
    "",
    article: "Fire Blast"
  },
   

  "charge-earth-orb": {
    type: "spell",
    spellbook: "standard",
    name: "Charge Earth Orb",
    level: 56,
    members: false,
    runes: [

    ],
    description:
    "It can only be used on the Obelisk of earth.",
    article: "Charge Earth Orb"
  },


  "bones-to-peaches": {
    type: "spell", 
    spellbook: "standard",
    name: "Bones to Peaches",
    level: 61,
    members: false,
    runes: [
        { rune: "Water rune", amount: 2},
        { rune: "Earth rune", amount: 2},
        { rune: "Nature rune", amount: 1},
      
    ],
    description: 
    "turns any bones into Peaches",
    article: "Bones to Peaches"
  },
  

  "trollheim-teleport": {
    type: "spell",
    spellbook: "standard",
    name: "Trollheim Teleport",
    level: 62,
    members: false,
    runes: [

    ],
    description: 
    "able to teleport Trollheim. ",
    article: "Trollheim Teleport"
   },
   
   

   "wind-wave": {
    type: "spell",
    spellbook: "standard",
    name: "Wind Wave",
    level: 63,
    members: false,
    runes: [

    ],
    description:
    "",
    article: "Wind Wave"
  },


  
  "charge-Fire-orb": {
    type: "spell",
    spellbook: "standard",
    name: "Charge Fire Orb",
    level: 65,
    members: false,
    runes: [

    ],
    description:
    "It can only be used on the Obelisk of Fire.",
    article: "Charge Fire Orb"
  },

  "water-wave": {
    type: "spell",
    spellbook: "standard",
    name: "Water Wave",
    level: 66,
    members: false,
    runes: [

    ],
    description:
    "",
    article: "Water Wave"
  },

  "lvl-5-enchant": {
    type: "spell", 
    spellbook: "standard",
    name: "Lvl-5 Enchant",
    level: 68,
    members: false,
    runes: [
      
      
    ],
    description: 
    "",
    article: "Lvl-5 Enchant"
  },


  "earth-wave": {
    type: "spell",
    spellbook: "standard",
    name: "Earth Wave",
    level: 70,
    members: false,
    runes: [

    ],
    description:
    "",
    article: "Earth Wave"
  },


  "fire-wave": {
    type: "spell",
    spellbook: "standard",
    name: "Fire Wave",
    level: 73,
    members: false,
    runes: [

    ],
    description:
    "",
    article: "Fire Wave"
  },


  "lvl-6-enchant": {
    type: "spell", 
    spellbook: "standard",
    name: "Lvl-6 Enchant",
    level: 74,
    members: false,
    runes: [
      
      
    ],
    description: 
    "",
    article: "Lvl-6 Enchant"
  },

  "trident-of-the-seas": {
    type: "staff", 
    spellbook: "standard",
    name: "Trident of the seas",
    level: 75,
    members: false,
    runes: [
      
      
    ],
    description: 
    "",
    article: "Trident of the seas"
  },


  "charge": {
    type: "spell",
    spellbook: "standard",
    name: "Charge",
    level: 80,
    members: false,
    runes: [

    ],
    description:
    " When cast, the player becomes imbued with magical power, and for the next seven minutes (700 game ticks)",
    article: "Charge"
  },


  };
  
  const SPELLBOOK_FILTERS = [
    { id: "all", label: "All" },
    { id: "spell-books", label: "Spell books" },
    { id: "standard", label: "Standard spells" },
    { id: "ancient", label: "Ancient spells" },
    { id: "lunar", label: "Lunar spells" },
    { id: "arceuus", label: "Arceuus spells" }
  ];
  