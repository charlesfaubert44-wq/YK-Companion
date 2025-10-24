# API Endpoints

Base URL: `http://localhost:3001/api/v1`

## Authentication

### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe"
    },
    "token": "jwt-token"
  }
}
```

### POST /auth/login
Login with existing credentials.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "jwt-token"
  }
}
```

## Activities

### GET /activities
Get all activities with optional filtering.

**Query Parameters:**
- `category` - Filter by category (aurora, adventure, culture, etc.)
- `season` - Filter by season (winter, spring, summer, fall)
- `difficulty` - Filter by difficulty level
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

**Response:**
```json
{
  "success": true,
  "data": {
    "activities": [...],
    "total": 50,
    "page": 1,
    "pageSize": 20,
    "totalPages": 3
  }
}
```

### GET /activities/:id
Get a single activity by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Aurora Viewing Tour",
    "description": "...",
    "category": "aurora",
    "seasons": ["winter", "fall"],
    "difficulty": "easy",
    "duration": 180,
    "price": 150.00,
    "location": {
      "latitude": 62.4540,
      "longitude": -114.3718,
      "address": "..."
    },
    "images": [...],
    "rating": 4.8,
    "reviewCount": 127
  }
}
```

### GET /activities/:id/reviews
Get reviews for a specific activity.

**Query Parameters:**
- `page` - Page number
- `limit` - Items per page

## Accommodations

### GET /accommodations
Get all accommodations with optional filtering.

**Query Parameters:**
- `type` - Filter by type (hotel, lodge, bnb, cabin, camping)
- `minPrice` - Minimum price per night
- `maxPrice` - Maximum price per night
- `amenities` - Comma-separated amenities
- `page` - Page number
- `limit` - Items per page

### GET /accommodations/:id
Get a single accommodation by ID.

## Itineraries

### GET /itineraries
Get user's itineraries (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

### POST /itineraries
Create a new itinerary (requires authentication).

**Request Body:**
```json
{
  "name": "My Yellowknife Adventure",
  "description": "A week of aurora viewing and winter activities",
  "startDate": "2024-01-15",
  "endDate": "2024-01-22",
  "items": [
    {
      "activityId": "uuid",
      "date": "2024-01-15",
      "startTime": "20:00",
      "endTime": "23:00",
      "notes": "Bring warm clothes"
    }
  ]
}
```

### PUT /itineraries/:id
Update an existing itinerary (requires authentication).

### DELETE /itineraries/:id
Delete an itinerary (requires authentication).

## Bookings

### GET /bookings
Get user's bookings (requires authentication).

### POST /bookings
Create a new booking (requires authentication).

**Request Body:**
```json
{
  "activityId": "uuid",
  "bookingDate": "2024-01-15",
  "numberOfPeople": 2,
  "specialRequests": "Vegetarian meal option"
}
```

### PUT /bookings/:id
Update a booking (requires authentication).

### POST /bookings/:id/cancel
Cancel a booking (requires authentication).

## Weather & Aurora

### GET /weather
Get current weather conditions and forecast.

**Query Parameters:**
- `days` - Number of days to forecast (default: 7, max: 14)

**Response:**
```json
{
  "success": true,
  "data": {
    "current": {
      "temperature": -25,
      "feelsLike": -35,
      "condition": "Clear",
      "windSpeed": 15
    },
    "forecast": [...]
  }
}
```

### GET /aurora/forecast
Get aurora forecast.

**Query Parameters:**
- `days` - Number of days to forecast (default: 7)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "date": "2024-01-15",
      "kpIndex": 5.5,
      "visibility": "good",
      "cloudCover": 25,
      "bestViewingTime": "22:00"
    }
  ]
}
```

### GET /aurora/alerts
Subscribe to aurora alerts (requires authentication and location permission).

## Reviews

### POST /reviews
Create a review (requires authentication).

**Request Body:**
```json
{
  "activityId": "uuid",
  "rating": 5,
  "title": "Amazing experience!",
  "comment": "The aurora tour was absolutely incredible..."
}
```

### PUT /reviews/:id
Update a review (requires authentication).

### DELETE /reviews/:id
Delete a review (requires authentication).

## User Profile

### GET /users/me
Get current user profile (requires authentication).

### PUT /users/me
Update user profile (requires authentication).

### PUT /users/me/password
Change password (requires authentication).

## Search

### GET /search
Global search across activities and accommodations.

**Query Parameters:**
- `q` - Search query
- `type` - Filter by type (activities, accommodations, or both)
- `page` - Page number
- `limit` - Items per page

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "success": false,
  "error": "Error message here",
  "code": "ERROR_CODE"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

API requests are rate-limited to 100 requests per 15 minutes per IP address.

Rate limit headers:
- `X-RateLimit-Limit` - Maximum requests allowed
- `X-RateLimit-Remaining` - Remaining requests
- `X-RateLimit-Reset` - Time when limit resets (Unix timestamp)
