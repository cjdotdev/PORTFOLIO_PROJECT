import { useEffect, useState } from "react";

export default function PageLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center transition-opacity duration-500 bg-bg"
    >
      {/* From Uiverse.io by JeremGamingYT - Modified to spell CJ (Bold Version) */}
      <div className="loader" role="status" aria-label="Loading">
        {/* First Letter: 'C' (Bold) */}
        <svg viewBox="0 0 44 54" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path
            pathLength="360"
            d="M34 12 Q24 4 14 10 Q4 17 4 27 Q4 37 14 44 Q24 50 34 42"
            className="dash"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Second Letter: 'J' (Bold) */}
        <svg viewBox="0 0 44 54" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path
            pathLength="360"
            d="M10 6 L34 6 M24 6 L24 36 Q24 46 15 46 Q6 46 5 36"
            className="dash"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {/* <div className="loadingspinner">
        <div id="square1" />
        <div id="square2" />
        <div id="square3" />
        <div id="square4" />
        <div id="square5" />
      </div> */}
    </div>
  );
}