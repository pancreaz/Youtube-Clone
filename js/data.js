/**
 * YOUTUBE ULTRA - INITIAL MOCK DATASET & STORAGE CONTROLLER
 */

const INITIAL_VIDEOS = [
  {
    id: "v1",
    title: "Talking Tech and AI with Google CEO Sundar Pichai!",
    channel: "Marques Brownlee",
    channelAvatar: "images/channel-1.jpeg",
    subscribers: "18.5M",
    verified: true,
    thumbnail: "images/thumbnail-1.webp",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    views: "3.4M",
    timestamp: "6 months ago",
    category: "Tech & AI",
    duration: "14:20",
    likes: "245K",
    dislikes: "2.1K",
    description: `We sat down with Google CEO Sundar Pichai to discuss the future of AI, Gemini models, Quantum computing, and where smartphone tech is headed next!

00:00 - Introduction & AI Overview
03:15 - Gemini Models & Quantum Computing
07:45 - Hardware vs Software Synergy
11:30 - Future of Smartphones

#Tech #AI #Google #MHD #SundarPichai #FutureTech`,
    comments: [
      { id: "c1", author: "Alex Tech", avatar: "images/channel-2.jpeg", text: "Sundar's insights on AI integration in everyday consumer tech were mind blowing! Fantastic interview Marques.", time: "4 months ago", likes: 1420 },
      { id: "c2", author: "CodeCraft", avatar: "images/channel-1.jpeg", text: "The editing quality on MKBHD videos is unmatched. Crisp 4K perfection as always.", time: "5 months ago", likes: 890 }
    ]
  },
  {
    id: "v2",
    title: "Try Not To Laugh Challenge #9",
    channel: "Markiplier",
    channelAvatar: "images/channel-2.jpeg",
    subscribers: "36.2M",
    verified: true,
    thumbnail: "images/thumbnail-2.webp",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    views: "19M",
    timestamp: "4 years ago",
    category: "Gaming",
    duration: "12:45",
    likes: "1.1M",
    dislikes: "12K",
    description: `Try not to laugh challenge #9! Can we make it through without losing our minds? Leave a like if you enjoyed and subscribe for more content!

#Gaming #Funny #TryNotToLaugh #Markiplier`,
    comments: [
      { id: "c3", author: "GamerBro99", avatar: "images/channel-1.jpeg", text: "Timestamp 04:12 had me wheezing uncontrollably! Classic Markiplier energy.", time: "2 years ago", likes: 3500 }
    ]
  },
  {
    id: "v3",
    title: "HTML & CSS Full Course - Beginner to Pro (2026 Edition)",
    channel: "SuperSimpleDev",
    channelAvatar: "images/channel-1.jpeg",
    subscribers: "1.4M",
    verified: true,
    thumbnail: "images/10a-BeOsxyC_.png",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    views: "1.2M",
    timestamp: "2 months ago",
    category: "Coding",
    duration: "6:30:15",
    likes: "98K",
    dislikes: "450",
    description: `Learn HTML and CSS from scratch! Complete beginner course covering flexbox, grid, animations, responsive design, and real-world handcrafted projects.

00:00 - HTML Basics
45:00 - CSS Styling & Box Model
01:30:00 - Flexbox Layouts
02:45:00 - CSS Grid & Responsive Design
04:15:00 - Building YouTube Clone UI

#HTML #CSS #WebDev #Coding #SuperSimpleDev`,
    comments: [
      { id: "c4", author: "DevNewbie", avatar: "images/channel-2.jpeg", text: "This single course helped me land my first Junior Frontend Developer role! Thank you so much!", time: "1 month ago", likes: 620 }
    ]
  },
  {
    id: "v4",
    title: "Lo-Fi Coding Beats - Chill Study & Relaxation Music",
    channel: "Lofi Girl",
    channelAvatar: "images/channel-2.jpeg",
    subscribers: "14.1M",
    verified: true,
    thumbnail: "images/10b-tbv3K7R4.png",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    views: "45M",
    timestamp: "1 year ago",
    category: "Lo-Fi Beats",
    duration: "24:00",
    likes: "2.4M",
    dislikes: "5K",
    description: `Peaceful lo-fi hip hop beats to study, code, work, and relax to. Continuous chill ambient sounds for deep focus and flow state.

#Lofi #ChillBeats #Focus #StudyMusic #CodingBeats`,
    comments: [
      { id: "c5", author: "NightCoder", avatar: "images/channel-1.jpeg", text: "Late night debugging with this track playing in the background is top tier cozy.", time: "8 months ago", likes: 1840 }
    ]
  },
  {
    id: "v5",
    title: "Building an Autonomous AI Agent in 20 Minutes!",
    channel: "TechLead",
    channelAvatar: "images/channel-1.jpeg",
    subscribers: "1.5M",
    verified: true,
    thumbnail: "images/10c-ZtQGOU8r.png",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    views: "890K",
    timestamp: "3 weeks ago",
    category: "Tech & AI",
    duration: "18:05",
    likes: "64K",
    dislikes: "1.2K",
    description: `How to build your own AI coding assistant and agentic workflow using standard JavaScript APIs and modern frameworks. Step by step architecture setup!

#AI #Agent #JavaScript #FutureTech #ExGoogle`,
    comments: []
  },
  {
    id: "v6",
    title: "Top 10 Modern CSS Tricks You Didn't Know Existed",
    channel: "Kevin Powell",
    channelAvatar: "images/channel-2.jpeg",
    subscribers: "920K",
    verified: true,
    thumbnail: "images/10d-CXAvncgB.png",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyTouches.mp4",
    views: "540K",
    timestamp: "1 month ago",
    category: "Design",
    duration: "15:40",
    likes: "42K",
    dislikes: "180",
    description: `Explore subgrid, container queries, light-dark(), scroll-driven animations, and CSS anchor positioning! Modern CSS is incredibly powerful.

#CSS #WebDesign #Frontend #KevinPowell #WebDev`,
    comments: []
  },
  {
    id: "v7",
    title: "Cyberpunk 2077 - Next-Gen Path Tracing Gameplay 4K",
    channel: "Digital Foundry",
    channelAvatar: "images/channel-1.jpeg",
    subscribers: "1.3M",
    verified: true,
    thumbnail: "images/thumbnail-1.webp",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    views: "2.1M",
    timestamp: "8 months ago",
    category: "Gaming",
    duration: "22:10",
    likes: "115K",
    dislikes: "900",
    description: `Deep dive technical analysis of real-time path tracing, DLSS 3.5 frame generation, and next-gen rendering hardware benchmark results.

#Gaming #Cyberpunk #RayTracing #DigitalFoundry`,
    comments: []
  },
  {
    id: "v8",
    title: "Minimalist Workspace Setup Tour & Productivity Desk 2026",
    channel: "MKBHD Studio",
    channelAvatar: "images/channel-2.jpeg",
    subscribers: "18.5M",
    verified: true,
    thumbnail: "images/thumbnail-2.webp",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    views: "4.8M",
    timestamp: "5 months ago",
    category: "Design",
    duration: "11:15",
    likes: "310K",
    dislikes: "1.5K",
    description: `A full walkthrough of my custom cable-managed desk setup, OLED monitor, custom mechanical keyboards, and acoustic studio treatment.

#DeskSetup #Minimalism #Productivity #TechTour`,
    comments: []
  }
];

const INITIAL_SHORTS = [
  {
    id: "s1",
    title: "CSS Grid vs Flexbox in 30 Seconds! ⚡ #shorts #webdev",
    channel: "SuperSimpleDev",
    channelAvatar: "images/channel-1.jpeg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    likes: "452K",
    commentsCount: "3.2K"
  },
  {
    id: "s2",
    title: "Unboxing the 1000fps High Speed Camera! 🎥 #mkbhd",
    channel: "Marques Brownlee",
    channelAvatar: "images/channel-2.jpeg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
    likes: "890K",
    commentsCount: "8.5K"
  },
  {
    id: "s3",
    title: "Satisfying Custom Mechanical Keyboard Sound Test ⌨️",
    channel: "KeyCraft",
    channelAvatar: "images/channel-1.jpeg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    likes: "1.2M",
    commentsCount: "14K"
  }
];

const CATEGORIES = [
  "All",
  "Tech & AI",
  "Coding",
  "Gaming",
  "Lo-Fi Beats",
  "Shorts",
  "Design",
  "Music",
  "Recently Uploaded",
  "Liked Videos",
  "Watch Later"
];
