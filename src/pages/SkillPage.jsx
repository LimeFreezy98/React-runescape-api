import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function SkillPage() {
  const [freeSkills, setFreeSkills] = useState([]);
  const [memberSkills, setMemberSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");

      const url =
        "https://oldschool.runescape.wiki/api.php" +
        "?action=parse" +
        "&page=Skills" +
        "&prop=text" +
        "&format=json" +
        "&origin=*";

      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to load skills");

        const data = await res.json();
        const html = data?.parse?.text?.["*"];
        if (!html) throw new Error("No HTML returned");

        const doc = new DOMParser().parseFromString(html, "text/html");

        // There are exactly 2 skill tables
        const tables = doc.querySelectorAll("table.wikitable");
        const freeTable = tables[0];
        const memberTable = tables[1];

        const extractSkills = (table) => {
          if (!table) return [];

          const skills = [];
          table.querySelectorAll("tr").forEach((row) => {
            const link = row.querySelector("td a[title]");
            const name = link?.getAttribute("title");
            if (name) skills.push(name);
          });

          return skills;
        };

        setFreeSkills(extractSkills(freeTable));
        setMemberSkills(extractSkills(memberTable));
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return <p>Loading skills…</p>;
  if (error) return <p style={{ color: "crimson" }}>Error: {error}</p>;

  return (
    <div className="skills-page">
      <h1>OSRS Skills</h1>

      <section>
        <h2>Free-to-play Skills</h2>
        <ul>
          {freeSkills.map((skill, i) => (
            <li key={i}>
              <Link to={`/article/${encodeURIComponent(skill)}`}>
                {skill}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Members Skills</h2>
        <ul>
          {memberSkills.map((skill, i) => (
            <li key={i}>
              <Link to={`/article/${encodeURIComponent(skill)}`}>
                {skill}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <p><Link to="/">← Back</Link></p>
    </div>
  );
}