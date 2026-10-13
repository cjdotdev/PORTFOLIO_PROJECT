import { useEffect, useState } from "react";
import { PERSONAL } from "../data";

type Contribution = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

const GREEN = ["var(--heat-empty)", "#0e4429", "#006d32", "#26a641", "#39d353"];

export default function GitHubSection() {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      `https://github-contributions-api.jogruber.de/v4/${PERSONAL.githubUsername}?y=2026`
    )
      .then((r) => r.json())
      .then((data) => {
        setContributions(data.contributions);
        setTotal(data.total["2026"] ?? 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Group into weeks (columns of 7 days)
  const weeks: Contribution[][] = [];
  for (let i = 0; i < contributions.length; i += 7) {
    weeks.push(contributions.slice(i, i + 7));
  }

  return (
    <section
      id="github"
      className="py-12 reveal"
      style={{ borderTop: "1px solid rgba(217,119,87,0.30)" }}
    >
      <h2 className="font-serif text-3xl mb-2">GitHub Activity</h2>
      
      {/* Real stat cards */}
      

      {/* Real contribution heatmap — green only */}
      {loading ? (
        <p className="text-xs text-muted">Loading contributions...</p>
      ) : (
        <>
          <p className="text-xs text-muted mb-3">
            <span className="text-ink font-medium">{total}</span>{" "}
            contributions in 2026
          </p>
          <div className="flex gap-[3px] overflow-x-auto pb-2">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {week.map((day) => (
                  <div
                    key={day.date}
                    title={`${day.date}: ${day.count} contributions`}
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 2,
                      flexShrink: 0,
                      background: GREEN[day.level],
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}