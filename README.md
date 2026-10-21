# Weather Forecast

A full-viewport, dark matte-glass Angular weather dashboard powered by real-time [Open-Meteo](https://open-meteo.com/) telemetry. Search any city worldwide or use live GPS coordinates to view current conditions, hourly trends, a 7-day outlook, interactive live condition splines, and animated wind streamlines.

![Weather Forecast](src/assets/screenshots/site.png)

## Features

- **Full-Viewport Matte-Glass Dashboard** — Responsive `100dvh` 2-column layout with a vertical navigation rail, pure upper-atmosphere sky photography, and glassmorphic pill-knob segmented controls.
- **Dynamic Hero Banner** — Fluid viewport-adaptive temperature readout paired with bespoke animated SVG weather icons, a live telemetry strip (`Feels like`, `UV Index`, `Sunrise`/`Sunset`), and an editorial forecast summary.
- **Interactive Live Conditions Spline** — Smooth cubic-Bezier temperature/humidity curve with hover scrubbing, contextual status badges, and an expandable telemetry drawer.
- **Popular & Recently Searched Cities** — Segmented glassmorphic tab switcher that persists recent searches in `localStorage` (`weather_recent_cities_v1`) alongside live-hydrated popular global cities.
- **Animated Wind Map** — Real-time wind vector streamlines, Beaufort wind scale & 5-bar force meter, and a directional compass ring aligned with live meteorological bearings.
- **Instant Unit Switching (`°C` | `°F`)** — Seamless Celsius and Fahrenheit conversion across all cards, charts, and city lists.

## Stack

- **Angular 22.2.3** — Standalone components, Signal Forms, and zoneless change detection
- **[Open-Meteo](https://open-meteo.com/)** — Free geocoding + weather forecast APIs (no API keys required)
- **Tailwind CSS v4** — Custom matte-glass surfaces, CSS Grid accordions, and fluid typography

## Development

```bash
npm install
npm start
```

Open [http://localhost:4200](http://localhost:4200).

## Build

```bash
npm run build
```

Output is generated in `dist/weatherapp`.

## API Notes

| Step | Endpoint |
|------|----------|
| Geocode city | `https://geocoding-api.open-meteo.com/v1/search` |
| Forecast | `https://api.open-meteo.com/v1/forecast` |

Open-Meteo is free for non-commercial use; see their [terms](https://open-meteo.com/en/terms) for production traffic limits.

## Author

Built with care by [Wayne Gakuo](https://github.com/waynegakuo).
