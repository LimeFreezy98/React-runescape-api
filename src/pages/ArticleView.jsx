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

// filter image
const imageFiles = images.filter(name => {

const lower = name.toLowerCase();
return (
lower.endsWith(".png") ||
lower.endsWith(".jpg") ||
lower.endsWith(".jpeg") ||
lower.endsWith(".gif")  //  optional: ||
//  optional: lower.endsWith(".webp")
);
});

  

   // LIMIT IMAGES (after filtering)
   const limitedImages = imageFiles.slice(0, 40);

   if (limitedImages.length === 0) return [];
 
   const titles = limitedImages.map(img => `File:${img}`).join("|");
 
   const imgUrl = `https://oldschool.runescape.wiki/api.php?action=query
         &titles=${encodeURIComponent(titles)}
         &prop=pageimages
         &piprop=thumbnail&pithumbsize=250
         &format=json&origin=*`.replace(/\s+/g, "");
 
   const res2 = await fetch(imgUrl);
   const data2 = await res2.json();
 
   if (!data2?.query?.pages) return [];
 
   return Object.values(data2.query.pages).filter(
     img =>
       img.thumbnail?.source &&
       img.thumbnail.width <= 350 &&
       img.thumbnail.height <= 350
   );
 }



//infobox data

async function getInfoboxHTML(title) {
  const url = `https://oldschool.runescape.wiki/api.php?action=parse
      &page=${encodeURIComponent(title)}
      &prop=text
      &format=json&origin=*`.replace(/\s+/g, "");

  const res = await fetch(url);
  const data = await res.json();

  return data?.parse?.text?.["*"] || "";
}



//infobox variants

// coins: 


// pie and pizza: full and 1/2


// cake: full, 2/3 and 1/3


async function getAudioUrl(filename) {
  const url = `https://oldschool.runescape.wiki/api.php?action=query
      &titles=${encodeURIComponent("File:" + filename)}
      &prop=imageinfo
      &iiprop=url
      &format=json&origin=*`.replace(/\s+/g, "");

  const res = await fetch(url);
  const data = await res.json();

  const page = Object.values(data.query.pages)[0];
  return page?.imageinfo?.[0]?.url || null;
}







export default function ArticleView() {
  const { title } = useParams();
  const decodedTitle = decodeURIComponent(title);

  const [page, setPage] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [infobox, setInfobox] = useState({});
  const [loading, setLoading] = useState(true);
  const [sounds, setSounds] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);

      try {
        // MAIN PAGE DATA
        const p = await getPageExtract(decodedTitle);
        setPage(p);

        // GALLERY
        const galleryData = await getFullImageGallery(decodedTitle);
        setGallery(galleryData);

        // INFOBOX HTML
        const html = await getInfoboxHTML(decodedTitle);

        const doc = new DOMParser().parseFromString(html, "text/html");
        const rows = doc.querySelectorAll(".infobox tr");


        // AUDIO (.ogg files)
        const parseRes = await fetch(
          `https://oldschool.runescape.wiki/api.php?action=parse
          &page=${encodeURIComponent(decodedTitle)}
          &prop=images
          &format=json&origin=*`.replace(/\s+/g, "")
        );

        const parseJson = await parseRes.json();
        const allImages = parseJson?.parse?.images || [];

        // Only .ogg files
        const oggFiles = allImages
          .filter(name => name.toLowerCase().endsWith(".ogg"))
          .slice(0, 15); // limit for safety

        const audioData = [];

        for (const file of oggFiles) {
          const url = await getAudioUrl(file);
          if (url) {
            audioData.push({
              title: file.replace(".ogg", ""),
              url
            });
          }
        }

        setSounds(audioData);

        const data = {};

        rows.forEach(row => {
          const label = row.querySelector("th")?.textContent?.trim().toLowerCase();
          const value = row.querySelector("td")?.textContent?.trim();

          if (!label || !value) return;

          if (label.includes("level")) data.level = value;


          if (label.includes("runes")) {
            const parts = [];

            const imgs = row.querySelectorAll("img");
            const text = row.querySelector("td").textContent;

            imgs.forEach((img, i) => {
              const name = img.alt || img.title || "Rune";
              const amountMatch = text.match(/\d+/g);
              const amount = amountMatch?.[i] || "?";

              parts.push(`${amount} ${name}`);
            });

            data.runes = parts.join(", ");
          }






          if (label.includes("members")) data.members = value;
          if (label.includes("spellbook")) data.spellbook = value;
        });

        setInfobox(data);




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

      {/* INFOBOX DATA */}
      <div className="infobox-data">
        {infobox.spellbook && (
          <p><strong>Spellbook:</strong> {infobox.spellbook}</p>
        )}

        {infobox.level && (
          <p><strong>Level required:</strong> {infobox.level}</p>
        )}

        {infobox.members && (
          <p><strong>Members:</strong> {infobox.members}</p>
        )}

        {infobox.runes && (
          <p><strong>Runes:</strong> {infobox.runes}</p>
        )}
      </div>

      {/* INTRO TEXT */}
      {page.extract && (
        <section className="extract">
          <p>{page.extract}</p>
        </section>
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


      {sounds.length > 0 && (
        <div className="audio-section">
          <h3>Sound Effects</h3>
          {sounds.map((sound, index) => (
            <div key={index} className="audio-item">
              <p>{sound.title}</p>
              <audio controls>
                <source src={sound.url} type="audio/ogg" />
                Your browser does not support audio.
              </audio>
            </div>
          ))}
        </div>
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