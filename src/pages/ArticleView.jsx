import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
// import { getPageExtract } from "../api/runescape";

async function getPageExtract(title) {
    const url = `https://oldschool.runescape.wiki/api.php?action=query&prop=extracts|info|pageimages&piprop=thumbnail&pithumbsize=400&inprop=url&exintro&explaintext&titles=${encodeURIComponent(
      title
    )}&format=json&origin=*`;
  
    const res = await fetch(url);
    const data = await res.json();
  
    const pages = data?.query?.pages;
    if (!pages) return null;
  
    const pageId = Object.keys(pages)[0];
    return pages[pageId];
  }

export default function ArticleView() {
  const { title } = useParams();
  const decodedTitle = decodeURIComponent(title);
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getPageExtract(decodedTitle)
      .then((p) => {
        setPage(p);
      })
      .catch((e) => setError(e.message || "Failed to load page"))
      .finally(() => setLoading(false));
  }, [decodedTitle]);

  if (loading) return <p>Loading article…</p>;
  if (error) return (
    <div>
      <p className="error">{error}</p>
      <Link to="/">Back to search</Link>
    </div>
  );
  if (!page) return <p>Page not found</p>;

  // page.fullurl contains full URL if the API returned inprop=url
  return (
    <article className="article">
      <h2>{page.title}</h2>

      {page.extract ? (
        <section className="extract">
          <p>{page.extract}</p>
        </section>
      ) : (
        <p>No extract available.</p>
      )}

      <p>
        <a href={page.fullurl || `https://oldschool.runescape.wiki/w/${encodeURIComponent(page.title)}`} target="_blank" rel="noreferrer">
          Open on old school RuneScape Wiki
        </a>
      </p>

      <p>
        <Link to="/">← Back to search</Link>
      </p>
    </article>
  );
}