/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// SINGLE SOURCE OF TRUTH FOR ALL EDITABLE BIRTHDAY EXPERIENCE CONTENT

export const CELEBRATION_CONFIG = {
  celebrantName: "Sarah",
  targetPassword: "01012003",
  passwordDisplayHint: "Sarah's exact birthday (DDMMYYYY - try 01012003)",
  birthYear: "2003",
  birthDateFormatted: "January 1st, 2003",
  letterSpillHeading: "Sarah's Vault of Infinite Moments",
  ambientLetterOverlay:
    "Let the nostalgic melodies guide you through memories.",
};

export const INSTALLED_ASSETS = {
  vaultPolaroid: "/src/assets/images/entry_vault_polaroid_1780741221392.png",
  luxuryMeshBg: "/src/assets/images/luxury_mesh_bg_1780741238053.png",
  interactiveCake: "/src/assets/images/cake_3d_1780741249999.png", // fallback or actual
  interactiveCakeBespoke: "/src/assets/images/cake_3d_1780741254086.png",
};

export interface MemoryType {
  id: number;
  date: string;
  title: string;
  message: string;
  photoUrl: string;
  voiceNoteUrl?: string;
  voiceNoteDuration?: string;
  moodColor: string;
}

export const TIMELINE_MEMORIES: MemoryType[] = [
  {
    id: 1,
    date: "August 12, 2012",
    title: "Summer Beach Golden Hour",
    message:
      "Remember when we got drenched in the sudden coastal rain? Our shoes were completely ruined, but we laughed until our stomachs hurt. Here is to endless summer skies and matching messy hair.",
    photoUrl:
      "https://images.unsplash.com/photo-1481988535861-271139e0646c?q=80&w=800",
    voiceNoteDuration: "0:45",
    moodColor: "from-amber-100 to-amber-200",
  },
  {
    id: 2,
    date: "December 24, 2016",
    title: "The Tiny Cafe in the Snow",
    message:
      "We found that little basement coffee library with the creaky stools. We spent hours sharing a single peppermint mocha, sketching scribbles on paper napkins. That napkin is still tucked in my book.",
    photoUrl:
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=800",
    voiceNoteDuration: "1:12",
    moodColor: "from-blue-100 to-blue-200",
  },
  {
    id: 3,
    date: "October 04, 2020",
    title: "Our Famous Midnight Baking Disaster",
    message:
      "You wanted to bake chocolate chip soufflé at 2:00 AM. It rose perfectly... and then collapsed into a tragic volcano of fudge. It tasted absolutely incredible anyway.",
    photoUrl:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800",
    voiceNoteDuration: "0:28",
    moodColor: "from-rose-100 to-rose-200",
  },
  {
    id: 4,
    date: "May 18, 2023",
    title: "The Spontaneous Sunset Drive",
    message:
      "We skipped the formal gala, drove up the dirt road to Sunrise Peak, and watched the valley lights hum to life. That day we promised to never grow dull. Happy memories, sweet friend.",
    photoUrl:
      "https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=800",
    voiceNoteDuration: "1:35",
    moodColor: "from-emerald-100 to-emerald-200",
  },
];

export interface SealedLetter {
  id: number;
  senderName: string;
  relationshipName: string;
  shortExcerpt: string;
  fullHandwrittenMessage: string;
  envelopeColor: string; // Tailwind bg styles
  stampEmoji: string;
}

export const SECRETS_ENVELOPES: SealedLetter[] = [
  {
    id: 1,
    senderName: "Marcus (Your Bestie)",
    relationshipName: "Best Friend & Backseat Driver",
    shortExcerpt:
      "Sarah, we share a thousand stupid jokes, but here is a little piece of my true gratitude...",
    fullHandwrittenMessage:
      "Dear Sarah,\n\nHappy Birthday! Honestly, looking back at all the chaos we've been through since high school, I have no idea how we survived without any major incidents.\n\nYou have this incredible light to make any terrible situation feel like an adventure. Thank you for listening to my dumb podcasts, pulling me out of creative ruts, and always being down for spontaneous food runs.\n\nKeep being the absolute force of nature that you are. Have the most wonderful year!\n\nLove always,\nMarcus",
    envelopeColor: "bg-indigo-950 border-indigo-400 text-indigo-100",
    stampEmoji: "🌌",
  },
  {
    id: 2,
    senderName: "Oliva (Your Sister)",
    relationshipName: "Sister & Eternal Closet Raider",
    shortExcerpt:
      "To my favorite person since childhood. Click to unfold the letters we never spoke out loud...",
    fullHandwrittenMessage:
      "To my sweet Sarah,\n\nFrom building fortresses out of couch cushions to sharing skincare emergencies, you've been my constant anchor.\n\nI don't say it enough, but I'm incredibly proud of the woman you are becoming. Your resilience, your kindness, and even your ridiculously loud laughs are precious.\n\nMay this year bring you all the warmth, croissants, and slow mornings you deserve!\n\nForever yours,\nOlivia 💖",
    envelopeColor: "bg-amber-950 border-amber-500 text-amber-100",
    stampEmoji: "🌻",
  },
  {
    id: 3,
    senderName: "The Adventure Crew",
    relationshipName: "Road-trip Co-conspirators",
    shortExcerpt:
      "A tiny collective message signed by the group. Packed with secrets from the wilderness...",
    fullHandwrittenMessage:
      "Hey Sarah!\n\nThe crew compiled a list of words that define you:\n\n1. Spontaneous (Remember climbing that fence?)\n2. Extremely determined (Especially when there is Boba involved)\n3. Generous beyond measure.\n\nThis year's birthday present is simple: We promise to let you pick the playlist on our next road-trip without any complaints, and we'll even cover the midnight waffle run!\n\nYou're the absolute glue of our circle. Stay gold!\n\n- Daniel, Chloe, Tyler & Sam",
    envelopeColor: "bg-teal-950 border-teal-400 text-teal-100",
    stampEmoji: "🛩️",
  },
];

export interface FloatingPhotoType {
  id: number;
  photoUrl: string;
  title: string;
  subtitle: string;
  depth: "back" | "mid" | "fore";
  top: string; // styling percentage
  left: string; // styling percentage
  rotation: number; // degrees for natural look
}

export const FLOATING_ROOM_PHOTOS: FloatingPhotoType[] = [
  {
    id: 1,
    photoUrl:
      "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=500",
    title: "Neon Concert Magic",
    subtitle: "We stood on our tiptoes and sang all verses",
    depth: "back",
    top: "10%",
    left: "15%",
    rotation: -12,
  },
  {
    id: 2,
    photoUrl:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=500",
    title: "Lakeside Sunset Camp",
    subtitle: "Smelled of pine cones and giant roasted marshmallows",
    depth: "mid",
    top: "18%",
    left: "65%",
    rotation: 8,
  },
  {
    id: 3,
    photoUrl:
      "https://images.unsplash.com/photo-1461151304267-38535e780c79?q=80&w=500",
    title: "Laughter in retro booths",
    subtitle: "Polaroids holding wet ink details",
    depth: "fore",
    top: "42%",
    left: "5%",
    rotation: -5,
  },
  {
    id: 4,
    photoUrl:
      "https://images.unsplash.com/photo-1511988617509-a57c8a288659?q=80&w=500",
    title: "New Year's Eve Sparklers",
    subtitle: "Writing wishes with golden trails in the winter cold",
    depth: "fore",
    top: "55%",
    left: "75%",
    rotation: 15,
  },
  {
    id: 5,
    photoUrl:
      "https://images.unsplash.com/photo-1473177104440-ffee2f376098?q=80&w=500",
    title: "Quiet Bookshop Coffee",
    subtitle: "Reading and listening to soft vinyl static",
    depth: "mid",
    top: "35%",
    left: "40%",
    rotation: -3,
  },
  {
    id: 6,
    photoUrl:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=500",
    title: "Under Aurora Skies",
    subtitle: "A digital canvas of dream wishes we drew",
    depth: "back",
    top: "70%",
    left: "48%",
    rotation: 6,
  },
];

export interface TrackType {
  id: number;
  title: string;
  artist: string;
  coverUrl: string;
  audioUrl: string;
}

export const PLAYLIST_SONGS: TrackType[] = [
  {
    id: 1,
    title: "Nostalgic Meadows (Violin & Piano)",
    artist: "Acoustic Memories Collective",
    coverUrl:
      "https://images.unsplash.com/photo-1513829096999-4978602294fc?q=80&w=150",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: 2,
    title: "Midnight Coziness (Lofi Guitar)",
    artist: "Dreamscape Symphony",
    coverUrl:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=150",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    id: 3,
    title: "Warm Cocoa & Vinyl Echoes",
    artist: "Whisperers of Chill",
    coverUrl:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=150",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
  },
  {
    id: 4,
    title: "Golden Hour Flight path",
    artist: "Cinematic Ambient Project",
    coverUrl:
      "https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=150",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
  },
];

export const CAKE_MOMENTS = {
  mainCall: "Cut Sarah's Birthday Cake",
  helperDragText:
    "Drag your digital knife (which represents your index cut) horizontally across the white cutting line to unlock celebration fireworks!",
  cheerPhrase:
    "Blow a wish, slice into the frosting, and begin the new chapter!",
  finalBlessing:
    "Every memory shared is a precious stone in our crowns. Happy Birthday Sarah, the world is incomparably brighter with your warmth in it! ❤️",
};
