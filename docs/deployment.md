# Deployment Guide

## Overview

This guide covers deploying the Yellowknife Trip Planner to production environments.

## Deployment Architecture

### Recommended Stack

- **Web App**: Vercel or Netlify
- **API**: Railway, Render, or AWS EC2
- **Database**: AWS RDS (PostgreSQL) or Supabase
- **Mobile App**: Expo EAS Build
- **File Storage**: AWS S3 or Cloudflare R2
- **CDN**: Cloudflare

## Prerequisites

- Production database setup
- API keys for third-party services
- SSL certificates (usually auto-provisioned)
- Domain name configured

## Database Setup

### PostgreSQL Production Database

1. **Create production database**
   - Use managed service (AWS RDS, DigitalOcean, Supabase, etc.)
   - Configure backup and replication
   - Set up connection pooling

2. **Run migrations**
   ```bash
   DATABASE_URL=<production-url> npm run migrate
   ```

3. **Seed initial data (if needed)**
   ```bash
   DATABASE_URL=<production-url> npm run seed
   ```

## API Deployment

### Option 1: Railway

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login and initialize**
   ```bash
   railway login
   railway init
   ```

3. **Set environment variables**
   ```bash
   railway variables set DATABASE_URL=<url>
   railway variables set JWT_SECRET=<secret>
   # ... set all required variables
   ```

4. **Deploy**
   ```bash
   railway up
   ```

### Option 2: Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure build settings:
   - Build Command: `cd apps/api && npm install && npm run build`
   - Start Command: `cd apps/api && npm start`
4. Add environment variables in Render dashboard
5. Deploy

### Option 3: AWS EC2

1. **Launch EC2 instance**
   - Choose Ubuntu 22.04 LTS
   - t2.medium or larger recommended
   - Configure security groups (ports 80, 443, 22)

2. **SSH into instance**
   ```bash
   ssh -i your-key.pem ubuntu@your-ip
   ```

3. **Install dependencies**
   ```bash
   sudo apt update
   sudo apt install nodejs npm postgresql-client nginx
   ```

4. **Clone repository**
   ```bash
   git clone <repository-url>
   cd yk-trip-planner
   npm install
   ```

5. **Build API**
   ```bash
   cd apps/api
   npm run build
   ```

6. **Set up PM2**
   ```bash
   sudo npm install -g pm2
   pm2 start dist/index.js --name yk-api
   pm2 startup
   pm2 save
   ```

7. **Configure Nginx**
   ```nginx
   server {
       listen 80;
       server_name api.yoursite.com;

       location / {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

8. **Set up SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d api.yoursite.com
   ```

## Web App Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   cd apps/web
   vercel
   ```

4. **Set environment variables**
   - Go to Vercel dashboard
   - Project Settings → Environment Variables
   - Add:
     - `NEXT_PUBLIC_API_URL`
     - `NEXT_PUBLIC_MAPBOX_TOKEN`
     - etc.

5. **Deploy to production**
   ```bash
   vercel --prod
   ```

### Netlify

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build the app**
   ```bash
   cd apps/web
   npm run build
   ```

3. **Deploy**
   ```bash
   netlify deploy --prod
   ```

## Mobile App Deployment

### Expo EAS Build

1. **Install EAS CLI**
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo**
   ```bash
   eas login
   ```

3. **Configure EAS**
   ```bash
   cd apps/mobile
   eas build:configure
   ```

4. **Build for Android**
   ```bash
   eas build --platform android
   ```

5. **Build for iOS** (requires Apple Developer account)
   ```bash
   eas build --platform ios
   ```

6. **Submit to stores**
   ```bash
   # Google Play Store
   eas submit --platform android

   # Apple App Store
   eas submit --platform ios
   ```

## Environment Variables

### Production Environment Variables

**API:**
```env
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://...
JWT_SECRET=<strong-secret-key>
JWT_EXPIRES_IN=7d
WEATHER_API_KEY=<key>
AURORA_API_KEY=<key>
STRIPE_SECRET_KEY=<key>
AWS_ACCESS_KEY_ID=<key>
AWS_SECRET_ACCESS_KEY=<key>
AWS_S3_BUCKET=<bucket>
SENDGRID_API_KEY=<key>
CORS_ORIGIN=https://yoursite.com
```

**Web:**
```env
NEXT_PUBLIC_API_URL=https://api.yoursite.com
NEXT_PUBLIC_MAPBOX_TOKEN=<token>
NEXT_PUBLIC_ENV=production
```

**Mobile:**
Update `app.json` with production API URLs

## SSL/TLS Configuration

### Let's Encrypt (Free)

For API server:
```bash
sudo certbot --nginx -d api.yoursite.com
```

For web app, Vercel/Netlify handles this automatically.

## Monitoring and Logging

### Application Monitoring

**Option 1: Sentry**
```bash
npm install @sentry/node @sentry/react
```

Configure in your apps:
```typescript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

**Option 2: LogRocket** (for frontend)
```bash
npm install logrocket
```

### Server Monitoring

- Use PM2 monitoring: `pm2 monit`
- Set up CloudWatch (AWS)
- Use Datadog or New Relic

### Database Monitoring

- Enable slow query logging
- Set up database metrics monitoring
- Configure automated backups

## Performance Optimization

### API

1. **Enable compression**
   ```typescript
   import compression from 'compression';
   app.use(compression());
   ```

2. **Add caching**
   ```typescript
   import redis from 'redis';
   // Configure Redis for caching
   ```

3. **Database indexing**
   - Ensure proper indexes on frequently queried fields
   - Use EXPLAIN ANALYZE for slow queries

### Web App

1. **Enable Next.js caching**
   ```typescript
   export const revalidate = 3600; // ISR - 1 hour
   ```

2. **Image optimization**
   - Use Next.js Image component
   - Compress images before upload

3. **Code splitting**
   - Use dynamic imports for large components
   ```typescript
   const HeavyComponent = dynamic(() => import('./HeavyComponent'));
   ```

### Mobile App

1. **Optimize images**
   - Use appropriate image sizes
   - Implement lazy loading

2. **Enable Hermes** (React Native)
   ```json
   {
     "expo": {
       "jsEngine": "hermes"
     }
   }
   ```

## CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-api:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build:api
      - name: Deploy to Railway
        run: railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}

  deploy-web:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build:web
      - name: Deploy to Vercel
        run: vercel deploy --prod
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

## Backup Strategy

### Database Backups

**Automated daily backups:**
```bash
# Cron job for daily backup
0 2 * * * pg_dump -U postgres yk_trip_planner > /backups/yk_trip_planner_$(date +\%Y\%m\%d).sql
```

**Backup to S3:**
```bash
aws s3 cp backup.sql s3://your-bucket/backups/
```

### File Backups

- Configure S3 versioning
- Set up lifecycle policies for old files

## Rollback Procedure

1. **API Rollback**
   ```bash
   # Railway
   railway rollback

   # PM2
   pm2 restart yk-api@previous
   ```

2. **Web App Rollback**
   ```bash
   # Vercel
   vercel rollback

   # Manual
   git revert <commit>
   vercel --prod
   ```

3. **Database Rollback**
   ```bash
   npm run migrate:rollback
   ```

## Health Checks

Implement health check endpoints:

```typescript
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get('/health/db', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok' });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});
```

## Security Checklist

- [ ] Enable HTTPS/TLS
- [ ] Set secure HTTP headers (helmet.js)
- [ ] Implement rate limiting
- [ ] Use environment variables for secrets
- [ ] Enable CORS with specific origins
- [ ] Sanitize user inputs
- [ ] Use prepared statements for database queries
- [ ] Implement authentication and authorization
- [ ] Regular security updates
- [ ] Set up Web Application Firewall (WAF)

## Post-Deployment

1. **Verify deployments**
   - Test all critical endpoints
   - Check health endpoints
   - Verify database connections

2. **Monitor initial traffic**
   - Watch error logs
   - Monitor response times
   - Check database performance

3. **Set up alerts**
   - Error rate thresholds
   - Response time alerts
   - Database connection alerts

## Scaling Considerations

### Horizontal Scaling

- Use load balancer (AWS ALB, Nginx)
- Deploy multiple API instances
- Implement session management with Redis

### Database Scaling

- Set up read replicas
- Implement connection pooling
- Consider sharding for large datasets

### CDN

- Use Cloudflare or AWS CloudFront
- Cache static assets
- Optimize image delivery
