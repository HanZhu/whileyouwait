import React, { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

function EqRender({ tex, displayMode = false }) {
    const containerRef = useRef();

    useEffect(() => {
        if (containerRef.current) {
            try {
                katex.render(tex, containerRef.current, {
                    throwOnError: false,
                    displayMode: displayMode,
                    trust: true,
                    strict: false
                });
            } catch (err) {
                console.error("KaTeX Error:", err);
                containerRef.current.textContent = tex;
            }
        }
    }, [tex, displayMode]);

    return <span ref={containerRef} className={displayMode ? "katex-display-block" : "katex-inline"} />;
}

export default EqRender;
