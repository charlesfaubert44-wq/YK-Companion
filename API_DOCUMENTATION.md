# API Documentation

## Overview

YK Buddy API endpoints for health monitoring, metrics, and future integrations.

---

## Endpoints

### Health Check

#### GET `/api/health`

Returns the health status of the application.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-10-28T12:00:00.000Z",
  "uptime": 3600.123,
  "environment": "production",
  "version": "1.0.0",
  "checks": {
    "server": "ok",
    "database": "ok"
  }
}
```

**Status Codes:**
- `200` - Healthy
- `503` - Degraded or unhealthy

**Usage:**
```bash
curl https://ykbuddy.com/api/health
```

---

### Metrics

#### GET `/api/metrics`

Returns application metrics for monitoring.

**Response:**
```json
{
  "timestamp": "2025-10-28T12:00:00.000Z",
  "application": {
    "name": "yk-buddy-web",
    "version": "1.0.0",
    "environment": "production"
  },
  "system": {
    "uptime": 3600.123,
    "memory": {
      "rss": 123456789,
      "heapTotal": 98765432,
      "heapUsed": 87654321,
      "external": 1234567
    },
    "platform": "linux",
    "nodeVersion": "v18.17.0"
  },
  "custom": {}
}
```

**Usage:**
```bash
curl https://ykbuddy.com/api/metrics
```

---

## Supabase Edge Functions

### Garage Sales

#### GET `/garage-sales-get`

Get all garage sales.

**Query Parameters:**
- `upcoming` (boolean) - Only return upcoming sales
- `limit` (number) - Limit results (default: 100)

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Big Garage Sale",
    "description": "Lots of items",
    "address": "123 Main St, Yellowknife",
    "latitude": 62.4540,
    "longitude": -114.3718,
    "start_date": "2025-06-01T10:00:00Z",
    "end_date": "2025-06-01T16:00:00Z",
    "contact_info": "email@example.com",
    "created_at": "2025-05-01T12:00:00Z"
  }
]
```

---

#### POST `/garage-sales-create`

Create a new garage sale listing.

**Request Body:**
```json
{
  "title": "Big Garage Sale",
  "description": "Lots of items",
  "address": "123 Main St, Yellowknife",
  "start_date": "2025-06-01T10:00:00Z",
  "end_date": "2025-06-01T16:00:00Z",
  "contact_info": "email@example.com"
}
```

**Response:**
```json
{
  "id": "uuid",
  "message": "Garage sale created successfully"
}
```

---

#### PUT `/garage-sales-update`

Update an existing garage sale.

**Request Body:**
```json
{
  "id": "uuid",
  "title": "Updated Title",
  "description": "Updated description"
}
```

---

#### DELETE `/garage-sales-delete`

Delete a garage sale.

**Request Body:**
```json
{
  "id": "uuid"
}
```

---

### Aurora Features

#### GET `/aurora-forecasts-get`

Get current aurora forecasts.

**Response:**
```json
{
  "kp_index": 4,
  "forecast": "High",
  "visibility": "Good",
  "last_updated": "2025-10-28T12:00:00Z"
}
```

---

#### GET `/aurora-photos-feed`

Get aurora photo feed.

**Query Parameters:**
- `limit` (number) - Number of photos (default: 20)
- `offset` (number) - Pagination offset

---

#### POST `/aurora-photos-upload`

Upload aurora photo.

**Request Body:**
```json
{
  "image_url": "https://...",
  "caption": "Amazing aurora tonight!",
  "location": "Yellowknife"
}
```

---

### Email Subscriptions

#### POST `/email-digest-subscribe`

Subscribe to email digest.

**Request Body:**
```json
{
  "email": "user@example.com",
  "preferences": {
    "aurora_alerts": true,
    "garage_sales": true,
    "events": false
  }
}
```

---

#### POST `/email-digest-unsubscribe`

Unsubscribe from email digest.

**Request Body:**
```json
{
  "email": "user@example.com",
  "token": "unsubscribe-token"
}
```

---

## Authentication

All authenticated endpoints require a Bearer token:

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" https://ykbuddy.com/api/endpoint
```

Get token from Supabase auth:
```typescript
const { data: { session } } = await supabase.auth.getSession();
const token = session?.access_token;
```

---

## Rate Limits

### Client-Side Limits
- **Login**: 5 requests per 15 minutes
- **Signup**: 3 requests per hour
- **API calls**: 100 requests per minute
- **Search**: 30 requests per minute
- **Form submissions**: 3 requests per hour

### Server-Side Limits (Supabase)
- **Edge Functions**: 500,000 invocations/month (free tier)
- **Database**: 500 MB storage (free tier)
- **Auth**: 50,000 users (free tier)

---

## Error Handling

### Error Response Format

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": "Additional context"
    }
  },
  "timestamp": "2025-10-28T12:00:00Z"
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid input data |
| `UNAUTHORIZED` | 401 | Missing or invalid auth token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `RATE_LIMITED` | 429 | Too many requests |
| `SERVER_ERROR` | 500 | Internal server error |

---

## Webhooks (Future)

### Garage Sale Created

```json
POST https://your-webhook-url.com/garage-sale-created
{
  "event": "garage_sale.created",
  "timestamp": "2025-10-28T12:00:00Z",
  "data": {
    "id": "uuid",
    "title": "Big Garage Sale"
  }
}
```

---

## SDK (Future)

### JavaScript/TypeScript

```typescript
import { YKBuddyClient } from '@yk-buddy/sdk';

const client = new YKBuddyClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://ykbuddy.com',
});

// Get garage sales
const sales = await client.garageSales.list({ upcoming: true });

// Create garage sale
const newSale = await client.garageSales.create({
  title: 'My Garage Sale',
  address: '123 Main St',
});
```

---

## Monitoring

### Health Check Integration

**Uptime Robot:**
```
Monitor Type: HTTP(s)
URL: https://ykbuddy.com/api/health
Interval: 5 minutes
```

**Pingdom:**
```
Check Type: HTTP
URL: https://ykbuddy.com/api/health
Check Interval: 1 minute
```

---

## Testing

### Using cURL

```bash
# Health check
curl https://ykbuddy.com/api/health

# Get garage sales
curl https://ykbuddy.com/api/garage-sales-get

# Create garage sale (authenticated)
curl -X POST https://ykbuddy.com/api/garage-sales-create \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Sale","address":"123 Main St"}'
```

### Using Postman

Import collection: [Download Postman Collection](./postman_collection.json)

---

## Changelog

### v1.0.0 (Current)
- Initial API release
- Health check endpoint
- Metrics endpoint
- Garage sales CRUD
- Aurora forecasts
- Email subscriptions

---

## Support

- **Documentation**: https://ykbuddy.com/docs
- **Issues**: https://github.com/yourusername/yk-companion/issues
- **Email**: support@ykbuddy.com

---

**Last Updated**: October 2025


