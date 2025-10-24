-- Seed Data: Initial Yellowknife Knowledge Base Content
-- This provides rich content about Yellowknife culture, tourism, activities, fishing, and hunting

-- Insert sample approved knowledge submissions
INSERT INTO knowledge_submissions (
  title,
  content,
  category_id,
  content_type,
  tags,
  location_name,
  season,
  status,
  views,
  likes,
  is_featured
) VALUES

-- Culture & Heritage
(
  'The Meaning Behind Yellowknife''s Name',
  'Yellowknife gets its name from the Yellowknives Dene First Nation, who were named for the copper tools and weapons they made. The copper came from deposits near the Arctic coast and had a yellowish hue. The Indigenous name for the area is "Somba K''e" which means "where the money is" - a reference to the wealth of natural resources.',
  (SELECT id FROM knowledge_categories WHERE slug = 'culture-heritage'),
  'history',
  ARRAY['indigenous', 'dene', 'history', 'copper'],
  'Yellowknife',
  'year-round',
  'approved',
  156,
  23,
  true
),

(
  'Traditional Moosehide Tanning: A Living Art',
  'Moosehide tanning is a traditional skill passed down through generations in Yellowknife. The process takes weeks and involves scraping, smoking, and stretching the hide. Many elders still practice this art and offer workshops to keep the tradition alive. The tanned hide is used for mukluks, jackets, and traditional crafts.',
  (SELECT id FROM knowledge_categories WHERE slug = 'culture-heritage'),
  'culture',
  ARRAY['traditions', 'crafts', 'indigenous', 'skills'],
  NULL,
  'year-round',
  'approved',
  89,
  15,
  false
),

-- Outdoor Activities - Fishing
(
  'Best Lake Trout Fishing Spots Near Yellowknife',
  'Yellowknife is renowned for world-class lake trout fishing. Great Slave Lake offers trophy-sized fish, especially in the East Arm. Popular spots include Etthen Island, Gros Cap, and the Yellowknife River mouth. Best fishing is from June to September. Remember to get your NWT fishing license and respect catch limits. Local guides recommend using silver spoons or white tube jigs for best results.',
  (SELECT id FROM knowledge_categories WHERE slug = 'outdoor-activities'),
  'activity',
  ARRAY['fishing', 'lake-trout', 'great-slave-lake', 'summer'],
  'Great Slave Lake',
  'summer',
  'approved',
  234,
  42,
  true
),

(
  'Ice Fishing on Yellowknife Bay: A Winter Tradition',
  'Ice fishing on Yellowknife Bay is a beloved winter pastime. From late December to April, locals drill holes through 3-6 feet of ice to catch whitefish, pike, and burbot. Dress in layers - it can be -40°C! Essential gear: ice auger, tip-ups, warm shelter, and a thermos of hot coffee. The camaraderie on the ice is as rewarding as the catch.',
  (SELECT id FROM knowledge_categories WHERE slug = 'outdoor-activities'),
  'activity',
  ARRAY['ice-fishing', 'winter', 'whitefish', 'pike'],
  'Yellowknife Bay',
  'winter',
  'approved',
  198,
  31,
  false
),

-- Outdoor Activities - Hunting
(
  'Caribou Hunting Season and Regulations',
  'Caribou hunting is an important traditional activity in the Yellowknife region. The Bathurst caribou herd migrates through the area. Non-residents must be accompanied by a licensed guide. Season typically runs August to March, but check current regulations as they change based on herd health. Harvest tags are required. Many families rely on caribou for winter meat supply.',
  (SELECT id FROM knowledge_categories WHERE slug = 'outdoor-activities'),
  'tip',
  ARRAY['hunting', 'caribou', 'regulations', 'traditional'],
  NULL,
  'winter',
  'approved',
  167,
  28,
  false
),

(
  'Ptarmigan Hunting: A Beginner''s Guide',
  'Ptarmigan hunting is an accessible entry point for new hunters in Yellowknife. These chicken-sized birds are plentiful in fall and winter. No special license needed beyond basic hunting permit. Look for them in rocky, barren areas near Ingraham Trail. They blend into snow perfectly, so watch for movement. Delicious when roasted with wild berries!',
  (SELECT id FROM knowledge_categories WHERE slug = 'outdoor-activities'),
  'tip',
  ARRAY['hunting', 'ptarmigan', 'birds', 'beginners'],
  'Ingraham Trail',
  'winter',
  'approved',
  142,
  22,
  false
),

-- Aurora & Nature
(
  'Why Yellowknife is the Aurora Capital',
  'Yellowknife sits directly beneath the aurora oval at 62° North latitude, giving it some of the highest aurora visibility in the world. Clear, dark skies, minimal light pollution, and flat terrain provide optimal viewing. The aurora appears an average of 240 nights per year! Peak viewing is August-September and December-March. Best spots: Frame Lake Trail, Vee Lake, or book a tour to remote locations.',
  (SELECT id FROM knowledge_categories WHERE slug = 'aurora-nature'),
  'fact',
  ARRAY['aurora', 'northern-lights', 'tourism', 'viewing'],
  'Frame Lake Trail',
  'winter',
  'approved',
  521,
  87,
  true
),

(
  'The Three Sisters: Yellowknife''s Famous Rock Formation',
  'The "Three Sisters" are three distinctive rock outcroppings visible from Old Town. According to Dene legend, they represent three women who were turned to stone. These ancient formations are part of the Canadian Shield, some of the oldest rock on Earth at 2.6 billion years old. Great photo spot and easy hike from Ragged Ass Road.',
  (SELECT id FROM knowledge_categories WHERE slug = 'aurora-nature'),
  'history',
  ARRAY['landmarks', 'geology', 'old-town', 'hiking'],
  'Old Town',
  'summer',
  'approved',
  203,
  35,
  false
),

-- Local History
(
  'The Gold Rush That Built Yellowknife',
  'Yellowknife''s modern history began with gold discoveries in the 1930s. By 1938, multiple mines were operating, and the town boomed. The Giant Mine and Con Mine produced millions of ounces of gold over decades. While mining has slowed, the legacy remains in the town''s character. Visit the Prince of Wales Northern Heritage Centre to see gold rush artifacts and photographs.',
  (SELECT id FROM knowledge_categories WHERE slug = 'local-history'),
  'history',
  ARRAY['gold', 'mining', '1930s', 'heritage'],
  'Yellowknife',
  'year-round',
  'approved',
  178,
  29,
  true
),

(
  'The Wildcat Café: Yellowknife''s Oldest Restaurant',
  'Operating since 1937, the Wildcat Café is Yellowknife''s oldest restaurant and a designated heritage site. This log cabin has served bush pilots, miners, and tourists for over 85 years. The menu features Northern classics like bison burgers and Arctic char. Open summers only. Cash only! A true piece of living history.',
  (SELECT id FROM knowledge_categories WHERE slug = 'local-history'),
  'story',
  ARRAY['restaurants', 'heritage', 'old-town', 'dining'],
  'Old Town',
  'summer',
  'approved',
  267,
  45,
  false
),

-- Food & Dining
(
  'Trying Traditional Bannock: Where and How',
  'Bannock is a traditional Indigenous fried bread that''s a staple in Yellowknife. Find it at the Farmers Market (summer Saturdays at Somba K''e Park), cultural events, and some local cafés. Best served warm with butter and jam, or used for "Indian tacos" topped with ground meat and vegetables. Many families have secret recipes passed down generations.',
  (SELECT id FROM knowledge_categories WHERE slug = 'food-dining'),
  'tip',
  ARRAY['bannock', 'traditional-food', 'indigenous', 'farmers-market'],
  'Somba K''e Park',
  'summer',
  'approved',
  189,
  38,
  false
),

(
  'Where to Buy Fresh Fish: Yellowknife''s Fish Markets',
  'Fresh Great Slave Lake fish is a Yellowknife treasure. Buy direct from Indigenous fishers at the Somba K''e Civic Plaza on summer weekends. You''ll find whitefish, pickerel (walleye), and lake trout - some of the best tasting freshwater fish in the world. Some sellers also offer smoked fish. Support local and taste the difference!',
  (SELECT id FROM knowledge_categories WHERE slug = 'food-dining'),
  'tip',
  ARRAY['fish', 'local-food', 'markets', 'great-slave-lake'],
  'Somba K''e Civic Plaza',
  'summer',
  'approved',
  156,
  27,
  false
),

-- Winter Living
(
  'Surviving -40°C: Essential Winter Tips',
  'When it hits -40°C (which is also -40°F!), Yellowknifers know the drill: Layer up with thermal underwear, insulated pants, parka with hood, warm boots rated to -60°C, mittens (not gloves!), and face protection. Start your car every 4 hours or use a block heater. Keep emergency supplies in your vehicle. Frostbite can occur in minutes. But don''t let it keep you inside - winter is magical here!',
  (SELECT id FROM knowledge_categories WHERE slug = 'winter-living'),
  'tip',
  ARRAY['winter', 'cold', 'survival', 'clothing'],
  NULL,
  'winter',
  'approved',
  445,
  76,
  true
),

(
  'The Magic of Sundogs and Ice Crystals',
  'At -30°C and colder, tiny ice crystals suspended in the air create stunning optical phenomena. "Sundogs" are bright spots that appear on either side of the sun. You''ll also see halos, light pillars, and diamond dust sparkling in the air. These are daily occurrences in Yellowknife winters. Bring your camera and dress warm!',
  (SELECT id FROM knowledge_categories WHERE slug = 'winter-living'),
  'fact',
  ARRAY['winter', 'weather', 'sundogs', 'photography'],
  NULL,
  'winter',
  'approved',
  198,
  41,
  false
),

-- Community Events
(
  'Snowking Winter Festival: Yellowknife''s Ice Castle',
  'Every March, the Snowking Festival transforms Yellowknife Bay into a frozen wonderland. A massive snow castle is built on the ice, complete with throne room, tunnels, and performance spaces. The festival features live music, northern games, fire dancing, and art. It''s free to explore the castle. Don''t miss this unique Yellowknife tradition!',
  (SELECT id FROM knowledge_categories WHERE slug = 'community-events'),
  'activity',
  ARRAY['festival', 'winter', 'ice-castle', 'march'],
  'Yellowknife Bay',
  'winter',
  'approved',
  312,
  58,
  true
),

(
  'Folk on the Rocks: Canada''s Coolest Music Festival',
  'Folk on the Rocks is Yellowknife''s legendary outdoor music festival held each July on the shores of Long Lake. For 45+ years, it''s brought together artists from across the North and Canada. Camp under the midnight sun, dance in the rocks, and experience Northern music culture. Tickets sell out fast!',
  (SELECT id FROM knowledge_categories WHERE slug = 'community-events'),
  'activity',
  ARRAY['music', 'festival', 'summer', 'camping'],
  'Long Lake',
  'summer',
  'approved',
  278,
  52,
  false
),

-- Hidden Gems
(
  'The Woodyard: Yellowknife''s Secret Summer Hangout',
  'The Woodyard is a hidden gem on Latham Island in Old Town. This community gathering space has a beach, fire pits, and the best sunset views in Yellowknife. On summer evenings, locals gather for bonfires, guitar jams, and midnight sun swims. Bring your own chairs and respect the space - leave no trace!',
  (SELECT id FROM knowledge_categories WHERE slug = 'hidden-gems'),
  'tip',
  ARRAY['beach', 'sunset', 'old-town', 'summer'],
  'Latham Island',
  'summer',
  'approved',
  267,
  49,
  false
),

(
  'Pilots Monument: The Best 360° View of Yellowknife',
  'A short hike up "The Rock" leads to Pilots Monument, offering panoramic views of Yellowknife, Great Slave Lake, and the surrounding wilderness. The monument honors bush pilots who opened up the North. Go at sunset for incredible photos, or during aurora season for an elevated viewing platform. The hike takes about 20 minutes from Old Town.',
  (SELECT id FROM knowledge_categories WHERE slug = 'hidden-gems'),
  'tip',
  ARRAY['hiking', 'views', 'monument', 'old-town'],
  'Old Town',
  'year-round',
  'approved',
  334,
  61,
  true
),

(
  'The Ragged Ass Road Sign: Yellowknife''s Most Stolen Souvenir',
  'Ragged Ass Road in Old Town has the most photographed street sign in Yellowknife - and it''s been stolen so many times the city had to bolt it down! Legend says the road was named after a prospector''s camp. It''s a fun photo op and a quick walk through historic Old Town. Please don''t steal the sign!',
  (SELECT id FROM knowledge_categories WHERE slug = 'hidden-gems'),
  'story',
  ARRAY['old-town', 'landmarks', 'funny', 'photography'],
  'Ragged Ass Road',
  'year-round',
  'approved',
  445,
  73,
  false
);

-- Update sequence to ensure proper auto-increment
SELECT setval('knowledge_submissions_id_seq', (SELECT MAX(id::text)::bigint FROM knowledge_submissions) + 1);
