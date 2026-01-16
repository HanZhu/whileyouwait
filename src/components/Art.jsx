import React, { useState, useEffect } from 'react';
import './Art.css';

function Art() {
    const [artwork, setArtwork] = useState(null);
    const [loading, setLoading] = useState(true);
    const [imgLoading, setImgLoading] = useState(false);

    const fetchArt = async () => {
        setLoading(true);
        // We don't null artwork immediately to prevent the layout from collapsing
        // but it will be handled by the imgLoading state
        try {
            const randomPage = Math.floor(Math.random() * 400) + 1;
            const response = await fetch(`https://api.artic.edu/api/v1/artworks?limit=25&page=${randomPage}&fields=id,title,artist_display,date_display,medium_display,image_id,description,short_description`);
            const data = await response.json();

            if (data && data.data && data.data.length > 0) {
                const qualityWorks = data.data.filter(art =>
                    art.image_id && (art.description || art.short_description)
                );

                if (qualityWorks.length > 0) {
                    const selected = qualityWorks[Math.floor(Math.random() * qualityWorks.length)];
                    setArtwork(selected);
                    setImgLoading(true); // Trigger image load state
                } else {
                    const backup = data.data.find(art => art.image_id);
                    if (backup) {
                        setArtwork(backup);
                        setImgLoading(true);
                    } else {
                        fetchArt();
                    }
                }
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArt();
    }, []);

    const getImageUrl = (imageId) => {
        return `https://www.artic.edu/iiif/2/${imageId}/full/843,/0/default.jpg`;
    };

    const sanitizeDescription = (art) => {
        const text = art.description || art.short_description;
        if (!text) return "This masterpiece speaks for itself (no written description found in the archive).";
        return text.replace(/<[^>]*>?/gm, '');
    };

    return (
        <div className="original-layout fade-in">
            <div className="main-content">
                <header className="page-header-cute" style={{ textAlign: 'left' }}>
                    <h2 className="h1-cute">Art Break</h2>
                    <p className="p-cute" style={{ margin: '0', fontSize: '1rem' }}>
                        A little culture for your wait. Famous works from around the world.
                    </p>
                </header>

                {loading && !artwork && <div className="status-cute">Opening the gallery...</div>}

                {artwork && (
                    <div className="art-original-display" style={{ opacity: loading ? 0.5 : 1 }}>
                        <div className="art-canvas-frame">
                            {imgLoading && (
                                <div className="art-placeholder-cute">
                                    <div className="placeholder-pulsar"></div>
                                    <span className="loading-text-elegant">📜 Fetching masterpiece...</span>
                                </div>
                            )}
                            <img
                                key={artwork.id}
                                src={getImageUrl(artwork.image_id)}
                                alt={artwork.title}
                                className={`artwork-image-original ${imgLoading ? 'hidden' : 'visible'}`}
                                onLoad={() => setImgLoading(false)}
                            />
                        </div>

                        <div className={`art-caption-original ${imgLoading ? 'blurred' : ''}`}>
                            <h3 className="art-title-cute">{artwork.title}</h3>
                            <p className="art-artist-cute">{artwork.artist_display}</p>
                            <p className="art-meta-cute">{artwork.date_display} • {artwork.medium_display}</p>

                            <div className="art-description-cute" style={{ marginTop: '15px', fontSize: '0.9rem', lineHeight: '1.4', opacity: 0.8, maxHeight: '100px', overflowY: 'auto' }}>
                                {sanitizeDescription(artwork)}
                            </div>

                            <button onClick={fetchArt} className="btn-primary-cute" style={{ marginTop: '20px' }}>
                                Show Me Another
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <aside className="original-sidebar">
                <div className="portrait-frame">
                    <img src="/Assets/Cat_Art.png" alt="Art Mascot" className="sidebar-mascot" />
                </div>
                <div className="sidebar-stats">
                    <span className="label-cinch">GALLERY CAT</span>
                    <p>Curating the archive.</p>
                </div>
            </aside>
        </div>
    );
}

export default Art;
