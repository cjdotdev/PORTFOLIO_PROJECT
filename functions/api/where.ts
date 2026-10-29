/**
 * GET /api/where: where Joel is right now, at city level only, with the weather outside.
 *
 * A Cloudflare Pages Function, deployed with the site by `wrangler pages deploy` (see
 * .github/workflows/deploy.yml). Move by changing the Pages project's environment variables, no code
 * change needed: WHERE_CITY, WHERE_COUNTRY, WHERE_TIMEZONE, WHERE_FROM, WHERE_LAT and WHERE_LON.
 * The coordinates are the city centre (two decimals are kept), never anything finer.
 * The defaults match LOCATION in src/data/index.ts, the page's fallback.
 * Weather: Open-Meteo (free, no key), cached 10 minutes at the edge; the answer still comes without it.
 */
interface Env {
  WHERE_CITY?: string;
  WHERE_COUNTRY?: string;
  WHERE_TIMEZONE?: string;
  WHERE_FROM?: string;
  WHERE_LAT?: string;
  WHERE_LON?: string;
}

interface Weather {
  temperature_c: number;
  weather_code: number;
  is_day: boolean;
}

async function weatherAt(lat: number, lon: number): Promise<Weather | null> {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    "&current=temperature_2m,weather_code,is_day&timezone=auto";
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(2500),
      // Cloudflare edge cache: one upstream call per 10 minutes per location.
      cf: { cacheTtl: 600, cacheEverything: true },
    } as RequestInit);
    if (!response.ok) return null;
    const data = (await response.json()) as {
      current?: { temperature_2m?: number; weather_code?: number; is_day?: number };
    };
    const current = data.current;
    if (!current || typeof current.temperature_2m !== "number") return null;
    return {
      temperature_c: Math.round(current.temperature_2m),
      weather_code: current.weather_code ?? 0,
      is_day: current.is_day === 1,
    };
  } catch {
    return null;
  }
}

export const onRequestGet = async ({ env }: { env: Env }): Promise<Response> => {
  const timezone = env.WHERE_TIMEZONE || "Africa/Porto-Novo";
  const round = (value: number) => Math.round(value * 100) / 100;
  const lat = round(Number(env.WHERE_LAT || 6.3654));
  const lon = round(Number(env.WHERE_LON || 2.4183));

  let localTime = "";
  try {
    localTime = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: timezone }).format(
      new Date(),
    );
  } catch {
    // unknown timezone: leave the time out rather than fail the whole answer
  }

  const body = {
    city: env.WHERE_CITY || "Cotonou",
    country: env.WHERE_COUNTRY || "Benin",
    from: env.WHERE_FROM || "Gabon",
    timezone,
    local_time: localTime,
    coordinates: { lat, lon },
    weather: await weatherAt(lat, lon),
  };

  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "access-control-allow-origin": "*",
    },
  });
};
