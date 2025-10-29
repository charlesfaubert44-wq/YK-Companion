# Neighborhood Access Feature

## Overview

The Neighborhood Access Feature enables residents of Yellowknife to connect with their neighbors, share information, stay informed about local events, and build stronger community bonds at the hyperlocal level.

## Initial Neighborhoods

1. **Con Place / Con Road** - Covering Con Place, Con Road, Con Ave, Con Avenue
2. **Rycon Place** - Covering Rycon Place, Rycon Pl

## Core Features

### 1. Neighborhood Membership & Approval Workflow

- **Address-Based Matching**: Automatic neighborhood suggestion based on user's address
- **Join Requests**: Users request to join their neighborhood community
- **Manual Approval**: Moderators/admins approve or reject join requests
- **Role-Based Access**: Members, Moderators, and Admins with different permission levels
- **Email Notifications**: Automated emails for join requests and approvals

### 2. Community Bulletin Board

Share and discover community information:
- **Help Offered**: Neighbors offering assistance (snow plowing, babysitting, etc.)
- **Help Needed**: Requests for community support
- **Events**: Neighborhood gatherings and activities
- **Announcements**: Important community news
- **Lost & Found**: Help locate missing items or pets
- **Recommendations**: Share local favorites
- **Questions**: Community Q&A

### 3. Security Alerts System

Real-time community safety information:
- **Alert Types**: Security, suspicious activity, crime, emergency, weather, utility, wildlife, traffic
- **Severity Levels**: Low, Medium, High, Critical
- **Email Notifications**: Automatic alerts sent to all members
- **Camera Feed Posting**: Share security camera footage
- **Location Tracking**: Pin alerts to specific locations
- **Status Updates**: Track resolution of alerts

### 4. Local Business Directory

Discover and support neighborhood businesses:
- **Categories**: Restaurant, Retail, Service, Health, Education, Entertainment, Professional, Trades
- **Business Verification**: Verified and featured business listings
- **Contact Information**: Phone, email, website, address
- **Hours of Operation**: Daily business hours
- **Reviews & Ratings**: Community feedback on businesses
- **Distance Tracking**: See how far businesses are from you

### 5. RCMP Complaint Generator

Streamlined police complaint submission:
- **Incident Types**: Theft, vandalism, assault, break-in, suspicious activity, noise, traffic, drug activity, fraud, harassment
- **Detailed Forms**: Comprehensive incident documentation
- **Evidence Upload**: Attach photos, videos, and documents
- **Anonymous Option**: Submit complaints anonymously if needed
- **Email to RCMP**: Direct submission to Yellowknife RCMP Detachment
- **Status Tracking**: Monitor complaint progress

### 6. Local Politics Discussion

Civic engagement at the neighborhood level:
- **Topic Types**: City council, MLA updates, development, infrastructure, bylaws, petitions, meetings, votes
- **Meeting Information**: Track upcoming council meetings and agendas
- **Related Officials**: Tag relevant MLAs and councillors
- **Document Sharing**: Attach relevant policy documents
- **Community Discussion**: Facilitate informed civic conversation
- **Moderation Controls**: Lock discussions if needed to maintain civility

## Technical Implementation

### Database Schema

**New Tables:**
- `neighborhoods` - Neighborhood definitions with street mappings
- `neighborhood_members` - User memberships with approval workflow
- `neighborhood_posts` - Bulletin board posts
- `neighborhood_post_comments` - Threaded comments on posts
- `neighborhood_alerts` - Security and community alerts
- `neighborhood_businesses` - Local business directory
- `rcmp_complaints` - Police complaint tracking
- `neighborhood_politics` - Political discussion threads

**Security:**
- Row Level Security (RLS) policies on all tables
- Approved members can view neighborhood content
- Moderators/admins can manage members and content
- Users control their own submissions

### API Routes

**Neighborhoods:**
- `GET /api/neighborhoods` - List all active neighborhoods
- `GET /api/neighborhoods?address=...` - Suggest neighborhoods based on address

**Membership:**
- `POST /api/neighborhoods/[id]/join` - Request to join neighborhood
- `GET /api/neighborhoods/[id]/join` - Check membership status
- `GET /api/neighborhoods/[id]/members` - List neighborhood members
- `POST /api/neighborhoods/[id]/approve` - Approve/reject join requests

**Content:**
- `GET/POST /api/neighborhoods/[id]/posts` - Bulletin board posts
- `GET/POST /api/neighborhoods/[id]/alerts` - Security alerts
- `GET/POST /api/neighborhoods/[id]/businesses` - Local businesses
- `GET/POST /api/neighborhoods/[id]/politics` - Politics discussions
- `GET /api/neighborhoods/[id]/dashboard` - Aggregated dashboard data

**RCMP Complaints:**
- `GET/POST /api/rcmp-complaints` - Manage complaints
- `POST /api/rcmp-complaints/[id]/submit` - Submit complaint to RCMP

### Frontend Pages

**Main Pages:**
- `/living/neighborhoods` - Neighborhood discovery and join page
- `/living/neighborhoods/[id]` - Neighborhood dashboard
- `/living/neighborhoods/[id]/posts` - Full bulletin board (to be implemented)
- `/living/neighborhoods/[id]/alerts` - All security alerts (to be implemented)
- `/living/neighborhoods/[id]/businesses` - Business directory (to be implemented)
- `/living/neighborhoods/[id]/politics` - Politics discussions (to be implemented)
- `/living/neighborhoods/[id]/admin` - Member approval panel (to be implemented)

**Integration:**
- Added neighborhood link to `/living` page
- Integrated with existing header navigation

### Email Notifications

**Templates:**
1. **Join Request** - Notifies moderators of new join requests
2. **Join Approval** - Welcomes new members to the neighborhood
3. **Security Alerts** - Sends urgent alerts to all members

**Future Enhancements:**
- Digest emails for daily/weekly summaries
- Custom notification preferences per member
- Join rejection emails with reasons

## User Roles & Permissions

### Member
- View all neighborhood content
- Create posts, alerts, and political discussions
- Submit business listings
- Create RCMP complaints
- Comment on posts and discussions

### Moderator
- All member permissions
- Approve/reject join requests
- Pin and archive posts
- Verify and flag alerts
- Moderate content

### Admin
- All moderator permissions
- Manage neighborhood settings
- Assign moderator roles
- Access all admin panels

## Data Privacy & Security

- **RLS Policies**: Enforced at database level
- **Approved Access Only**: Content only visible to approved members
- **Personal Information**: Users control what information they share
- **Anonymous Options**: Support for anonymous complaints and posts
- **Email Preferences**: Users can control notification settings

## Future Enhancements

### Phase 2 Features
1. **Event Calendar**: Dedicated neighborhood events system
2. **File Sharing**: Share documents with the community
3. **Photo Gallery**: Neighborhood photo sharing
4. **Polls & Surveys**: Community decision-making tools
5. **Resource Lending**: Borrow/lend tools and equipment
6. **Carpool Coordination**: Organize neighborhood carpools

### Phase 3 Features
1. **Mobile App**: Native iOS/Android apps
2. **Push Notifications**: Real-time mobile alerts
3. **Neighborhood Watch**: Enhanced security monitoring
4. **Emergency Contacts**: Quick access to local emergency resources
5. **Analytics Dashboard**: Neighborhood engagement metrics
6. **Multi-Language Support**: French translations

## Getting Started

### For Users

1. **Find Your Neighborhood**
   - Navigate to `/living/neighborhoods`
   - Enter your address to find matching neighborhoods
   - Submit a join request with your address

2. **Wait for Approval**
   - Neighborhood moderators will review your request
   - You'll receive an email when approved

3. **Start Connecting**
   - Access your neighborhood dashboard
   - Explore posts, alerts, and local businesses
   - Create your first post to introduce yourself

### For Moderators

1. **Review Join Requests**
   - Check pending requests in the admin panel
   - Verify applicant addresses match neighborhood streets
   - Approve or reject with notes

2. **Moderate Content**
   - Pin important announcements
   - Verify security alerts for accuracy
   - Approve business listings

3. **Build Community**
   - Welcome new members
   - Encourage participation
   - Foster positive discussions

## Database Migration

The neighborhood system is implemented in:
```
supabase/migrations/20251029000001_neighborhood_system.sql
```

This migration includes:
- All table schemas
- RLS policies
- Helper functions
- Seed data for initial neighborhoods
- Triggers for updated_at timestamps

To apply:
```bash
supabase db push
```

## Testing Checklist

- [ ] User can find neighborhood by address
- [ ] User can submit join request
- [ ] Moderator receives email notification
- [ ] Moderator can approve/reject requests
- [ ] User receives approval email
- [ ] Approved user can access neighborhood dashboard
- [ ] User can create posts, alerts, businesses, politics posts
- [ ] User can create and submit RCMP complaint
- [ ] Security alerts trigger email notifications
- [ ] Dashboard shows correct stats and recent activity
- [ ] RLS policies prevent unauthorized access

## Support

For questions or issues with the neighborhood feature:
- Email: support@ykbuddy.com
- Admin Panel: Contact your neighborhood moderator

---

**Built with love for the Yellowknife community** 🏘️❤️
