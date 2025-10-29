# Neighborhood Verification System - Comprehensive Plan

## Executive Summary

A neighborhood verification system for YK-Companion that allows Yellowknife residents to access hyper-local features after proving they live in a specific neighborhood. This system emphasizes trust, safety, and community building for smaller neighborhoods where personal connections matter.

---

## 1. System Overview

### 1.1 Core Concept
Users can claim membership in a Yellowknife neighborhood (Old Town, Downtown, Range Lake, Niven Lake, etc.) and gain access to verified-neighbor-only features after manual verification by admins or neighborhood moderators.

### 1.2 Key Principles
- **Trust First**: Manual verification ensures authenticity
- **Privacy by Default**: Users control what they share
- **Hyper-Local**: Features designed for 50-200 household neighborhoods
- **Community Moderation**: Empower local moderators
- **Gradual Access**: New members have limited access until verified

### 1.3 User Journey
```
1. User signs up → 2. Selects neighborhood → 3. Submits verification
→ 4. Admin/moderator reviews → 5. Approved/Rejected
→ 6. Access to neighborhood features → 7. Becomes trusted member
```

---

## 2. Database Schema Design

### 2.1 Core Tables

#### `neighborhoods`
```sql
CREATE TABLE neighborhoods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,               -- "Old Town", "Range Lake", etc.
  slug TEXT NOT NULL UNIQUE,               -- "old-town", "range-lake"
  description TEXT,
  boundaries GEOGRAPHY(POLYGON, 4326),     -- GeoJSON polygon for map display
  approx_households INTEGER,               -- For context (e.g., 150)
  is_active BOOLEAN DEFAULT true,

  -- Contact info
  emergency_contact TEXT,                  -- For power outages, emergencies

  -- Moderation
  requires_verification BOOLEAN DEFAULT true,
  auto_approve_new_members BOOLEAN DEFAULT false,

  -- Features toggles (per neighborhood)
  enable_crime_watch BOOLEAN DEFAULT true,
  enable_community_board BOOLEAN DEFAULT true,
  enable_resource_sharing BOOLEAN DEFAULT true,
  enable_emergency_contacts BOOLEAN DEFAULT true,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_neighborhoods_slug ON neighborhoods(slug);
CREATE INDEX idx_neighborhoods_boundaries ON neighborhoods USING GIST(boundaries);
```

#### `neighborhood_members`
```sql
CREATE TABLE neighborhood_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  neighborhood_id UUID NOT NULL REFERENCES neighborhoods(id) ON DELETE CASCADE,

  -- Verification status
  status TEXT NOT NULL DEFAULT 'pending',  -- pending, verified, rejected, suspended
  verification_method TEXT,                -- document, moderator_vouched, admin_manual, address_match

  -- Address info (encrypted or hashed for privacy)
  claimed_address TEXT,                    -- User-provided address
  verified_address TEXT,                   -- Admin-verified address (can be partial)
  unit_number TEXT,                        -- For apartments/condos

  -- Visibility controls
  show_address_to_neighbors BOOLEAN DEFAULT false,
  show_in_directory BOOLEAN DEFAULT true,
  receive_crime_alerts BOOLEAN DEFAULT true,
  receive_community_alerts BOOLEAN DEFAULT true,

  -- Role
  role TEXT DEFAULT 'member',              -- member, moderator, admin
  moderator_permissions JSONB,             -- {can_verify: true, can_post_alerts: true}

  -- Trust building
  verification_vouches INTEGER DEFAULT 0,  -- How many neighbors vouched for them
  trust_score INTEGER DEFAULT 0,           -- Algorithm-based trust (activity, vouches, time)
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES profiles(id),

  -- Activity
  last_active_at TIMESTAMPTZ,

  -- Audit
  rejection_reason TEXT,
  notes TEXT,                              -- Admin/moderator notes

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, neighborhood_id)         -- User can only be in one status per neighborhood
);

CREATE INDEX idx_neighborhood_members_user ON neighborhood_members(user_id);
CREATE INDEX idx_neighborhood_members_neighborhood ON neighborhood_members(neighborhood_id);
CREATE INDEX idx_neighborhood_members_status ON neighborhood_members(status);
CREATE INDEX idx_neighborhood_members_verified_at ON neighborhood_members(verified_at);
```

#### `verification_requests`
```sql
CREATE TABLE verification_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID NOT NULL REFERENCES neighborhood_members(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  neighborhood_id UUID NOT NULL REFERENCES neighborhoods(id) ON DELETE CASCADE,

  -- Verification documents
  document_type TEXT NOT NULL,             -- utility_bill, lease, drivers_license, property_tax, other
  document_url TEXT,                       -- Secure S3/Supabase storage URL
  document_description TEXT,
  additional_documents JSONB,              -- Array of {type, url, description}

  -- Supporting info
  move_in_date DATE,
  is_homeowner BOOLEAN,
  is_renter BOOLEAN,
  landlord_contact TEXT,                   -- For verification if needed

  -- Vouching system (for borderline cases)
  vouched_by UUID[] DEFAULT ARRAY[]::UUID[], -- Array of user IDs who vouch
  required_vouches INTEGER DEFAULT 2,      -- How many needed

  -- Review process
  status TEXT DEFAULT 'pending',           -- pending, under_review, approved, rejected, needs_more_info
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ,
  review_notes TEXT,
  rejection_reason TEXT,

  -- Follow-up
  follow_up_requested BOOLEAN DEFAULT false,
  follow_up_message TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_verification_requests_member ON verification_requests(member_id);
CREATE INDEX idx_verification_requests_status ON verification_requests(status);
CREATE INDEX idx_verification_requests_neighborhood ON verification_requests(neighborhood_id);
CREATE INDEX idx_verification_requests_created ON verification_requests(created_at DESC);
```

#### `neighborhood_alerts`
```sql
CREATE TABLE neighborhood_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  neighborhood_id UUID NOT NULL REFERENCES neighborhoods(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Alert details
  type TEXT NOT NULL,                      -- crime, suspicious_activity, lost_pet, found_item,
                                          -- emergency, power_outage, road_closure, community_event
  severity TEXT DEFAULT 'medium',         -- low, medium, high, urgent
  title TEXT NOT NULL,
  description TEXT NOT NULL,

  -- Location
  location_address TEXT,
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  location_description TEXT,              -- "Corner of 50th St and 48th Ave"

  -- Media
  photos TEXT[],                          -- Array of image URLs

  -- Status
  status TEXT DEFAULT 'active',           -- active, resolved, archived
  resolved_at TIMESTAMPTZ,
  resolution_notes TEXT,

  -- Engagement
  views_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,

  -- Moderation
  is_approved BOOLEAN DEFAULT false,
  approved_by UUID REFERENCES profiles(id),
  is_flagged BOOLEAN DEFAULT false,
  flag_reason TEXT,

  -- Expiry (auto-archive old alerts)
  expires_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_neighborhood_alerts_neighborhood ON neighborhood_alerts(neighborhood_id);
CREATE INDEX idx_neighborhood_alerts_type ON neighborhood_alerts(type);
CREATE INDEX idx_neighborhood_alerts_status ON neighborhood_alerts(status);
CREATE INDEX idx_neighborhood_alerts_created ON neighborhood_alerts(created_at DESC);
CREATE INDEX idx_neighborhood_alerts_location ON neighborhood_alerts(location_lat, location_lng);
```

#### `neighborhood_posts`
```sql
CREATE TABLE neighborhood_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  neighborhood_id UUID NOT NULL REFERENCES neighborhoods(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Post content
  title TEXT,
  content TEXT NOT NULL,
  post_type TEXT DEFAULT 'discussion',    -- discussion, question, announcement, offer, request,
                                         -- event, recommendation, poll

  -- Category
  category TEXT,                          -- general, safety, events, recommendations, for_sale,
                                         -- looking_for, help_needed

  -- Attachments
  photos TEXT[],
  attachments JSONB,                      -- {name, url, type, size}

  -- Engagement
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,

  -- Pinned posts (important announcements)
  is_pinned BOOLEAN DEFAULT false,
  pinned_until TIMESTAMPTZ,

  -- Moderation
  is_approved BOOLEAN DEFAULT true,       -- Auto-approve from verified members
  is_flagged BOOLEAN DEFAULT false,
  flag_count INTEGER DEFAULT 0,

  -- Privacy
  visible_to TEXT DEFAULT 'verified',     -- verified, all, moderators

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_neighborhood_posts_neighborhood ON neighborhood_posts(neighborhood_id);
CREATE INDEX idx_neighborhood_posts_author ON neighborhood_posts(author_id);
CREATE INDEX idx_neighborhood_posts_type ON neighborhood_posts(post_type);
CREATE INDEX idx_neighborhood_posts_created ON neighborhood_posts(created_at DESC);
CREATE INDEX idx_neighborhood_posts_pinned ON neighborhood_posts(is_pinned, pinned_until);
```

#### `neighborhood_comments`
```sql
CREATE TABLE neighborhood_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Can comment on alerts OR posts
  alert_id UUID REFERENCES neighborhood_alerts(id) ON DELETE CASCADE,
  post_id UUID REFERENCES neighborhood_posts(id) ON DELETE CASCADE,

  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES neighborhood_comments(id) ON DELETE CASCADE,

  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,

  is_flagged BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT check_parent CHECK (
    (alert_id IS NOT NULL AND post_id IS NULL) OR
    (alert_id IS NULL AND post_id IS NOT NULL)
  )
);

CREATE INDEX idx_neighborhood_comments_alert ON neighborhood_comments(alert_id);
CREATE INDEX idx_neighborhood_comments_post ON neighborhood_comments(post_id);
CREATE INDEX idx_neighborhood_comments_author ON neighborhood_comments(author_id);
CREATE INDEX idx_neighborhood_comments_parent ON neighborhood_comments(parent_comment_id);
```

#### `neighborhood_resources`
```sql
CREATE TABLE neighborhood_resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  neighborhood_id UUID NOT NULL REFERENCES neighborhoods(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Resource details
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,                 -- tools, equipment, services, skills, space
  specific_type TEXT,                     -- snowblower, ladder, chainsaw, babysitting, etc.

  -- Availability
  is_available BOOLEAN DEFAULT true,
  availability_notes TEXT,                -- "Weekends only", "Must return same day"

  -- Terms
  is_free BOOLEAN DEFAULT true,
  cost_description TEXT,                  -- "$10/day", "Free but gas not included"
  requires_deposit BOOLEAN DEFAULT false,
  deposit_amount DECIMAL(10, 2),

  -- Contact
  contact_method TEXT DEFAULT 'platform', -- platform, phone, email
  contact_info TEXT,                      -- Only shown to verified neighbors

  -- Media
  photos TEXT[],

  -- Engagement
  times_borrowed INTEGER DEFAULT 0,
  rating_average DECIMAL(3, 2),
  review_count INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_neighborhood_resources_neighborhood ON neighborhood_resources(neighborhood_id);
CREATE INDEX idx_neighborhood_resources_owner ON neighborhood_resources(owner_id);
CREATE INDEX idx_neighborhood_resources_category ON neighborhood_resources(category);
CREATE INDEX idx_neighborhood_resources_available ON neighborhood_resources(is_available);
```

#### `neighborhood_emergency_contacts`
```sql
CREATE TABLE neighborhood_emergency_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID NOT NULL REFERENCES neighborhood_members(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  neighborhood_id UUID NOT NULL REFERENCES neighborhoods(id) ON DELETE CASCADE,

  -- Contact preferences
  share_phone BOOLEAN DEFAULT false,
  phone_number TEXT,
  share_email BOOLEAN DEFAULT false,
  email TEXT,

  -- Skills/capabilities
  has_medical_training BOOLEAN DEFAULT false,
  medical_certification TEXT,             -- "EMT", "First Aid", "Nurse"
  has_generator BOOLEAN DEFAULT false,
  has_4x4_vehicle BOOLEAN DEFAULT false,
  can_offer_shelter BOOLEAN DEFAULT false,
  other_capabilities TEXT[],              -- ["Can shovel", "Has chainsaw", "Fluent in French"]

  -- Availability
  generally_available BOOLEAN DEFAULT true,
  availability_notes TEXT,

  -- Privacy
  visible_to TEXT DEFAULT 'verified',     -- verified, moderators, emergency_only

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(member_id)
);

CREATE INDEX idx_neighborhood_emergency_user ON neighborhood_emergency_contacts(user_id);
CREATE INDEX idx_neighborhood_emergency_neighborhood ON neighborhood_emergency_contacts(neighborhood_id);
```

#### `neighborhood_vouches`
```sql
CREATE TABLE neighborhood_vouches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Who is vouching for whom
  voucher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,    -- Person vouching
  vouchee_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,    -- Person being vouched for
  verification_request_id UUID REFERENCES verification_requests(id) ON DELETE CASCADE,
  neighborhood_id UUID NOT NULL REFERENCES neighborhoods(id) ON DELETE CASCADE,

  -- Vouch details
  relationship TEXT,                      -- "neighbor", "coworker", "friend", "family"
  confidence_level TEXT DEFAULT 'medium', -- low, medium, high
  notes TEXT,

  -- Verification (voucher must be verified themselves)
  voucher_verification_status TEXT,       -- verified, pending (captured at time of vouch)

  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(voucher_id, vouchee_id, neighborhood_id)
);

CREATE INDEX idx_neighborhood_vouches_vouchee ON neighborhood_vouches(vouchee_id);
CREATE INDEX idx_neighborhood_vouches_verification ON neighborhood_vouches(verification_request_id);
```

---

## 3. Manual Verification Workflow

### 3.1 User Submission Process

**Step 1: Neighborhood Selection**
- User browses map or list of Yellowknife neighborhoods
- Selects their neighborhood
- System shows: name, approximate boundaries, member count, features available

**Step 2: Initial Information**
- Address (street address, unit if applicable)
- Move-in date or how long they've lived there
- Homeowner or renter
- How they heard about this feature

**Step 3: Document Upload**
- **Required**: One primary document
  - Utility bill (power, water, internet) with name and address
  - Lease agreement
  - Property tax notice
  - Driver's license with address
  - Government mail (GNWT correspondence)

- **Optional**: Additional supporting documents
- **Alternative**: Request vouching from 2 verified neighbors

**Step 4: Privacy Acknowledgment**
- Users confirm they understand:
  - Their profile will show "Verified Neighbor" badge
  - Their name will appear in neighborhood directory (optional)
  - They can choose to share or hide their address
  - They agree to community guidelines

### 3.2 Admin/Moderator Review Process

**Review Dashboard** (`/admin/neighborhoods/verification`)

Display all pending requests with:
- User name and profile
- Neighborhood they're claiming
- Documents uploaded (view inline)
- Address claimed
- Account age, activity level
- Any red flags (duplicate requests, mismatched info)

**Review Actions:**
1. **Approve**
   - Mark as verified
   - Set verification method
   - Send welcome email with neighborhood guidelines
   - Grant access to all neighborhood features

2. **Request More Info**
   - Send message to user
   - Specify what's needed
   - Set deadline (7 days)

3. **Request Vouching**
   - If documents are unclear but user seems legitimate
   - Require 2 verified neighbors to vouch

4. **Reject**
   - Specify reason (insufficient proof, wrong neighborhood, suspicious)
   - User can reapply after 30 days
   - Send notification with explanation

**Moderator Verification:**
- Neighborhood moderators can verify members in their own neighborhood
- Requires moderator to have been verified for 90+ days
- Moderator vouching is weighted higher than regular vouching
- Audit log tracks all moderator decisions

### 3.3 Vouching System

**How It Works:**
1. User submits verification without strong documents
2. System prompts: "Need help? Ask 2 verified neighbors to vouch for you"
3. User can share link or search for neighbors by name
4. Verified neighbors receive notification
5. Vouchers confirm: relationship, confidence level, optional notes
6. After 2 vouches, request goes to admin for final approval
7. Admin sees vouches as strong positive signal

**Vouch Criteria:**
- Voucher must be verified for 30+ days
- Voucher must be active in community (not suspended)
- Maximum 5 vouches per user per month (prevent abuse)
- Voucher relationship to vouchee is logged

**Trust Building:**
- Users who successfully vouch build trust score
- Users who vouch for bad actors lose trust
- High trust users can eventually become moderators

---

## 4. Small Neighborhood-Specific Features

### 4.1 Crime Watch & Safety Alerts

**Feature Overview:**
Real-time alerts system for neighborhood safety concerns.

**Alert Types:**
- **Crime Reports**: Break-in, theft, vandalism, suspicious activity
- **Safety Warnings**: Wildlife sightings (bears!), icy conditions, road hazards
- **Lost & Found**: Lost pets, found items, missing packages
- **Emergency Notices**: Power outage, water main break, evacuation

**How It Works:**
1. Verified member creates alert
2. Selects type, severity, location
3. Adds description, photos
4. Alert sent as:
   - In-app notification (push)
   - Email (if enabled)
   - SMS (urgent only, opt-in)
5. Appears on neighborhood feed and map
6. Members can comment, provide updates
7. Creator can mark as resolved
8. Auto-archives after 30 days (configurable)

**Moderation:**
- High-severity alerts require moderator approval before sending
- Members can flag inappropriate alerts
- 3 flags = auto-hide pending review
- Abuse results in suspension from posting alerts

**UI Components:**
- Alert feed with filters (type, severity, date)
- Map view with pins for location-based alerts
- Quick-create button for urgent alerts
- Alert templates for common types

### 4.2 Neighborhood Directory & Member Profiles

**Directory Features:**
- List all verified members (opt-in)
- Search by name or address
- Filter by skills, capabilities, interests
- "New neighbors" section (joined in last 30 days)

**Member Profile Cards:**
```
[Profile Photo]
John Smith • Verified Neighbor ✓
Range Lake • Since March 2024

Skills: Snow removal, Basic carpentry
Has: Snowblower (available to borrow)
Interests: Nordic skiing, Local history

[Message] [Send Vouch]
```

**Privacy Controls:**
- Show/hide in directory
- Show partial address ("48th Ave area") or full address
- Show/hide contact info
- Show/hide capabilities
- Custom privacy per field

### 4.3 Community Bulletin Board

**Categories:**
- General Discussions
- Recommendations (contractors, services, businesses)
- For Sale / Free
- Looking For (babysitter, snow removal, rides)
- Events (block party, garage sales, meetups)
- Help Needed (shovel driveway, move furniture)
- Questions (local knowledge)

**Post Features:**
- Rich text editor
- Photo attachments
- Polls (for community decisions)
- Event RSVP
- Expiry dates (auto-archive old posts)
- Pin important posts

**Engagement:**
- Like posts and comments
- Nested comments (2 levels)
- @mention other members
- Subscribe to post updates
- Email digest (daily/weekly)

### 4.4 Resource Sharing

**What Can Be Shared:**
- **Tools & Equipment**: Snowblower, ladder, lawn mower, power tools
- **Services**: Snow removal, babysitting, dog walking, tutoring
- **Skills**: Handy work, gardening, tech support, language practice
- **Space**: Parking spot, storage, workshop access
- **Other**: Library (book sharing), seeds, canning jars

**Resource Listing:**
```
❄️ Snowblower - Craftsman 24"
Available: Yes
Cost: Free (gas not included)
Terms: Must return same day, book 24hrs ahead
Times borrowed: 12 • Rating: 4.8/5

[Request to Borrow] [Message Owner]
```

**Borrowing Flow:**
1. Browse available resources
2. Request to borrow (select dates)
3. Owner approves request
4. Exchange contact info
5. After return, both rate the exchange
6. Ratings build trust

**Safety Features:**
- Require deposit for expensive items
- Insurance requirement option
- Damage reporting
- Dispute resolution via moderator
- Ban bad actors from borrowing

### 4.5 Emergency Contact Network

**Opt-In System:**
Members can join the emergency contact network and share:
- Phone number (emergency only)
- Medical training/certifications
- Resources (generator, 4x4 vehicle, chainsaw)
- Ability to offer temporary shelter
- Languages spoken

**Use Cases:**
- Power outage: Find neighbors with generators
- Medical emergency: Find neighbors with first aid training
- Evacuation: Find neighbors with 4x4s who can help
- Severe weather: Coordinate check-ins on elderly neighbors
- Fire: Know who's out of town (empty houses)

**Privacy:**
- Only visible to verified neighbors
- Can limit to moderators only
- One-way contact (platform messages them, they respond)
- Can opt out anytime

### 4.6 Block Party & Event Coordination

**Event Types:**
- Block parties
- Garage sales (neighborhood-wide)
- Clean-up days
- Winter activities (skating, sledding)
- Holiday celebrations

**Event Features:**
- Create event with date, time, location
- Description, what to bring
- RSVP system
- Task sign-up (bring drinks, set up tables)
- Photo album after event
- Recurring events (monthly coffee, weekly walks)

**Coordination:**
- Discussion thread for planning
- Polls for date/time selection
- Expense splitting (if catered)
- Permit tracking (if needed from city)

### 4.7 Snow Removal Coordination

**Why It Matters:**
Yellowknife winters are harsh. Snow removal is critical and neighbors often help each other.

**Features:**
- "Need help" requests (elderly, injured, traveling)
- "Can help" offers (people with snowblowers)
- Sidewalk clearing coordination (who does which block)
- Snow dump location sharing
- Equipment borrowing
- Bulk snowblower fuel group buys

**Tracking:**
- Mark houses as "cleared" on map
- Track who helped whom
- Build reciprocity ("karma points")
- Thank-you system

### 4.8 Neighborhood Watch Roster

**Traditional Neighborhood Watch:**
- Volunteer roster with contact info
- Block captains
- Check-in schedule for vacation coverage
- Suspicious activity hotline (call chain)
- Crime prevention tips

**Digital Enhancements:**
- Automated check-in system
- Security camera registry (who has cameras where)
- Plate number reporting (suspicious vehicles)
- Integration with RCMP alerts (if available)

---

## 5. User Interface Design

### 5.1 Neighborhood Selection Flow

**Entry Points:**
- From profile page: "Join Your Neighborhood"
- From main menu: "My Neighborhood"
- Onboarding prompt (after initial signup)

**Selection Screen:**
```
+------------------------------------------+
|  🏘️ Find Your Yellowknife Neighborhood   |
+------------------------------------------+
|                                          |
|  [Interactive Map showing boundaries]    |
|  - Click your neighborhood              |
|  - Or search by address                 |
|                                          |
|  📍 Enter your address:                  |
|  [___________________________________]   |
|  [Detect My Location]                    |
|                                          |
+------------------------------------------+

Popular Neighborhoods:
⭐ Old Town (87 verified members)
⭐ Range Lake (134 verified members)
⭐ Niven Lake (112 verified members)
⭐ Downtown (56 verified members)
⭐ Kam Lake (43 verified members)
[View All →]
```

**Neighborhood Preview:**
```
+------------------------------------------+
|  🏡 Range Lake                            |
+------------------------------------------+
|  Active Members: 134 verified neighbors  |
|  Area: Bounded by Range Lake Rd,         |
|         Old Airport Rd, Frame Lake       |
|                                          |
|  🔒 Verification Required                 |
|                                          |
|  Features Available:                     |
|  ✓ Crime Watch Alerts                    |
|  ✓ Community Bulletin Board              |
|  ✓ Resource Sharing                      |
|  ✓ Emergency Contact Network             |
|  ✓ Event Coordination                    |
|                                          |
|  [Join This Neighborhood] [Learn More]   |
+------------------------------------------+
```

### 5.2 Verification Submission Screen

```
+------------------------------------------+
|  📋 Verify Your Range Lake Residence     |
+------------------------------------------+
|                                          |
|  Step 1 of 3: Your Address              |
|  ─────────────────────────────           |
|                                          |
|  Street Address *                        |
|  [___________________________________]   |
|                                          |
|  Unit/Apt (if applicable)                |
|  [___________________________________]   |
|                                          |
|  How long have you lived here? *         |
|  [Moved in: March 2024 ▼]                |
|                                          |
|  I am a: ○ Homeowner  ○ Renter          |
|                                          |
|  [Continue →]                            |
+------------------------------------------+

Step 2: Upload Proof
─────────────────────────────

We need one document showing your name and address:

✓ Utility bill (power, water, internet)
✓ Lease agreement
✓ Property tax notice
✓ Driver's license
✓ Government mail

[📎 Upload Document]
[Drop file here or click to browse]

Don't have documents handy?
[Request Vouch from 2 Neighbors Instead]

─────────────────────────────

Step 3: Privacy Settings
─────────────────────────────

☑️ Show me in neighborhood directory
☐ Share my full address with neighbors
☑️ Receive crime watch alerts via email
☑️ Receive community updates

[Submit for Review]
```

### 5.3 Neighborhood Dashboard

**Main Layout:**
```
+------------------------------------------+
|  Header: YK Companion                    |
+------------------------------------------+
|  🏡 Range Lake • 134 Members             |
|  ─────────────────────────────           |
|  [Alerts] [Posts] [Members] [Resources]  |
+------------------------------------------+
|                                          |
|  🚨 Active Alerts (3)                    |
|  ─────────────────────────────           |
|  🔴 URGENT: Bear spotted on 48th Ave     |
|      2 hours ago • 34 views              |
|                                          |
|  🟡 Suspicious vehicle on Range Lake Rd  |
|      5 hours ago • 12 views              |
|                                          |
|  🟢 Found: Black cat near tennis courts  |
|      1 day ago • 8 views                 |
|                                          |
|  [View All Alerts]  [+ Create Alert]     |
|                                          |
+------------------------------------------+
|                                          |
|  💬 Recent Posts (5)                     |
|  ─────────────────────────────           |
|  📌 Block Party Planning - June 15       |
|      Sarah M. • 23 comments              |
|                                          |
|  🔧 Recommendation: Electrician Needed   |
|      Mike T. • 8 comments                |
|                                          |
|  📦 Free: Moving boxes                   |
|      Lisa K. • 4 comments                |
|                                          |
|  [View All Posts]  [+ Create Post]       |
|                                          |
+------------------------------------------+
|                                          |
|  🛠️ Available Resources (8)              |
|  ─────────────────────────────           |
|  ❄️ Snowblower • John S.                |
|  🪜 Extension Ladder • Mike T.           |
|  🔧 Power Tools • Sarah M.               |
|                                          |
|  [Browse All]  [+ Share Resource]        |
|                                          |
+------------------------------------------+
|                                          |
|  📅 Upcoming Events                      |
|  ─────────────────────────────           |
|  June 15: Block Party @ Park             |
|  June 22: Garage Sale Day                |
|                                          |
|  [View Calendar]                         |
|                                          |
+------------------------------------------+
```

### 5.4 Admin Verification Dashboard

**Admin View: `/admin/neighborhoods/verification`**

```
+------------------------------------------+
|  🛡️ Neighborhood Verification Queue      |
+------------------------------------------+
|                                          |
|  Pending Reviews (12)                    |
|  ─────────────────────────────           |
|                                          |
|  Filter: [All ▼] [Range Lake ▼]         |
|  Sort: [Oldest First ▼]                  |
|                                          |
+------------------------------------------+

[Verification Card 1]
┌────────────────────────────────────────┐
│ 👤 Jennifer Martinez                   │
│ Range Lake • Submitted 3 days ago      │
├────────────────────────────────────────┤
│ Address: 4802 - 52nd Avenue           │
│ Move-in: January 2024                  │
│ Status: Renter                         │
│                                        │
│ Documents Uploaded:                    │
│ • ⚡ Power bill (NTPC) - Feb 2024      │
│ • 🏠 Lease agreement                    │
│   [View Documents]                     │
│                                        │
│ Account Info:                          │
│ • Member since: Dec 2023               │
│ • Activity: 12 posts, 8 comments       │
│ • Red flags: None                      │
│                                        │
│ [✅ Approve] [❓ Request Info] [❌ Reject]│
└────────────────────────────────────────┘

[Verification Card 2]
┌────────────────────────────────────────┐
│ 👤 David Chen                          │
│ Old Town • Submitted 1 day ago         │
├────────────────────────────────────────┤
│ Address: 4 Lessard Drive               │
│ Move-in: March 2024                    │
│ Status: Homeowner                      │
│                                        │
│ Verification Method: Neighbor Vouching │
│ Vouched by:                            │
│ • ✓ Sarah Thompson (verified)          │
│ • ✓ Mike Roberts (verified)            │
│   [View Vouch Details]                 │
│                                        │
│ No documents uploaded (vouched)        │
│                                        │
│ [✅ Approve] [❓ Request Docs] [❌ Reject]│
└────────────────────────────────────────┘
```

---

## 6. Security & Privacy Considerations

### 6.1 Row Level Security (RLS) Policies

**Principle**: Users can only access neighborhood content if verified.

#### Neighborhoods Table
```sql
-- Anyone can view neighborhoods (for selection)
CREATE POLICY "Anyone can view neighborhoods"
  ON neighborhoods FOR SELECT
  USING (is_active = true);
```

#### Neighborhood Members Table
```sql
-- Users can view their own membership
CREATE POLICY "Users can view own membership"
  ON neighborhood_members FOR SELECT
  USING (auth.uid() = user_id);

-- Users can view verified members in their neighborhoods
CREATE POLICY "View verified members in same neighborhood"
  ON neighborhood_members FOR SELECT
  USING (
    status = 'verified'
    AND neighborhood_id IN (
      SELECT neighborhood_id FROM neighborhood_members
      WHERE user_id = auth.uid() AND status = 'verified'
    )
  );

-- Admins can view all
CREATE POLICY "Admins can view all members"
  ON neighborhood_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Moderators can view members in their neighborhoods
CREATE POLICY "Moderators can view their neighborhood"
  ON neighborhood_members FOR SELECT
  USING (
    neighborhood_id IN (
      SELECT neighborhood_id FROM neighborhood_members
      WHERE user_id = auth.uid() AND role = 'moderator'
    )
  );
```

#### Alerts, Posts, Resources
```sql
-- Only verified members can view neighborhood content
CREATE POLICY "Verified members can view alerts"
  ON neighborhood_alerts FOR SELECT
  USING (
    neighborhood_id IN (
      SELECT neighborhood_id FROM neighborhood_members
      WHERE user_id = auth.uid() AND status = 'verified'
    )
  );

-- Only verified members can create content
CREATE POLICY "Verified members can create alerts"
  ON neighborhood_alerts FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM neighborhood_members
      WHERE user_id = auth.uid()
        AND neighborhood_id = neighborhood_alerts.neighborhood_id
        AND status = 'verified'
    )
  );
```

### 6.2 Data Privacy

**Personal Information Protection:**
1. **Addresses**:
   - Stored encrypted at rest
   - Only shown to user themselves by default
   - Optional sharing with verified neighbors
   - Admins see for verification only

2. **Documents**:
   - Uploaded to secure storage (Supabase Storage with RLS)
   - Only accessible by admins/moderators during review
   - Auto-deleted 90 days after verification approval
   - User can request immediate deletion

3. **Contact Information**:
   - Phone/email not required
   - Emergency contacts only visible if opted in
   - In-app messaging preferred (no direct contact info shared)

4. **Location Data**:
   - Alert locations approximate (100m radius)
   - User locations never tracked in real-time
   - No geofencing or location history

### 6.3 Abuse Prevention

**Measures:**
1. **Rate Limiting**:
   - Max 5 alerts per day per user
   - Max 10 posts per day per user
   - Max 20 comments per day per user

2. **Flagging System**:
   - Users can flag inappropriate content
   - 3 flags = auto-hide pending review
   - False flaggers lose flagging privilege

3. **Verification Fraud**:
   - One verification attempt per neighborhood per user
   - Rejected users wait 30 days to reapply
   - Duplicate documents detected and flagged
   - Photo EXIF data checked for tampering

4. **Suspension System**:
   - Warnings → Temporary suspension → Permanent ban
   - Moderators can suspend for 7 days
   - Admins can permanently ban
   - Appeal process available

### 6.4 Audit Logging

**Track All Sensitive Actions:**
```sql
CREATE TABLE neighborhood_audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,                   -- verified_member, rejected_member, suspended_member, etc.
  entity_type TEXT,                       -- member, alert, post, resource
  entity_id UUID,
  neighborhood_id UUID REFERENCES neighborhoods(id),
  details JSONB,                          -- Before/after state, reason, etc.
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 7. Notification System

### 7.1 Notification Types

**Verification-Related:**
- Verification request received (admin)
- Verification approved (user)
- Verification rejected (user)
- More information needed (user)
- Vouch request received (neighbor)

**Alert Notifications:**
- New urgent alert in your neighborhood (push + email + SMS)
- New high-priority alert (push + email)
- New medium/low alert (in-app only)
- Alert resolved (if you commented)
- Alert in your immediate area (within 200m)

**Community Notifications:**
- New post in category you follow
- Reply to your post/comment
- @mention in post/comment
- Likes on your content
- New member joined (weekly digest)

**Resource Notifications:**
- Borrow request received
- Borrow request approved/denied
- Item due for return reminder
- Review request (after return)

**Event Notifications:**
- Event invitation
- Event reminder (1 day before)
- Event canceled/changed
- Event recap posted

### 7.2 Notification Preferences

**Granular Control:**
```
Verification & Membership:
☑️ Verification status updates
☑️ New members in my neighborhood (weekly digest)

Safety Alerts:
☑️ Urgent alerts (push + email + SMS)
☑️ High priority alerts (push + email)
☐ Medium priority alerts (in-app only)
☐ Low priority alerts (digest only)

Community:
☑️ Replies to my posts
☑️ @mentions
☐ All new posts
☐ Posts in specific categories: [Select ▼]

Resources:
☑️ Borrow requests
☑️ Return reminders

Events:
☑️ Event invitations
☑️ Event reminders

Frequency:
○ Real-time  ○ Daily digest  ○ Weekly digest

Quiet Hours:
[10:00 PM] to [7:00 AM] • ☑️ Except urgent alerts
```

### 7.3 Email Templates

**Verification Approved:**
```
Subject: Welcome to the Range Lake Neighborhood on YK Companion!

Hi Jennifer,

Great news! Your verification for the Range Lake neighborhood has been approved.

You now have access to:
✓ Crime watch alerts from verified neighbors
✓ Community bulletin board
✓ Resource sharing (tools, equipment, skills)
✓ Emergency contact network
✓ Event coordination

Get Started:
• Introduce yourself on the community board
• Browse available resources neighbors are sharing
• Set up your emergency contact info (optional)
• Join our next block party on June 15!

Neighborhood Guidelines:
• Be respectful and kind
• Verify information before sharing
• No commercial spam or solicitation
• Report suspicious activity to RCMP first, then alert neighbors

Welcome to the community!
YK Companion Team

[View Your Neighborhood] [Update Notification Settings]
```

**Urgent Alert (SMS):**
```
YK Companion URGENT: Bear spotted on 48th Ave near Range Lake.
Secure pets and garbage. View details: [short link]
```

---

## 8. Admin & Moderator Tools

### 8.1 Admin Dashboard

**Neighborhood Management** (`/admin/neighborhoods`)
- Create/edit/deactivate neighborhoods
- View statistics (members, activity, alerts)
- Assign moderators
- Adjust feature toggles per neighborhood
- View geographic coverage on map

**Verification Queue** (`/admin/neighborhoods/verification`)
- Review pending verification requests
- Filter by neighborhood, date, status
- Batch actions (approve multiple)
- View verification history and stats

**Content Moderation** (`/admin/neighborhoods/moderation`)
- Flagged alerts, posts, comments
- User reports
- Quick actions: hide, delete, warn user
- Ban/suspend users

**Analytics** (`/admin/neighborhoods/analytics`)
- Verification approval rate
- Time to verification (avg)
- Most active neighborhoods
- Alert types and frequency
- Member engagement metrics
- Moderator activity

### 8.2 Moderator Dashboard

**Moderator Permissions:**
- Verify new members in their neighborhood only
- Moderate content (alerts, posts, comments)
- Pin/unpin posts
- Send neighborhood-wide announcements
- View analytics for their neighborhood

**Moderator Tools** (`/moderator/dashboard`)
- Pending verifications (limited to their neighborhood)
- Flagged content review
- Member directory management
- Event coordination tools
- Quick-create urgent alerts

**Becoming a Moderator:**
1. Must be verified for 90+ days
2. High trust score (active, positive contributions)
3. Nominated by other members or self-nomination
4. Approved by admin
5. Complete moderator training

---

## 9. Mobile Experience

### 9.1 Mobile-First Features

**Push Notifications:**
- Urgent alerts delivered instantly
- Rich notifications with images
- Actions: View Alert, Comment, Share

**Location Services:**
- Auto-detect neighborhood from GPS
- Proximity-based alerts ("Alert 200m from you")
- Map view with current location

**Quick Actions:**
- Widget: "Report Alert"
- Widget: "View Active Alerts"
- Siri shortcut: "Check neighborhood alerts"

**Offline Support:**
- Cache recent alerts for offline viewing
- Queue posts to send when back online
- Offline map tiles

### 9.2 Progressive Web App (PWA)

**Features:**
- Install on home screen
- Works offline
- Push notifications (web)
- Native-like experience
- Share sheet integration

---

## 10. Implementation Roadmap

### Phase 1: Foundation (Weeks 1-3)
- [ ] Database schema implementation
- [ ] RLS policies
- [ ] Basic admin verification dashboard
- [ ] User verification submission flow
- [ ] Email notification system
- [ ] Neighborhood selection UI

**Deliverable**: Users can select neighborhood, submit verification, admins can approve/reject.

### Phase 2: Core Features (Weeks 4-6)
- [ ] Crime watch alerts system
- [ ] Alert creation and management
- [ ] Alert feed and map view
- [ ] Push notification system
- [ ] Community bulletin board
- [ ] Post creation and commenting

**Deliverable**: Verified members can post alerts and community posts.

### Phase 3: Community Tools (Weeks 7-8)
- [ ] Resource sharing system
- [ ] Neighborhood directory
- [ ] Member profiles with capabilities
- [ ] Vouching system
- [ ] Moderator dashboard
- [ ] Enhanced privacy controls

**Deliverable**: Full community features with resource sharing and vouching.

### Phase 4: Advanced Features (Weeks 9-10)
- [ ] Emergency contact network
- [ ] Event coordination system
- [ ] Advanced analytics
- [ ] Moderator training system
- [ ] Mobile app optimization
- [ ] PWA enhancements

**Deliverable**: Complete neighborhood system with all features.

### Phase 5: Polish & Launch (Weeks 11-12)
- [ ] User testing and feedback
- [ ] Performance optimization
- [ ] Documentation
- [ ] Onboarding tutorials
- [ ] Marketing materials
- [ ] Pilot launch in 1-2 neighborhoods

**Deliverable**: Production-ready system launched to pilot neighborhoods.

---

## 11. Success Metrics

### 11.1 Verification Metrics
- Verification request volume (per neighborhood)
- Approval rate (target: >90%)
- Time to verification (target: <48 hours)
- Document quality (resubmission rate)
- Vouching success rate

### 11.2 Engagement Metrics
- Daily active users per neighborhood
- Alerts posted per week
- Alert response time (views, comments)
- Posts and comments per week
- Resource sharing activity
- Event participation rate

### 11.3 Safety & Trust Metrics
- False alert rate
- Flagged content rate
- User suspension rate
- Vouch accuracy (approved vouches)
- Member retention (90-day active rate)

### 11.4 Community Health Metrics
- New member join rate
- Member verification rate
- Cross-neighbor interactions
- In-person meetup frequency
- Neighbor satisfaction (survey)

---

## 12. Risk Mitigation

### 12.1 Potential Risks

**Risk: Low Adoption**
- Mitigation: Pilot in 2 active neighborhoods first, gather feedback
- Mitigation: Partner with neighborhood associations
- Mitigation: Host launch events to onboard initial members

**Risk: Verification Bottleneck**
- Mitigation: Train multiple moderators per neighborhood
- Mitigation: Implement vouching as alternative path
- Mitigation: Automated document verification (future)

**Risk: Privacy Concerns**
- Mitigation: Clear privacy policy and controls
- Mitigation: Data minimization (don't collect unnecessary info)
- Mitigation: Regular security audits
- Mitigation: GDPR/PIPEDA compliance

**Risk: Abuse or Harassment**
- Mitigation: Clear community guidelines
- Mitigation: Robust moderation tools
- Mitigation: Quick suspension process
- Mitigation: Anonymous reporting

**Risk: False/Spam Alerts**
- Mitigation: Require verification to post alerts
- Mitigation: Moderator approval for high-severity
- Mitigation: User reputation system
- Mitigation: Rate limiting

**Risk: Moderator Burnout**
- Mitigation: Multiple moderators per neighborhood
- Mitigation: Automated tools reduce manual work
- Mitigation: Moderator perks/recognition
- Mitigation: Admin support for escalations

---

## 13. Future Enhancements

### 13.1 Short-Term (6-12 months)
- AI-powered document verification
- Facial recognition for in-person verification events
- Integration with City of Yellowknife emergency system
- RCMP crime data integration
- Multi-language support (French, Tłı̨chǫ, Chipewyan)

### 13.2 Long-Term (1-2 years)
- Cross-neighborhood features (city-wide garage sale map)
- Business directory with neighborhood reviews
- Neighborhood volunteering coordination
- Integration with utility companies (outage alerts)
- Smart home integration (Ring doorbell alerts)
- Neighborhood-sponsored features (paid by neighborhood association)

---

## 14. Competitive Analysis

### 14.1 Existing Platforms

**Nextdoor (USA/Canada):**
- ✓ Established, large user base
- ✓ Similar verification system
- ✗ Not tailored to Yellowknife
- ✗ Corporate, privacy concerns
- ✗ US-centric features

**YK-Companion Advantages:**
- Local-first, designed for Yellowknife
- Integrated with existing YK features (aurora alerts, garage sales, knowledge base)
- Privacy-focused, community-owned feel
- Northern-specific features (winter coordination, emergency contacts)
- No ads, no data selling

### 14.2 Differentiation Strategy
- Emphasize "by Yellowknifers, for Yellowknifers"
- Highlight northern-specific features
- Partner with local organizations (NWT Association of Communities)
- Hyper-local focus (block-level, not just neighborhood)
- Integration with existing YK-Companion features users love

---

## 15. Community Guidelines (Draft)

**Yellowknife Neighborhood Guidelines**

Our neighborhood spaces are for verified neighbors to connect, help each other, and build a safer, stronger community.

**Be a Good Neighbor:**
- Be kind, respectful, and assume good intent
- Help each other out—we're all in this together
- Keep it local and relevant to our neighborhood
- Introduce yourself when you join!

**Safety & Security:**
- Report crimes to RCMP first (669-1111), then alert neighbors
- Verify information before sharing
- No vigilante justice or accusations
- Respect privacy—don't share others' info without permission

**What's Welcome:**
- Crime and safety alerts
- Lost & found (pets, items)
- Recommendations (contractors, services)
- Events and gatherings
- Requests for help
- Neighborhood discussions
- Resource sharing

**What's Not Allowed:**
- Commercial spam or advertising (unless approved by moderators)
- Political campaigns or divisive content
- Discriminatory, hateful, or harassing content
- False information or fear-mongering
- Private disputes (take it offline)
- Selling items (use garage sales feature)

**Consequences:**
- 1st violation: Warning
- 2nd violation: 7-day suspension
- 3rd violation: Permanent ban
- Severe violations: Immediate ban

Questions? Contact your neighborhood moderator or email support@ykcompanion.com.

---

## 16. Legal Considerations

### 16.1 Terms of Service Updates
- Add neighborhood verification terms
- Liability disclaimer for user-generated alerts
- Data retention policy for verification documents
- Moderator role and responsibilities
- User content ownership and licensing

### 16.2 Privacy Policy Updates
- Explain what verification data is collected
- How data is stored and protected
- Who can access verification info
- Data retention and deletion timeline
- PIPEDA compliance (Canadian privacy law)

### 16.3 Document Handling
- Secure storage (encrypted)
- Access controls (admin/moderator only)
- Automatic deletion after 90 days
- User right to request immediate deletion
- Audit logging of document access

---

## Conclusion

This neighborhood verification system will transform YK-Companion into a trusted, hyper-local platform that strengthens Yellowknife communities. By combining manual verification with smart features tailored to smaller neighborhoods, we create a safe space for neighbors to connect, help each other, and build resilience—especially important in a northern city where community ties matter.

**Next Steps:**
1. Review and approve this plan
2. Refine scope based on feedback
3. Prioritize features for Phase 1
4. Begin database schema implementation
5. Design UI mockups
6. Start development

**Questions for Consideration:**
- Which neighborhoods should we pilot first?
- Should we partner with existing neighborhood associations?
- What's the minimum viable feature set for launch?
- How many admin hours per week for verification?
- Budget for SMS notifications?

---

**Document Version:** 1.0
**Last Updated:** 2025-10-29
**Author:** Claude (AI Assistant)
**Status:** Draft for Review
