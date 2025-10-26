# Supabase Edge Functions

This directory contains all Supabase Edge Functions for the YK Companion platform.

## 📁 Directory Structure

```
supabase/
├── functions/
│   ├── _shared/                    # Shared utilities
│   │   ├── cors.ts                 # CORS headers
│   │   ├── supabase.ts             # Supabase client helpers
│   │   ├── responses.ts            # Response helpers
│   │   ├── types.ts                # TypeScript types
│   │   └── validation.ts           # Validation utilities
│   ├── garage-sales-get/           # Get garage sales
│   ├── garage-sales-create/        # Create garage sale
│   ├── garage-sales-update/        # Update garage sale
│   ├── garage-sales-delete/        # Delete garage sale
│   ├── aurora-photos-upload/       # Upload aurora photo
│   ├── aurora-photos-feed/         # Get photo feed
│   ├── aurora-photos-like/         # Like/unlike photo
│   ├── aurora-forecasts-get/       # Get aurora forecasts
│   ├── email-digest-subscribe/     # Subscribe to email digest
│   ├── email-digest-unsubscribe/   # Unsubscribe from email digest
│   ├── push-notification-subscribe/   # Subscribe to push notifications
│   ├── push-notification-unsubscribe/ # Unsubscribe from push notifications
│   ├── knowledge-submissions-get/  # Get knowledge submissions
│   ├── knowledge-submissions-create/  # Create knowledge submission
│   ├── knowledge-likes-toggle/     # Toggle knowledge like
│   └── knowledge-comments-create/  # Create knowledge comment
├── migrations/                     # Database migrations
└── config.toml                     # Supabase configuration
```

## 🚀 Quick Start

### Prerequisites

1. Install Supabase CLI:
```bash
npm install -g supabase
```

2. Login to Supabase:
```bash
supabase login
```

### Local Development

1. Start local Supabase:
```bash
supabase start
```

2. Deploy functions locally:
```bash
supabase functions serve
```

3. Test a function:
```bash
curl -i --location --request GET 'http://localhost:54321/functions/v1/garage-sales-get'
```

### Deploy to Production

1. Link to your project:
```bash
supabase link --project-ref your-project-ref
```

2. Deploy all functions:
```bash
supabase functions deploy
```

3. Deploy a specific function:
```bash
supabase functions deploy garage-sales-get
```

## 📝 Available Functions

### Garage Sales

#### `garage-sales-get`
- **Method:** GET
- **Auth:** Optional
- **Description:** Get garage sales (all or by ID)
- **Query Params:**
  - `id`: Get specific garage sale
  - `upcoming`: Filter for upcoming sales only
  - `limit`: Number of results (default: 100)

**Example:**
```bash
curl 'https://your-project.supabase.co/functions/v1/garage-sales-get?upcoming=true&limit=10'
```

#### `garage-sales-create`
- **Method:** POST
- **Auth:** Required
- **Description:** Create a new garage sale
- **Body:**
```json
{
  "title": "Big Garage Sale",
  "description": "Furniture, tools, and more!",
  "address": "123 Main St, Yellowknife",
  "sale_date": "2025-06-15",
  "start_time": "09:00:00",
  "end_time": "16:00:00",
  "latitude": 62.4540,
  "longitude": -114.3718,
  "contact_email": "seller@example.com",
  "items_preview": ["furniture", "tools", "clothing"]
}
```

#### `garage-sales-update`
- **Method:** PUT/PATCH
- **Auth:** Required
- **Description:** Update your garage sale
- **Body:**
```json
{
  "id": "uuid",
  "title": "Updated Title",
  "description": "Updated description"
}
```

#### `garage-sales-delete`
- **Method:** DELETE
- **Auth:** Required
- **Description:** Delete your garage sale
- **Query Params:**
  - `id`: Garage sale ID

### Aurora Photos

#### `aurora-photos-upload`
- **Method:** POST
- **Auth:** Required
- **Description:** Upload an aurora photo
- **Body:** FormData
  - `file`: Image file (required)
  - `caption`: Photo caption
  - `location`: Location name
  - `latitude`: GPS latitude
  - `longitude`: GPS longitude
  - `taken_at`: Timestamp
  - `camera_settings`: JSON string
  - `challenge_id`: Challenge UUID

#### `aurora-photos-feed`
- **Method:** GET
- **Auth:** Optional
- **Description:** Get aurora photo feed
- **Query Params:**
  - `limit`: Number of photos (default: 20)
  - `offset`: Pagination offset
  - `featured`: Show only featured photos
  - `challenge_id`: Filter by challenge
  - `user_id`: Filter by user

#### `aurora-photos-like`
- **Method:** POST (like) / DELETE (unlike)
- **Auth:** Required
- **Description:** Like or unlike a photo
- **Body:**
```json
{
  "photo_id": "uuid"
}
```

#### `aurora-forecasts-get`
- **Method:** GET
- **Auth:** Optional
- **Description:** Get aurora forecasts
- **Query Params:**
  - `date`: Specific date (YYYY-MM-DD)
  - `days`: Number of days (default: 7)

### Email & Notifications

#### `email-digest-subscribe`
- **Method:** POST
- **Auth:** Required
- **Description:** Subscribe to email digest
- **Body:**
```json
{
  "email": "user@example.com",
  "frequency": "weekly"
}
```

#### `email-digest-unsubscribe`
- **Method:** POST
- **Auth:** Not required (uses token)
- **Description:** Unsubscribe from email digest
- **Body:**
```json
{
  "token": "unsubscribe-token"
}
```

#### `push-notification-subscribe`
- **Method:** POST
- **Auth:** Optional
- **Description:** Subscribe to push notifications
- **Body:**
```json
{
  "subscription": {
    "endpoint": "https://...",
    "keys": {
      "p256dh": "...",
      "auth": "..."
    }
  },
  "preferences": {
    "alert_high_kp": true,
    "alert_new_photos": false,
    "alert_challenges": true
  }
}
```

#### `push-notification-unsubscribe`
- **Method:** DELETE
- **Auth:** Optional
- **Description:** Unsubscribe from push notifications
- **Body:**
```json
{
  "endpoint": "https://..."
}
```

### Knowledge Base

#### `knowledge-submissions-get`
- **Method:** GET
- **Auth:** Optional
- **Description:** Get knowledge submissions
- **Query Params:**
  - `id`: Get specific submission
  - `category_id`: Filter by category
  - `approved`: Filter by approval status
  - `limit`: Number of results (default: 50)
  - `offset`: Pagination offset

#### `knowledge-submissions-create`
- **Method:** POST
- **Auth:** Required
- **Description:** Create knowledge submission
- **Body:**
```json
{
  "category_id": "uuid",
  "title": "How to survive -40°",
  "content": "Detailed guide...",
  "tags": ["winter", "survival", "tips"],
  "source_url": "https://example.com"
}
```

#### `knowledge-likes-toggle`
- **Method:** POST (like) / DELETE (unlike)
- **Auth:** Required
- **Description:** Toggle like on knowledge submission
- **Body:**
```json
{
  "submission_id": "uuid"
}
```

#### `knowledge-comments-create`
- **Method:** POST
- **Auth:** Required
- **Description:** Create comment on knowledge submission
- **Body:**
```json
{
  "submission_id": "uuid",
  "content": "Great tip!"
}
```

## 🔐 Authentication

Most functions require authentication. Include the Authorization header:

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  https://your-project.supabase.co/functions/v1/function-name
```

## 🛠️ Development Tips

### Testing Locally

1. Use Postman or curl to test functions
2. Check logs with `supabase functions logs function-name`
3. Use `console.log()` for debugging

### Environment Variables

Functions have access to:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### CORS

All functions support CORS. OPTIONS requests are handled automatically.

### Error Handling

All functions return consistent error responses:

```json
{
  "error": "Error message here"
}
```

## 📊 Database Migrations

Apply migrations to create required tables:

```bash
supabase db push
```

Migrations included:
- `20250127000001_aurora_photos.sql` - Aurora photo tables

## 🔄 CI/CD

Add to your GitHub Actions:

```yaml
- name: Deploy Supabase Functions
  run: |
    supabase link --project-ref ${{ secrets.SUPABASE_PROJECT_REF }}
    supabase functions deploy
  env:
    SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
```

## 📚 Additional Resources

- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [Deno Deploy](https://deno.com/deploy)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)

## 🤝 Contributing

When adding new functions:

1. Create function directory in `supabase/functions/`
2. Add `index.ts` with the function code
3. Update `config.toml` with function configuration
4. Update this README with documentation
5. Test locally before deploying

## 📝 License

MIT License - See LICENSE file for details
