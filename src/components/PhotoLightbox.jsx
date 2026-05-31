import { useEffect } from "react";
import "./PhotoLightbox.css";

function PhotoLightbox({ photos, index, onClose, onChange }) {
  const photo = photos[index];

  useEffect(() => {
    if (index < 0) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onChange(index - 1);
      if (event.key === "ArrowRight") onChange(index + 1);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [index, onClose, onChange]);

  if (index < 0 || !photo) return null;

  const hasPrev = index > 0;
  const hasNext = index < photos.length - 1;

  return (
    <div className="photo-lightbox-wrap" role="presentation">
      <button type="button" className="photo-lightbox-backdrop" aria-label="Close photo viewer" onClick={onClose} />
      <div className="photo-lightbox-panel" role="dialog" aria-modal="true" aria-label="Gym photo viewer">
        <header className="photo-lightbox-head">
          <span className="photo-lightbox-counter">
            {index + 1} / {photos.length}
          </span>
          <button type="button" className="photo-lightbox-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </header>
        <div className="photo-lightbox-stage">
          {hasPrev ? (
            <button type="button" className="photo-lightbox-nav photo-lightbox-nav--prev" onClick={() => onChange(index - 1)} aria-label="Previous photo">
              ‹
            </button>
          ) : null}
          <img className="photo-lightbox-img" src={photo.src} alt={photo.caption || `Gym photo ${index + 1}`} />
          {hasNext ? (
            <button type="button" className="photo-lightbox-nav photo-lightbox-nav--next" onClick={() => onChange(index + 1)} aria-label="Next photo">
              ›
            </button>
          ) : null}
        </div>
        {photo.caption ? <p className="photo-lightbox-caption">{photo.caption}</p> : null}
      </div>
    </div>
  );
}

export default PhotoLightbox;
