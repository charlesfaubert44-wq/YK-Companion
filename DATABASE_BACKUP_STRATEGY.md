# Database Backup & Recovery Strategy

## Overview

This document outlines the backup and recovery procedures for the YK Buddy Supabase database.

## Automated Backups (Supabase)

### Free Tier
- **Daily backups**: Retained for 7 days
- **Automatic**: No configuration needed
- **Location**: Managed by Supabase

### Pro Tier (Recommended for Production)
- **Daily backups**: Retained for 30 days
- **Point-in-time recovery**: Up to 7 days
- **Custom schedules**: Available

## Manual Backup Procedures

### 1. Database Schema Backup

Export schema and migrations:

```bash
# From project root
cd supabase

# Dump schema
supabase db dump --schema public > backups/schema_$(date +%Y%m%d).sql

# Dump data
supabase db dump --data-only > backups/data_$(date +%Y%m%d).sql
```

### 2. CSV Export (Per Table)

```sql
-- Export profiles
COPY (SELECT * FROM profiles) TO '/tmp/profiles.csv' WITH CSV HEADER;

-- Export garage_sales
COPY (SELECT * FROM garage_sales) TO '/tmp/garage_sales.csv' WITH CSV HEADER;

-- Export premium_sponsors
COPY (SELECT * FROM premium_sponsors) TO '/tmp/premium_sponsors.csv' WITH CSV HEADER;
```

### 3. Full Database Backup

```bash
# Using pg_dump (requires direct database access)
pg_dump postgresql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DATABASE] > backup.sql
```

## Backup Schedule

### Production
- **Automated**: Daily (Supabase)
- **Manual full backup**: Weekly (Sundays, 2 AM UTC)
- **Schema backup**: Before each migration
- **Critical data export**: Before major features

### Development
- **Schema backup**: Before each migration
- **Data snapshot**: As needed for testing

## Storage Locations

1. **Primary**: Supabase managed backups
2. **Secondary**: AWS S3 / Google Cloud Storage
3. **Tertiary**: Local encrypted backups (weekly)

### Recommended S3 Setup

```bash
# Install AWS CLI
npm install -g aws-cli

# Configure
aws configure

# Upload backup
aws s3 cp backup.sql s3://yk-buddy-backups/$(date +%Y-%m-%d)/

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket yk-buddy-backups \
  --versioning-configuration Status=Enabled
```

## Migration Rollback Procedures

### 1. Identify Problem Migration

```bash
# List migrations
supabase migration list

# Check current version
supabase db version
```

### 2. Create Rollback Migration

```sql
-- migrations/YYYYMMDDHHMMSS_rollback_feature.sql

-- Example: Rollback adding a column
ALTER TABLE profiles DROP COLUMN IF EXISTS new_column;

-- Example: Rollback table creation
DROP TABLE IF EXISTS new_table CASCADE;

-- Always include a way to re-apply if needed
```

### 3. Test Rollback Locally

```bash
# Reset local database
supabase db reset

# Apply migrations up to the problematic one
supabase migration up

# Test rollback
supabase migration apply rollback_feature.sql
```

### 4. Apply to Production

```bash
# IMPORTANT: Backup first!
supabase db dump > pre_rollback_backup.sql

# Apply rollback migration
supabase db push
```

## Recovery Procedures

### Scenario 1: Accidental Data Deletion

```sql
-- If within 7 days and on Pro plan
-- Use Point-in-Time Recovery from Supabase dashboard

-- Otherwise, restore from latest backup
psql [DATABASE_URL] < backup.sql
```

### Scenario 2: Corrupted Migration

```bash
# 1. Restore from pre-migration backup
supabase db reset

# 2. Restore data
psql [DATABASE_URL] < pre_migration_backup.sql

# 3. Fix migration file
# Edit migrations/[timestamp]_problematic.sql

# 4. Re-apply
supabase db push
```

### Scenario 3: Complete Database Loss

```bash
# 1. Create new Supabase project
supabase projects create yk-buddy-recovery

# 2. Restore schema
psql [NEW_DATABASE_URL] < schema_backup.sql

# 3. Restore data
psql [NEW_DATABASE_URL] < data_backup.sql

# 4. Verify data integrity
supabase db diff

# 5. Update environment variables
# Update NEXT_PUBLIC_SUPABASE_URL in production
```

## Monitoring & Alerts

### Setup Database Monitoring

```sql
-- Create monitoring function
CREATE OR REPLACE FUNCTION check_backup_status()
RETURNS TABLE (
  last_backup timestamp,
  size_mb numeric,
  status text
) AS $$
BEGIN
  -- Implementation depends on Supabase API
  -- This is a placeholder
  RETURN QUERY
  SELECT NOW() - interval '1 day', 100.5, 'healthy';
END;
$$ LANGUAGE plpgsql;
```

### Recommended Alerts

1. **Backup failures**: Email admin immediately
2. **Database size**: Alert at 80% capacity
3. **Connection issues**: Alert after 3 failed attempts
4. **Slow queries**: Log queries > 1 second

## Backup Verification

### Monthly Verification Checklist

- [ ] Test restore from latest backup
- [ ] Verify data integrity
- [ ] Check backup file sizes
- [ ] Confirm S3 bucket access
- [ ] Review retention policies
- [ ] Update documentation

### Quarterly Disaster Recovery Drill

- [ ] Full database restore to staging
- [ ] Verify all tables and data
- [ ] Test application functionality
- [ ] Document recovery time
- [ ] Update recovery procedures

## Retention Policy

| Backup Type | Retention Period | Storage Location |
|-------------|------------------|------------------|
| Daily automatic | 7-30 days | Supabase |
| Weekly manual | 12 weeks | S3 + Local |
| Monthly archive | 12 months | S3 Glacier |
| Schema backups | Indefinite | Git repository |
| Pre-migration | 90 days | S3 |

## Security

### Encryption

- **In transit**: SSL/TLS for all database connections
- **At rest**: Encryption enabled on Supabase and S3
- **Backup files**: Encrypted before upload

### Access Control

```bash
# Encrypt backup
gpg --symmetric --cipher-algo AES256 backup.sql

# Decrypt backup
gpg --decrypt backup.sql.gpg > backup.sql
```

### Credentials Management

- Store database credentials in password manager
- Rotate credentials quarterly
- Use read-only credentials for backups when possible

## Automation Script

```bash
#!/bin/bash
# backup.sh - Automated backup script

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
S3_BUCKET="s3://yk-buddy-backups"

# Create backup
supabase db dump > "$BACKUP_DIR/backup_$DATE.sql"

# Compress
gzip "$BACKUP_DIR/backup_$DATE.sql"

# Encrypt
gpg --symmetric --cipher-algo AES256 "$BACKUP_DIR/backup_$DATE.sql.gz"

# Upload to S3
aws s3 cp "$BACKUP_DIR/backup_$DATE.sql.gz.gpg" "$S3_BUCKET/$DATE/"

# Clean up old local backups (keep 7 days)
find "$BACKUP_DIR" -name "backup_*.sql.gz.gpg" -mtime +7 -delete

# Log result
echo "Backup completed: $DATE" >> "$BACKUP_DIR/backup.log"
```

### Schedule with Cron

```bash
# Run daily at 2 AM
0 2 * * * /path/to/backup.sh >> /var/log/yk-buddy-backup.log 2>&1
```

## Cost Optimization

### Free Tier Strategy
- Use Supabase automatic backups (free)
- Manual weekly exports to local storage
- Keep only 4 weekly backups locally

### Paid Tier Strategy
- Supabase Pro with 30-day retention
- Weekly S3 uploads
- Monthly archives to S3 Glacier
- Estimated cost: $5-15/month

## Emergency Contacts

- **Supabase Support**: support@supabase.com
- **Database Admin**: [Your Email]
- **On-call DevOps**: [Phone Number]

## References

- [Supabase Backup Documentation](https://supabase.com/docs/guides/platform/backups)
- [PostgreSQL Backup Guide](https://www.postgresql.org/docs/current/backup.html)
- [AWS S3 Best Practices](https://docs.aws.amazon.com/AmazonS3/latest/userguide/backup-for-s3.html)


