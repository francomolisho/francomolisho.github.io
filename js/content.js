// =====================================================================
//  FRANCO MOLISHO — SITE CONTENT  (the one file you edit)
// =====================================================================
//  Everything the website shows (and the CV PDFs reuse) lives here:
//  titles, synopses, credits, awards, experience, contact, image paths.
//
//  RULES, so the file keeps working:
//   1. Text goes "between double quotes".
//   2. Every item in a list or block is followed by a comma,
//      EXCEPT the last one before a closing ] or }.
//   3. Comments like this one must sit on their own line, starting with //.
//   4. An image that does not exist yet simply shows a placeholder.
//      Drop your file at the path written here and it appears.
//   5. "" (empty) means "not provided yet".
//
//  If the page ever shows "content.js could not be read", a comma or a
//  quote is missing just above the line you last changed.
// =====================================================================

window.SITE = {

  "settings": {
// true while you build: placeholders show what file goes where.
// Set to false before publishing: placeholders show quiet captions instead.
    "showPlaceholderNotes": false,
// true = show the layout of sections still being prepared (testimonials, photography) with empty frames.
    "draftSections": false,
// Typeface: "classic" (serif titles), "montserrat" or "poppins".
    "font": "poppins",
// Interface style: "classic", "modern" (rounded cards, pill buttons) or "glass" (modern + frosted-glass panels).
    "ui": "glass",
// Immersive layer: golden landscape behind the page, soft cursor, cinematic reveals (true / false).
    "fx": true,
// Show the small "Display" style switch in the footer, so visitors can pick (true / false).
    "styleSwitch": true,
// Site design: "cinematic" (dark, image-led) or "index" (light, editorial film index).
    "layout": "cinematic",
// Colour theme: "dark" or "light".
    "theme": "dark",
// Show the sun/moon button that lets visitors switch to the light version (true / false).
    "themeToggle": true,
    "accent": "#C8A46E",
// Colour palette: "amber" (original), "forest", "lake", "laterite", "midnight", "saffron"
    "palette": "forest",
    "siteTitle": "Franco Molisho — Director · Cinematographer · Documentary Filmmaker",
    "siteDescription": "Franco Molisho is a director, cinematographer and documentary filmmaker based in Bujumbura, Burundi. Films about people, nature, and the moments that usually go unnoticed."
  },

  "person": {
    "name": "Franco Molisho",
    "title": "Director · Cinematographer · Documentary Filmmaker",
    "shortTitle": "Director · Cinematographer",
    "location": "Bujumbura, Burundi",
    "tagline": "Films about people, nature, and the moments that usually go unnoticed.",
    "experienceYears": "5+ years"
  },

  "contact": {
    "email": "francomolisho@gmail.com",
    "phone": "+257 69 15 94 10",
    "phone_link": "+25769159410",
    "instagram": "@franco_molisho",
    "instagram_url": "https://www.instagram.com/franco_molisho",
    "website": "",
    "cta": "Have a story worth being present for?",
    "ctaAccentWord": "present",
    "openTo": "Open to collaborations with documentary teams, international productions, nature and conservation organisations, labs and co-productions."
  },

// ------------------------------------------------------------------
//  WHAT I DO — the services block (built only from your verified roles)
// ------------------------------------------------------------------
  "services": [
    { "title": "Direction", "text": "Documentary and short fiction, from first idea to final cut: authored films and commissioned stories.", "items": ["Documentary", "Short fiction", "Interviews & testimonies"] },
    { "title": "Cinematography", "text": "Camera and light for documentary, institutional and travel productions, on location and in the field.", "items": ["Camera operation", "Lighting", "Field filmmaking"] },
    { "title": "Post-production", "text": "Editing and colour grading in DaVinci Resolve and Adobe Premiere Pro.", "items": ["Editing", "Colour grading"] },
    { "title": "Production & photography", "text": "Field and documentary production through BAVE PICTURES, and photography on assignment.", "items": ["Production management", "Field production", "Photography"] }
  ],
  "availableFor": ["Documentary teams", "International productions", "Nature & conservation organisations", "NGOs & institutions", "Labs & co-productions"],

// Short recognition lines shown at the bottom of the homepage hero.
  "highlights": [
    { "event": "FESTICAB 2024", "award": "Best Cinematography", "film": "Kwetu", "top": "FESTICAB 2024 · Kwetu", "main": "Best Cinematography" },
    { "event": "LOONIFF 2026", "award": "Distributor Excellence Award", "film": "Before You", "top": "LOONIFF 2026 · Before You", "main": "Distributor Excellence Award" },
    { "event": "LOONIFF 2026", "award": "Official Selection", "film": "World Premiere Films", "top": "LOONIFF 2026 · League 1", "main": "Official Selection, World Premiere Films" },
    { "event": "Institut Français du Burundi 2022", "award": "Winner", "film": "Smartphone Film Competition", "top": "Institut Français du Burundi · 2022", "main": "Winner, Smartphone Film Competition" }
  ],
// Small line above your name on the opening screen.
  "laurelsPosition": "top",
  "heroKicker": "Award-winning director & cinematographer",

  "documents": {
// Paths to downloadable PDFs placed in public/documents/ (leave "" to hide).
    "cvFull": "documents/Franco_Molisho_CV_Full.pdf",
    "cvShort": "documents/Franco_Molisho_CV_Short.pdf",
    "portfolio": ""
  },

  "hero": {
    "image": "images/hero/hero-video-poster.jpg",
// Moving background behind your name (optional). The photo above stays as the fallback.
// Use ONE of these:
//  "backgroundVideo" — a short silent loop on Vimeo or YouTube, e.g. "https://vimeo.com/123456789"
//                      (on Vimeo, the background mode needs a paid plan; check your account)
//  "video"           — a file in public/video/, e.g. "video/hero-loop.mp4" (10–20 s, under ~15 MB)
    "backgroundVideo": "",
    "video": "video/hero-loop.mp4",
// Optional lighter WebM copy of the same video (played first by browsers that support it).
    "videoWebm": "video/hero-loop.webm",
// true = the hero video keeps its soundtrack; a small Sound on/off button appears (starts muted, browsers require it).
    "videoSound": true,
    "imageNote": "Hero — film still or showreel frame · 16:9 landscape, at least 2400 px wide"
  },

  "showreel": {
// Use ONE of these when your showreel is ready:
//  embedUrl  — a YouTube or Vimeo link, e.g. "https://vimeo.com/123456789"
//  videoFile — a file in public/video/, e.g. "video/showreel.mp4"
    "embedUrl": "",
    "videoFile": "",
    "poster": "images/showreel/poster.jpg",
    "year": "2026",
    "pendingNote": "Showreel in progress"
  },

  "profile": {
    "full": "Burundi-based director and cinematographer with more than five years of experience across documentary, institutional and independent filmmaking. Has worked with the European Union in Burundi, the Institut Français du Burundi, AFJB and UNHCR, while developing personal films recognised at LOONIFF 2026 and the Institut Français du Burundi Smartphone Film Competition. Recent work in Tanzania, including On the Other Side made through AfriSos: Framing the Arc, turns toward nature, conservation and cultural heritage: observational human stories, filmed with patience and presence.",
    "short": "Burundi-based director and cinematographer with 5+ years across documentary, institutional and independent filmmaking, for the European Union, the Institut Français du Burundi, AFJB and UNHCR. Recent work turns toward nature, conservation and cultural heritage."
  },

  "about": {
    "portrait": "images/about/portrait.jpg",
    "lead": "Director and cinematographer from Burundi. I film people, nature and the moments that matter to them.",
    "paragraphs": [
      "For more than five years, I have filmed for international institutions, NGOs and travel companies, alongside my own documentaries. Whatever the project, I look for the human story at its heart and tell it with patience, care and respect for the people in front of the camera.",
      "My films have taken me across Burundi, Tanzania and the forests of DR Congo. Through my production structure, BAVE PICTURES, I work as a director, cinematographer or production lead, in French, English and Swahili."
    ],
    "interests": ["Documentary", "Nature & conservation", "Human stories", "Humanitarian & advocacy", "Cultural heritage", "Institutional films", "Travel & tourism"]
  },

  "philosophy": {
    "quoteStart": "The first spectator I see is",
    "quoteAccent": "myself.",
    "paragraphs": [
      "When I film, I don’t begin with what an audience wants to see. I ask whether this is something I would want to watch myself, whether the moment in front of the camera is worth being present for.",
      "We live surrounded by noise, always reaching for the next thing. I look for what usually goes unnoticed: a gesture, a silence, a person or a place met without judgement.",
      "My films are an invitation to stay in the present, free from who we were yesterday and from who we want to become tomorrow."
    ],
    "image": "",
// Wide photo removed at Franco's request (Oct 2026).
    "imageFocus": "50% 62%",
    "imageNote": "Wide documentary or landscape still · very wide 3.2:1 strip (e.g. 3200 × 1000 px)"
  },

// ------------------------------------------------------------------
//  FILMS — order here = order on the site.
//  To put a project forward: move its block to the top of this list.
//  "link": a Vimeo or YouTube link plays the film directly on its page;
//          any other link becomes a "Watch the film" button that opens it.
//  "featured": true  → Selected Work grid (the first one is the large lead).
//  "featured": false → "Other work".
//  "stills": up to as many as you like; missing files are skipped.
// ------------------------------------------------------------------
  "films": [
    {
      "id": "before-you",
      "title": "Before You",
      "year": "2026",
      "kind": "Documentary",
      "runtime": "14 min",
      "roles": ["Director", "Producer", "Post-production"],
      "context": "Independent film, shot in Tanzania",
      "awards": [
        { "title": "Distributor Excellence Award", "detail": "LOONIFF 2026" },
        { "title": "Official Selection", "detail": "LOONIFF 2026, League 1: World Premiere Films" }
      ],
      "synopsisLabel": "Logline",
      "synopsis": "After a childhood marked by abandonment, life on the streets, and loss, a young Tanzanian fisherman prepares to become a father, making a silent promise to break the cycle that shaped his own life.",
      "cardLine": "A young Tanzanian fisherman prepares to become a father.",
      "featured": true,
      "image": "images/before-you/main.jpg",
      "stills": [
        "images/before-you/still-01.jpg",
        "images/before-you/still-02.jpg",
        "images/before-you/still-03.jpg",
        "images/before-you/still-04.jpg",
        "images/before-you/still-05.jpg",
        "images/before-you/still-06.jpg"
      ],
      "behindTheScenes": "images/before-you/bts.jpg",
      "link": "",
      "trailer": "https://vimeo.com/1219007802",
// Shape of the video player for this film (the teaser is wider than 16:9).
      "videoRatio": "1.94 / 1"
    },
    {
      "id": "on-the-other-side",
      "title": "On the Other Side",
      "year": "2026",
      "kind": "Short documentary",
      "runtime": "4 min",
      "roles": ["Director", "Cinematographer", "Editor"],
      "context": "AfriSos: Framing the Arc, Tanzania",
      "awards": [],
      "synopsisLabel": "Logline",
      "synopsis": "A story of curiosity that became a mission. How the memory of a grandfather’s tales transformed a village child into one of Tanzania’s forest protectors.",
      "cardLine": "How a grandfather’s tales made a village child one of Tanzania’s forest protectors.",
      "featured": true,
      "image": "images/on-the-other-side/main.jpg",
// Optional: where to keep the focus when the main image is cropped wide on the film page
// ("horizontal% vertical%"; "50% 50%" = centre). Here: slightly low, to keep his boots and the stream.
      "imageFocus": "50% 85%",
      "stills": [
        "images/on-the-other-side/still-01.jpg",
        "images/on-the-other-side/still-02.jpg",
        "images/on-the-other-side/still-03.jpg",
        "images/on-the-other-side/still-04.jpg",
        "images/on-the-other-side/still-05.jpg",
        "images/on-the-other-side/still-06.jpg"
      ],
      "behindTheScenes": "images/on-the-other-side/bts.jpg",
      "link": "https://vimeo.com/1223349541",
      "trailer": ""
    },
    {
      "id": "the-bottle",
      "title": "The Bottle",
      "year": "2022",
      "kind": "Fiction short",
      "runtime": "4 min",
      "roles": ["Director", "Cinematographer", "Editor"],
      "context": "Made for the Smartphone Film Competition, Institut Français du Burundi",
      "awards": [
        { "title": "Winner", "detail": "Smartphone Film Competition 2022, Institut Français du Burundi" }
      ],
      "synopsisLabel": "About the film",
      "synopsis": "",
      "cardLine": "",
      "featured": true,
      "image": "images/the-bottle/main.jpg",
      "stills": [
        "images/the-bottle/still-01.jpg",
        "images/the-bottle/still-02.jpg",
        "images/the-bottle/still-03.jpg"
      ],
      "behindTheScenes": "",
      "link": "",
      "trailer": ""
    },
    {
      "id": "plaidoyer",
      "title": "Plaidoyer pour un amendement du Code des personnes et de la famille",
      "year": "2023",
      "kind": "Interview-based documentary",
      "runtime": "6 min",
      "roles": ["Director", "Cinematographer"],
      "context": "European Union in Burundi & partners: AFJB, Bibliothèque Sans Frontières, Terre des hommes",
// Shorter context line used on the CV only.
      "cvContext": "European Union in Burundi & partners",
      "awards": [],
      "synopsisLabel": "About the film",
      "synopsis": "Made for an advocacy panel during the 16 Days of Activism against Gender-Based Violence, calling for amendments to the Code of Persons and Family. The film gathers testimonies from women living situations that changes to the Code could address, showing the real impact of its current provisions on women and children.",
      "cardLine": "Testimonies from women whose lives are shaped by the Code of Persons and Family.",
      "featured": false,
      "image": "images/institutional-documentary/plaidoyer-main.jpg",
// Keeps the umbrella in frame when the image is cropped wide on the film page.
      "imageFocus": "50% 25%",
      "stills": [
        "images/institutional-documentary/plaidoyer-still-01.jpg",
        "images/institutional-documentary/plaidoyer-still-02.jpg",
        "images/institutional-documentary/plaidoyer-still-03.jpg"
      ],
      "behindTheScenes": "",
      "link": "https://www.facebook.com/share/v/18bGCRGgK3/",
      "trailer": ""
    },
    {
      "id": "dukingire-ibidukikije",
      "title": "Dukingire Ibidukikije: Protecting Burundi's Ecosystems",
      "year": "",
      "kind": "Documentary",
      "runtime": "13 min",
      "roles": ["Director"],
      "context": "European Union in Burundi · Programme Dukingire Ibidukikije (PDI)",
      "cvContext": "European Union in Burundi",
      "awards": [],
      "synopsisLabel": "About the film",
      "synopsis": "A documentary on the Dukingire Ibidukikije programme, which works to preserve Burundi's natural ecosystems, notably the Kibira and Rusizi National Parks, while improving the lives of the communities living around them, including displaced and returning people.",
      "cardLine": "Biodiversity, protected areas and the communities around Kibira and Rusizi.",
      "featured": false,
      "image": "images/eu-films/pdi-main.jpg",
      "imageFocus": "50% 55%",
      "stills": [
        "images/eu-films/pdi-still-01.jpg",
        "images/eu-films/pdi-still-02.jpg",
        "images/eu-films/pdi-still-03.jpg"
      ],
      "behindTheScenes": "",
      "link": "https://www.facebook.com/reel/1022209869468084",
      "trailer": ""
    },
    {
      "id": "green-diplomacy-week",
      "title": "Green Diplomacy Week",
      "year": "",
      "kind": "Event film",
      "runtime": "3 min",
      "roles": ["Director", "Cinematographer"],
      "context": "European Union in Burundi · Team Europe",
      "cvContext": "European Union in Burundi",
      "awards": [],
      "synopsisLabel": "About the film",
      "synopsis": "Team Europe opens Bujumbura's first educational trail on environmental protection in the city's public garden, together with a renovated children's playground. Slam poet Florette Dukenguruke lends her voice to the film.",
      "cardLine": "Bujumbura's first educational trail on protecting the environment.",
      "featured": false,
      "image": "images/eu-films/gdw-main.jpg",
      "imageFocus": "50% 40%",
      "stills": [
        "images/eu-films/gdw-still-01.jpg",
        "images/eu-films/gdw-still-02.jpg",
        "images/eu-films/gdw-still-03.jpg"
      ],
      "behindTheScenes": "",
      "link": "https://www.facebook.com/reel/219187674460320",
      "trailer": ""
    }
  ],

  "field": {
    "heading": "In the Field",
    "subheading": "Burundi · Tanzania · DR Congo",
    "intro": "Rivers, forests, villages and cities: the places where the work happens, and the people met along the way.",
// Every image here carries a place and a short caption, so visitors know what they are looking at.
// "focus" = which part of the photo to keep when it is cropped ("horizontal% vertical%").
    "journeys": [
      { "image": "images/nature-travel/drc-equatorial-forest.jpg", "place": "DR Congo · Equatorial forest", "caption": "Upriver by boat" },
      { "image": "images/behind-the-scenes/bts-01.jpg", "place": "DR Congo · Equatorial forest", "caption": "Mist on the river", "focus": "52% 50%" },
      { "image": "images/behind-the-scenes/bts-02.jpg", "place": "In the field", "caption": "Rain, headlamp, waiting", "focus": "62% 50%" },
      { "image": "images/nature-travel/burundi.jpg", "place": "Burundi", "caption": "Village life", "focus": "46% 50%" },
      { "image": "images/nature-travel/tanzania.jpg", "place": "Tanzania", "caption": "On the railway platform", "focus": "30% 50%" },
      { "image": "images/nature-travel/tanzania-02.jpg", "place": "Tanzania", "caption": "A greeting at the market", "focus": "50% 50%" },
      { "image": "images/nature-travel/tanzania-04.jpg", "place": "Tanzania", "caption": "City street", "focus": "45% 50%" },
      { "image": "images/nature-travel/tanzania-03.jpg", "place": "Tanzania", "caption": "Through the window of a bajaj", "focus": "52% 50%" }
    ]
  },

// ---------------------------------------------------------------------------
// TESTIMONIALS — words from people you have worked with.
// Only real quotes, approved by the person. Hidden on the site while the list is empty.
// Copy this block for each person:
//   { "quote": "…", "name": "Full name", "role": "Their role", "organization": "Organisation",
//     "project": "Project you made together", "photo": "images/testimonials/firstname.jpg" }
// Photo: a square or portrait picture of the person, at least 400 px.
  "testimonials": {
    "heading": "Kind words",
    "subheading": "From the people I have worked with",
    "items": [],
// EXAMPLES — invented, only to see the layout. Shown in the draft preview only, NEVER on the public site.
// Replace them with real testimonials in "items" above.
    "examples": [
      { "quote": "Franco has a rare patience behind the camera. He waits for the moment instead of forcing it, and it shows on screen.", "name": "Example — Name Surname", "role": "Programme officer", "organization": "Organisation", "project": "Documentary project" },
      { "quote": "Calm on set, precise in the edit, and always respectful with the people he films.", "name": "Example — Name Surname", "role": "Producer", "organization": "Organisation", "project": "Short film" },
      { "quote": "He understood what we wanted to say before we found the words for it.", "name": "Example — Name Surname", "role": "Communications lead", "organization": "Organisation", "project": "Institutional film" }
    ]
  },

// ---------------------------------------------------------------------------
// PHOTOGRAPHY — still photography series (shown as tabs, each photo opens full screen).
// Add images as { "src": "images/photography/<series>/01.jpg", "place": "…", "caption": "…" }.
// "focus" (optional) = which part to keep when cropped, e.g. "50% 40%".
// A series with no images is hidden on the public site.
  "photography": {
    "heading": "In stills",
    "subheading": "Photography",
    "intro": "Landscapes, light and everyday life in Burundi, DR Congo and Tanzania, photographed between film shoots.",
// One series per country. "title" is the name shown on the country button.
// A country with no images is hidden automatically.
    "series": [
      {
        "id": "burundi", "title": "Burundi", "client": "", "place": "", "year": "", "intro": "",
        "images": [
          {"src": "images/photography/burundi/01.jpg", "place": "Burundi", "caption": "Drummers and a dancer"},
          {"src": "images/photography/personal/01.jpg", "place": "Burundi", "caption": "Tea hills and forest", "focus": "50% 60%"},
          {"src": "images/photography/burundi/02.jpg", "place": "Burundi", "caption": "Green fields under a wide sky", "portrait": true},
          {"src": "images/photography/personal/02.jpg", "place": "Burundi", "caption": "The road through the fields", "focus": "50% 60%"},
          {"src": "images/photography/burundi/03.jpg", "place": "Burundi", "caption": "A stone church"},
          {"src": "images/photography/personal/03.jpg", "place": "Lake Tanganyika · Burundi", "caption": "A sail on the lake", "focus": "70% 60%"},
          {"src": "images/photography/burundi/04.jpg", "place": "Burundi", "caption": "Palm trees and an open field", "portrait": true},
          {"src": "images/photography/burundi/05.jpg", "place": "Burundi", "caption": "The church and its arcades"},
          {"src": "images/photography/personal/04.jpg", "place": "Burundi", "caption": "Golden hour over the hills", "focus": "50% 55%"},
          {"src": "images/photography/burundi/06.jpg", "place": "Burundi", "caption": "Inside the stone church"}
        ]
      },
      {
        "id": "dr-congo", "title": "DR Congo", "client": "", "place": "", "year": "", "intro": "",
        "images": [
          {"src": "images/photography/dr-congo/01.jpg", "place": "DR Congo", "caption": "Houses on the riverbank"},
          {"src": "images/photography/dr-congo/02.jpg", "place": "DR Congo", "caption": "A crowd gathers"},
          {"src": "images/photography/dr-congo/03.jpg", "place": "DR Congo", "caption": "A village at the forest's edge"},
          {"src": "images/photography/dr-congo/04.jpg", "place": "DR Congo", "caption": "Fish in the pan"},
          {"src": "images/photography/dr-congo/05.jpg", "place": "DR Congo", "caption": "Warehouses along the river"},
          {"src": "images/photography/dr-congo/06.jpg", "place": "DR Congo", "caption": "A hand in the red dust"}
        ]
      },
      {
        "id": "tanzania", "title": "Tanzania", "client": "", "place": "", "year": "", "intro": "",
        "images": [
          {"src": "images/photography/tanzania/01.jpg", "place": "Tanzania", "caption": "Under the flyovers", "portrait": true},
          {"src": "images/photography/tanzania/02.jpg", "place": "Tanzania", "caption": "Market umbrellas"},
          {"src": "images/photography/tanzania/03.jpg", "place": "Tanzania", "caption": "Alone on the shore", "portrait": true},
          {"src": "images/photography/tanzania/04.jpg", "place": "Tanzania", "caption": "Waiting for the train"},
          {"src": "images/photography/tanzania/05.jpg", "place": "Tanzania", "caption": "End of the jetty at dusk", "portrait": true}
        ]
      }
    ]
  },

// ---------------------------------------------------------------------------
// PARTNERS — organisations you have worked with. Each one opens its own page
// (#/partner/<id>) with images and films made together.
// "gallery": images shown on the partner page. "films": ids of films made with them.
// A partner without images or films is shown as a name only (no page yet).
  "partners": [
    { "id": "unhcr", "name": "UNHCR", "full": "UNHCR, the UN Refugee Agency · Burundi", "years": "2026", "roles": ["Photographer", "Camera Operator"],
      "intro": "Photography and filming on field missions inside Burundi.",
      "cover": "images/photography/unhcr/01.jpg", "coverFocus": "50% 50%",
      "gallery": ["images/photography/unhcr/01.jpg", "images/photography/unhcr/02.jpg", "images/photography/unhcr/03.jpg", "images/photography/unhcr/04.jpg", "images/photography/unhcr/05.jpg", "images/photography/unhcr/06.jpg", "images/photography/unhcr/07.jpg"],
      "films": [] },
    { "id": "european-union", "name": "European Union", "full": "European Union in Burundi", "years": "2022 — 2024", "roles": ["Director", "Cinematographer", "Editor"],
      "intro": "Films documenting EU-supported projects and initiatives in Burundi: advocacy, biodiversity and environmental diplomacy.",
      "cover": "images/eu-films/pdi-main.jpg", "coverFocus": "50% 55%",
      "gallery": ["images/eu-films/pdi-main.jpg", "images/eu-films/pdi-still-01.jpg", "images/eu-films/gdw-main.jpg", "images/eu-films/gdw-still-01.jpg", "images/eu-films/pdi-still-02.jpg", "images/eu-films/gdw-still-02.jpg"],
      "films": ["dukingire-ibidukikije", "green-diplomacy-week", "plaidoyer"] },
    { "id": "afjb", "name": "AFJB", "full": "Association des Femmes Juristes du Burundi", "years": "2022 — 2024", "roles": ["Director", "Cinematographer"],
      "intro": "Including Plaidoyer, an advocacy film calling for an amendment to the Code of Persons and Family.",
      "cover": "images/institutional-documentary/plaidoyer-main.jpg", "coverFocus": "50% 25%",
      "gallery": ["images/institutional-documentary/plaidoyer-main.jpg", "images/institutional-documentary/plaidoyer-still-01.jpg", "images/institutional-documentary/plaidoyer-still-02.jpg", "images/institutional-documentary/plaidoyer-still-03.jpg"],
      "films": ["plaidoyer"] },
    { "id": "ifb", "name": "Institut Français du Burundi", "full": "Institut Français du Burundi", "years": "2022 — 2024", "roles": ["Director", "Cinematographer"],
      "intro": "", "cover": "", "gallery": [], "films": [] },
    { "id": "kivu-travel", "name": "Kivu Travel", "full": "Kivu Travel", "years": "2024 — 2026", "roles": ["Director", "Cinematographer"],
      "intro": "Travel and tourism films in Burundi and DR Congo, including river journeys through the equatorial forest.",
      "cover": "images/nature-travel/drc-equatorial-forest.jpg", "coverFocus": "50% 55%",
      "gallery": ["images/nature-travel/drc-equatorial-forest.jpg", "images/behind-the-scenes/bts-01.jpg"], "films": [],
      "videos": [{ "title": "Burundi", "embed": "https://www.instagram.com/p/DfRcoEmjKS5/embed/", "link": "https://www.instagram.com/p/DfRcoEmjKS5/" }] }
  ],

  "experience": [
    { "years": "2026", "org": "UNHCR Burundi", "roles": ["Photographer", "Camera Operator"], "note": "Field missions inside Burundi" },
    { "years": "2024–2026", "org": "Kivu Travel", "roles": ["Director", "Cinematographer"], "note": "Travel and tourism films" },
    { "years": "2022–2026", "org": "BAVE PICTURES", "roles": ["Production Manager", "Cinematographer"], "note": "Own production structure" },
    { "years": "2022–2024", "org": "European Union in Burundi", "roles": ["Director", "Cinematographer", "Editor"], "note": "Films documenting EU-supported projects and initiatives in Burundi" },
    { "years": "2022–2024", "org": "Institut Français du Burundi", "roles": ["Director", "Cinematographer"], "note": "" },
    { "years": "2022–2024", "org": "Association des Femmes Juristes du Burundi", "roles": ["Director", "Cinematographer"], "note": "" }
  ],

// Stills from commissioned and institutional work, shown under Experience.
// Captions should only name the organisation unless you add verified detail.
  "commissionedGallery": [
    { "image": "images/institutional-documentary/inst-01.jpg", "caption": "Institutional documentary", "focus": "22% 50%" },
    { "image": "images/institutional-documentary/inst-02.jpg", "caption": "Institutional documentary", "focus": "88% 50%" },
    { "image": "images/institutional-documentary/inst-03.jpg", "caption": "Institutional documentary", "focus": "36% 50%" }
  ],

  "recognition": [
    { "year": "2024", "title": "Best Cinematography", "detail": "FESTICAB 2024", "film": "Kwetu, by Lionel Setoukourou" },
    { "year": "2026", "title": "Distributor Excellence Award", "detail": "LOONIFF 2026", "film": "Before You" },
    { "year": "2026", "title": "Official Selection", "detail": "LOONIFF 2026, League 1: World Premiere Films", "film": "Before You" },
    { "year": "2022", "title": "Winner, Smartphone Film Competition", "detail": "Institut Français du Burundi", "film": "The Bottle" }
  ],

  "training": [
    { "year": "2026", "title": "AfriSos: Framing the Arc", "detail": "Selected participant · nature, conservation and storytelling programme, Tanzania" },
    { "year": "", "title": "Short Film Directing Training", "detail": "With Toumani Sangaré, Director of École Kourtrajmé, Dakar" }
  ],

  "skills": {
    "Creative": ["Direction", "Documentary Filmmaking", "Visual Storytelling", "Storytelling"],
    "Technical": ["Cinematography", "Camera Operation", "Lighting", "Editing", "Colour Grading"],
    "Production": ["Production Management", "On-set Direction", "Field Production", "Documentary Production"]
  },

  "languages": [
    { "name": "French", "level": "Fluent" },
    { "name": "English", "level": "Intermediate" },
    { "name": "Swahili", "level": "Intermediate" },
    { "name": "Kirundi", "level": "Basic" }
  ],

  "software": [
    { "name": "DaVinci Resolve", "level": "" },
    { "name": "Adobe Premiere Pro", "level": "" },
    { "name": "Adobe After Effects", "level": "Basic" }
  ],

// Used only by the CV PDFs in /pdf.
  "cv": {
    "headerStill": "images/before-you/main.jpg",
    "headerStillLabel": "Film still · Before You · 2026",
    "highlightTop": "LOONIFF 2026 · Before You",
    "highlightMain": "Distributor Excellence Award"
  },

  "footer": {
    "production": "A BAVE PICTURES production"
  }
};
