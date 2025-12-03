import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
// import { getPageExtract } from "../api/runescape";

async function getPageExtract(title) {
    const url = `https://oldschool.runescape.wiki/api.php?action=query
      &prop=extracts|pageimages|images|info
      &piprop=thumbnail&pithumbsize=350
      &inprop=url
      &exintro&explaintext
      &titles=${encodeURIComponent(title)}
      &format=json&origin=*`.replace(/\s+/g, "");
  
    const res = await fetch(url);
    const data = await res.json();
  
    const pages = data?.query?.pages;
    if (!pages) return null;
  
    const pageId = Object.keys(pages)[0];
    return pages[pageId];
  }

  async function getFullImageGallery(title) {
    const url = `https://oldschool.runescape.wiki/api.php?action=parse
        &page=${encodeURIComponent(title)}
        &prop=images
        &format=json&origin=*`.replace(/\s+/g, "");
  
    const res = await fetch(url);
    const data = await res.json();
  
    const images = data?.parse?.images;
    if (!images || images.length === 0) return [];
  
    // Fetch thumbnails for each image
    const titles = images.map(img => `File:${img}`).join("|");
  
    const imgUrl = `https://oldschool.runescape.wiki/api.php?action=query
        &titles=${encodeURIComponent(titles)}
        &prop=pageimages
        &piprop=thumbnail&pithumbsize=300
        &format=json&origin=*`.replace(/\s+/g, "");
  
    const res2 = await fetch(imgUrl);
    const data2 = await res2.json();
  
    if (!data2?.query?.pages) return [];

    return Object.values(data2.query.pages).filter(
        img => img.thumbnail?.source
      );
    }

    

export default function ArticleView() {
  const { title } = useParams();
  const decodedTitle = decodeURIComponent(title);

  const [page, setPage] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);

      try {
        const p = await getPageExtract(decodedTitle);
        setPage(p);

        const galleryData = await getFullImageGallery(decodedTitle);
        setGallery(galleryData);
      } catch (e) {
        setError(e.message || "Failed to load page");
      }

      setLoading(false);
    }

    load();
  }, [decodedTitle]);

  if (loading) return <p>Loading article…</p>;
  if (error)
    return (
      <div>
        <p className="error">{error}</p>
        <Link to="/">Back to search</Link>
      </div>
    );

  if (!page) return <p>Page not found</p>;

  return (
    <article className="article">
      <h2>{page.title}</h2>

      {page.thumbnail?.source && (
        <img
          src={page.thumbnail.source}
          alt={page.title}
          className="article-image"
        />
      )}

      {gallery.length > 0 && (
        <div className="gallery">
          <h3>Full Image Gallery</h3>
          <div className="gallery-grid">
            {gallery.map((img) => (
              <div key={img.pageid} className="gallery-item">
                <img
                  src={img.thumbnail.source}
                  alt={img.title}
                  className="gallery-thumb"
                />
                <p>{img.title?.replace("File:", "")}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {page.extract ? (
        <section className="extract">
          <p>{page.extract}</p>
        </section>
      ) : (
        <p>No extract available.</p>
      )}

      <p>
        <a
          href={
            page.fullurl ||
            `https://oldschool.runescape.wiki/w/${encodeURIComponent(page.title)}`
          }
          target="_blank"
          rel="noreferrer"
        >
          Open on Old School RuneScape Wiki
        </a>
      </p>

      <p>
        <Link to="/">← Back to search</Link>
      </p>
    </article>
  );
}