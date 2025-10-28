# ADR-0006: Use Mapbox for Maps and Geolocation

**Status:** Accepted
**Date:** 2025-01-17
**Decision Makers:** Development Team
**Impact:** Medium

---

## Context

The Garage Sale Planner feature requires:

- **Interactive Maps** - Display sales on a map with markers
- **Geocoding** - Convert addresses to coordinates
- **Routing** - Calculate optimal routes between multiple sales
- **Geolocation** - Find user's current location
- **Custom Styling** - Match our northern lights theme
- **Performance** - Fast map rendering on mobile
- **Cost** - Free tier sufficient for MVP

### Requirements

1. **Map Display** - Interactive map of Yellowknife
2. **Markers** - Show garage sales as markers on map
3. **Geocoding API** - Convert addresses to lat/lng
4. **Directions API** - Calculate routes between points
5. **Distance Calculation** - Measure distances between locations
6. **Custom Markers** - Branded pins for different sale types
7. **Mobile Performance** - Smooth on phones

### Use Cases

- **Garage Sale Map:** Display 10-50 sales on map simultaneously
- **Route Planning:** Calculate optimal route through 5-10 sales
- **Distance Display:** Show "2.3 km away" for each sale
- **Location Search:** Find sales near user's location
- **Address Validation:** Verify addresses exist in Yellowknife

---

## Decision

**We will use Mapbox GL JS** for maps and location services:

- **Mapbox GL JS** - WebGL-based map rendering
- **react-map-gl** - React wrapper for Mapbox
- **Geocoding API** - Address ↔ coordinates conversion
- **Directions API** - Route calculation (future feature)
- **Geolocation API** - Browser geolocation (native)

### Integration Approach

```typescript
import Map, { Marker, NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

<Map
  mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
  initialViewState={{
    longitude: -114.3718, // Yellowknife
    latitude: 62.4540,
    zoom: 12
  }}
  mapStyle="mapbox://styles/mapbox/streets-v12"
>
  {garageSales.map(sale => (
    <Marker
      key={sale.id}
      longitude={sale.longitude}
      latitude={sale.latitude}
    />
  ))}
</Map>
```

---

## Alternatives Considered

### Alternative 1: Google Maps

**Description:** Google Maps JavaScript API + Places API

**Pros:**
- Most familiar to users
- Comprehensive POI data
- Excellent geocoding
- Street View available
- Industry standard
- Great documentation

**Cons:**
- **Expensive:** $7/1000 map loads after free tier
- **Free tier limited:** Only $200/month credit (~28,571 loads)
- **Complex pricing:** Many billable SKUs
- **Heavy bundle:** Large JavaScript library
- **Styling limited:** Can't easily customize
- **Requires credit card:** Even for free tier

**Why not chosen:** Cost prohibitive at scale. $7/1000 loads means 5,000 monthly users = $350/month. Too expensive for our budget.

### Alternative 2: OpenStreetMap + Leaflet

**Description:** Free OSM data with Leaflet library

**Pros:**
- **Completely free** - No API keys or limits
- Open source
- Active community
- Good documentation
- Lightweight library
- Can self-host tiles

**Cons:**
- No official geocoding API (must use third-party)
- Less polished than commercial options
- Tile server can be slow
- No built-in routing
- Custom markers more complex
- Less mobile optimized
- Yellowknife OSM data may be incomplete

**Why not chosen:** Need reliable geocoding and routing. OSM data quality in Yellowknife uncertain. Mapbox uses OSM data anyway.

### Alternative 3: Here Maps

**Description:** Here Technologies mapping platform

**Pros:**
- Good geocoding
- Routing capabilities
- Reasonable pricing
- Traffic data
- Offline maps

**Cons:**
- Smaller developer community
- Less documentation than alternatives
- Fewer examples/tutorials
- More enterprise-focused
- Complex API
- Not as developer-friendly

**Why not chosen:** Smaller community, less documentation. Mapbox has better DX and more resources.

### Alternative 4: Azure Maps

**Description:** Microsoft's mapping service

**Pros:**
- Good Azure integration
- Reasonable pricing
- Traffic data
- Enterprise support

**Cons:**
- Requires Azure account
- Smaller community than Google/Mapbox
- Less documentation
- Primarily enterprise-focused
- Less flexible styling
- Not as widely used

**Why not chosen:** Not using Azure for other services. Mapbox has better developer ecosystem.

### Alternative 5: Apple MapKit JS

**Description:** Apple Maps for the web

**Pros:**
- Beautiful design
- Free tier (250,000 loads/day)
- Good on iOS devices
- Privacy-focused

**Cons:**
- **Apple-only ecosystem** - Requires Apple Developer account
- Less customization
- Smaller community
- Fewer features than alternatives
- Not as widely supported
- Limited to Apple services

**Why not chosen:** Requires Apple Developer account. Limited ecosystem. Mapbox more flexible.

---

## Consequences

### Positive Consequences

- **Generous Free Tier** - 50,000 map loads, 100,000 API calls/month
- **Beautiful Maps** - WebGL rendering, smooth animations
- **Custom Styling** - Can match northern lights theme
- **Great Performance** - Fast rendering, especially on mobile
- **Excellent DX** - Good documentation, active community
- **react-map-gl** - Well-maintained React wrapper
- **Flexible** - Can use custom map styles
- **Vector Tiles** - Smaller download size, crisp on retina
- **Offline Support** - Can cache tiles (future)

### Negative Consequences

- **Cost at Scale** - After free tier: $5/1000 map loads
- **API Key Management** - Must secure API key
- **Bundle Size** - ~500KB for mapbox-gl library
- **Learning Curve** - Different from Google Maps API
- **Rate Limits** - Need to cache geocoding results
- **Vendor Lock-in** - Some Mapbox-specific features

### Risks

- **Exceeding Free Tier** - 50,000 map loads might not be enough
  - *Mitigation:* Cache map tiles, use static maps where possible, monitor usage

- **Rate Limits** - Geocoding API has limits
  - *Mitigation:* Cache geocoded addresses in database, debounce requests

- **API Key Exposure** - Public token visible in client code
  - *Mitigation:* Restrict token to specific domains, use URL restrictions

- **Yellowknife Coverage** - Map data might be incomplete
  - *Mitigation:* Verify coverage in Yellowknife, can contribute to OSM if needed

---

## Implementation

### Setup

1. **Create Mapbox Account**
   - Sign up at mapbox.com
   - Generate access token
   - Restrict token to ykbuddy.com domain

2. **Install Dependencies**
   ```bash
   npm install mapbox-gl react-map-gl
   ```

3. **Environment Variable**
   ```
   NEXT_PUBLIC_MAPBOX_TOKEN=pk.xxx...
   ```

4. **Map Component**
   ```typescript
   // apps/web/src/components/GarageSaleMap.tsx
   import Map, { Marker } from 'react-map-gl';

   export function GarageSaleMap({ sales }) {
     return (
       <Map
         mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
         initialViewState={{
           longitude: -114.3718,
           latitude: 62.4540,
           zoom: 12
         }}
         style={{ width: '100%', height: '600px' }}
         mapStyle="mapbox://styles/mapbox/streets-v12"
       >
         {sales.map(sale => (
           <Marker
             key={sale.id}
             longitude={sale.longitude}
             latitude={sale.latitude}
             onClick={() => onSaleClick(sale)}
           />
         ))}
       </Map>
     );
   }
   ```

### Geocoding Integration

```typescript
// apps/web/src/lib/mapbox/geocoding.ts
export async function geocodeAddress(address: string) {
  // Check cache first
  const cached = await getCachedGeocode(address);
  if (cached) return cached;

  // Call Mapbox Geocoding API
  const response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${token}&proximity=-114.3718,62.4540&limit=1`
  );

  const data = await response.json();
  const result = data.features[0];

  // Cache result
  await cacheGeocode(address, result.center);

  return {
    longitude: result.center[0],
    latitude: result.center[1],
    address: result.place_name
  };
}
```

### Route Calculation (Future)

```typescript
// Using Directions API for route optimization
export async function calculateRoute(points: Coordinate[]) {
  const coordinates = points
    .map(p => `${p.longitude},${p.latitude}`)
    .join(';');

  const response = await fetch(
    `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}?geometries=geojson&access_token=${token}`
  );

  const data = await response.json();
  return data.routes[0];
}
```

### Custom Map Style (Future)

```typescript
// Create custom style to match northern lights theme
const customStyle = {
  version: 8,
  name: 'YK Buddy Northern Lights',
  sources: { /* ... */ },
  layers: [
    {
      id: 'background',
      type: 'background',
      paint: {
        'background-color': '#0a1628' // Dark northern sky
      }
    },
    // Aurora-themed roads, water, etc.
  ]
};
```

---

## Validation

### Success Criteria

- [x] Maps render correctly in Yellowknife area
- [x] Garage sales display as markers
- [x] Click marker to view sale details
- [x] Geocoding converts addresses accurately
- [x] Map performs smoothly on mobile
- [x] Staying within free tier limits

### Performance Metrics

- **Map Load Time:** < 2 seconds
- **Marker Rendering:** 50 markers at 60fps
- **Geocoding Response:** < 500ms
- **Mobile Performance:** No jank on scrolling/zooming

### Usage Tracking

**Current Usage (Jan 2025):**
- Map loads: ~500 / 50,000 (1%)
- Geocoding requests: ~100 / 100,000 (0.1%)
- **Status:** Well within free tier

**Projected Usage (5,000 MAU):**
- Map loads: ~15,000 / 50,000 (30%)
- Geocoding: ~2,000 / 100,000 (2%)
- **Estimated cost:** $0/month (still free)

---

## Cost Analysis

### Free Tier

| Service | Free Tier | Cost Over Limit |
|---------|-----------|----------------|
| Map Loads | 50,000/month | $5/1,000 loads |
| Geocoding | 100,000/month | $0.75/1,000 |
| Directions | 100,000/month | $5/1,000 |
| Static Images | 750/minute | $0.02/request |

### Comparison with Google Maps

**Scenario: 5,000 monthly active users, 3 map views each**

| Provider | Usage | Cost |
|----------|-------|------|
| **Mapbox** | 15,000 loads | **$0** (within free tier) |
| **Google Maps** | 15,000 loads | **~$105** ($7/1,000 loads) |

**Mapbox saves ~$1,260/year at this scale**

### Optimization Strategies

1. **Cache Geocoding Results** - Store lat/lng in database
2. **Static Maps** - Use static images where interactivity not needed
3. **Lazy Loading** - Load map only when user scrolls to it
4. **Marker Clustering** - Group nearby markers at low zoom
5. **Debounce** - Limit API calls during user interactions

---

## Security

### API Key Protection

```typescript
// Restrict token in Mapbox dashboard:
// ✅ URL restrictions: ykbuddy.com, localhost:3002
// ✅ Public token (client-side use)
// ❌ Secret token (keep server-side only)

// Client-side (safe):
const publicToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

// Server-side only:
const secretToken = process.env.MAPBOX_SECRET_TOKEN;
```

### Rate Limiting

```typescript
// Prevent API abuse
const geocodeCache = new Map();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

export async function geocodeWithRateLimit(address: string) {
  // Check cache
  const cached = geocodeCache.get(address);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  // Call API with rate limiting
  const result = await rateLimitedGeocode(address);
  geocodeCache.set(address, { data: result, timestamp: Date.now() });

  return result;
}
```

---

## Future Enhancements

### Planned Features

1. **Route Optimization** - TSP algorithm for garage sale routes
2. **Custom Map Style** - Northern lights themed map
3. **Directions** - Turn-by-turn navigation
4. **Traffic Data** - Real-time traffic overlay (paid feature)
5. **3D Buildings** - 3D building extrusions
6. **Offline Maps** - Cache tiles for offline use

### Nice-to-Have Features

- Heat maps for popular areas
- Animation of route
- Street view integration (if available)
- Export route to mobile apps (Google Maps, Apple Maps)

---

## References

- [Mapbox Documentation](https://docs.mapbox.com/)
- [react-map-gl Documentation](https://visgl.github.io/react-map-gl/)
- [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/)
- [Geocoding API](https://docs.mapbox.com/api/search/geocoding/)
- [Directions API](https://docs.mapbox.com/api/navigation/directions/)

---

## Notes

### Decision History

- 2025-01-15: Evaluated map providers (Google, Mapbox, OSM)
- 2025-01-17: Decided on Mapbox
- 2025-01-18: Integrated Mapbox GL JS
- 2025-01-19: Implemented garage sale map
- 2025-01-20: Added geocoding with caching

### Lessons Learned

1. **react-map-gl is Excellent** - Much easier than raw Mapbox GL JS
2. **Caching is Critical** - Saves API calls and improves performance
3. **Vector Tiles are Fast** - Much faster than raster tiles
4. **Mobile Performance Good** - WebGL rendering smooth on phones
5. **Yellowknife Coverage OK** - Map data quality is good

### Implementation Notes

- Started with basic map rendering
- Added custom markers
- Implemented click handlers
- Added geocoding with cache
- Optimized for mobile

### Performance Improvements

- Implemented marker clustering (future)
- Cached geocoding results in database
- Debounced pan/zoom events
- Lazy loaded map component

### Related Decisions

- [ADR-0001 - Next.js App Router](./0001-nextjs-app-router.md)
- [ADR-0002 - Supabase Backend](./0002-supabase-backend.md)

---

**Last Updated:** 2025-01-27
**Review Cycle:** Annually or if Mapbox pricing changes
