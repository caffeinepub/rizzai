export interface Match {
  id: string;
  name: string;
  age: number;
  bio: string;
  compatibility: number;
  photo: string;
  interests: string[];
  connected: boolean;
  // Discover fields
  trustScore: number;
  lastActive: Date;
  isComplete: boolean;
  responseTimeMinutes: number;
  completedChats: number;
  isNearby: boolean;
  isNew: boolean;
  gender: "woman" | "man" | "nonbinary";
  lookingFor: ("woman" | "man" | "nonbinary")[];
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  match: {
    id: string;
    name: string;
    photo: string;
  };
  messages: Message[];
  lastMessage: string;
  lastTime: string;
  unread: number;
}

const now = Date.now();

export const MOCK_MATCHES: Match[] = [
  {
    id: "1",
    name: "Sarah Chen",
    age: 24,
    bio: "Coffee-fueled designer who gets lost in bookstores. Lover of late-night conversations.",
    compatibility: 94,
    photo: "/assets/generated/avatar-sarah.dim_200x200.jpg",
    interests: ["Design", "Coffee", "Books", "Travel"],
    connected: false,
    trustScore: 92,
    lastActive: new Date(now - 2 * 60 * 1000), // 2 min ago
    isComplete: true,
    responseTimeMinutes: 4,
    completedChats: 18,
    isNearby: true,
    isNew: false,
    gender: "woman",
    lookingFor: ["man", "nonbinary"],
  },
  {
    id: "2",
    name: "Maya Patel",
    age: 23,
    bio: "Startup founder by day, terrible chef by night. Always planning the next adventure.",
    compatibility: 88,
    photo: "/assets/generated/avatar-maya.dim_200x200.jpg",
    interests: ["Startups", "Hiking", "Cooking", "Music"],
    connected: false,
    trustScore: 85,
    lastActive: new Date(now - 35 * 60 * 1000), // 35 min ago
    isComplete: true,
    responseTimeMinutes: 12,
    completedChats: 14,
    isNearby: false,
    isNew: false,
    gender: "woman",
    lookingFor: ["man"],
  },
  {
    id: "3",
    name: "Zoe Williams",
    age: 25,
    bio: "Photographer chasing golden hour. Film nerd & vintage vinyl collector.",
    compatibility: 82,
    photo: "/assets/generated/avatar-zoe.dim_200x200.jpg",
    interests: ["Photography", "Film", "Vinyl", "Art"],
    connected: false,
    trustScore: 78,
    lastActive: new Date(now - 3 * 60 * 60 * 1000), // 3h ago
    isComplete: true,
    responseTimeMinutes: 22,
    completedChats: 9,
    isNearby: true,
    isNew: false,
    gender: "woman",
    lookingFor: ["man", "nonbinary"],
  },
  {
    id: "4",
    name: "Priya Sharma",
    age: 22,
    bio: "Med student obsessed with true crime podcasts. Will debate you on the best street tacos.",
    compatibility: 79,
    photo: "",
    interests: ["Medicine", "True Crime", "Tacos", "Yoga"],
    connected: false,
    trustScore: 96,
    lastActive: new Date(now - 1 * 60 * 1000), // 1 min ago — active now
    isComplete: true,
    responseTimeMinutes: 3,
    completedChats: 20,
    isNearby: false,
    isNew: false,
    gender: "woman",
    lookingFor: ["man"],
  },
  {
    id: "5",
    name: "Ava Nguyen",
    age: 26,
    bio: "Frontend dev by day, amateur ceramicist by weekend. Currently perfecting matcha latte art.",
    compatibility: 91,
    photo: "",
    interests: ["Tech", "Ceramics", "Matcha", "UX"],
    connected: false,
    trustScore: 89,
    lastActive: new Date(now - 20 * 60 * 1000), // 20 min ago
    isComplete: true,
    responseTimeMinutes: 8,
    completedChats: 16,
    isNearby: true,
    isNew: false,
    gender: "nonbinary",
    lookingFor: ["man", "woman", "nonbinary"],
  },
  {
    id: "6",
    name: "Leila Haddad",
    age: 24,
    bio: "Journalist who interviews interesting humans for fun. Jazz bar regular. Perpetually over-caffeinated.",
    compatibility: 76,
    photo: "",
    interests: ["Journalism", "Jazz", "Writing", "Politics"],
    connected: false,
    trustScore: 74,
    lastActive: new Date(now - 5 * 60 * 60 * 1000), // 5h ago
    isComplete: true,
    responseTimeMinutes: 45,
    completedChats: 7,
    isNearby: false,
    isNew: true,
    gender: "woman",
    lookingFor: ["man", "nonbinary"],
  },
  {
    id: "7",
    name: "Chloe Martin",
    age: 21,
    bio: "Art student who paints murals and collects stray cats. Chronic night owl.",
    compatibility: 68,
    photo: "",
    interests: ["Art", "Cats", "Murals", "Night"],
    connected: false,
    trustScore: 62,
    lastActive: new Date(now - 2 * 24 * 60 * 60 * 1000), // 2d ago
    isComplete: false,
    responseTimeMinutes: 90,
    completedChats: 3,
    isNearby: true,
    isNew: true,
    gender: "woman",
    lookingFor: ["man"],
  },
  {
    id: "8",
    name: "Sofia Torres",
    age: 27,
    bio: "Yoga teacher & travel blogger. Currently planning a solo trip across Central Asia.",
    compatibility: 84,
    photo: "",
    interests: ["Yoga", "Travel", "Blogging", "Cooking"],
    connected: false,
    trustScore: 88,
    lastActive: new Date(now - 45 * 60 * 1000), // 45 min ago
    isComplete: true,
    responseTimeMinutes: 15,
    completedChats: 12,
    isNearby: false,
    isNew: false,
    gender: "woman",
    lookingFor: ["man", "nonbinary"],
  },
  {
    id: "9",
    name: "Emma Li",
    age: 23,
    bio: "Just joined! Music producer learning to surf. Probably listening to something experimental rn.",
    compatibility: 72,
    photo: "",
    interests: ["Music", "Surfing", "Production", "Electronic"],
    connected: false,
    trustScore: 70,
    lastActive: new Date(now - 3 * 60 * 1000), // 3 min ago
    isComplete: true,
    responseTimeMinutes: 6,
    completedChats: 1,
    isNearby: true,
    isNew: true,
    gender: "woman",
    lookingFor: ["man", "nonbinary"],
  },
  {
    id: "10",
    name: "Nadia Kowalski",
    age: 28,
    bio: "Data scientist & amateur sommelier. I'll find patterns in your wine preferences.",
    compatibility: 87,
    photo: "",
    interests: ["Data", "Wine", "Running", "Sci-fi"],
    connected: false,
    trustScore: 91,
    lastActive: new Date(now - 15 * 60 * 1000), // 15 min ago
    isComplete: true,
    responseTimeMinutes: 9,
    completedChats: 17,
    isNearby: false,
    isNew: false,
    gender: "woman",
    lookingFor: ["man"],
  },
  {
    id: "11",
    name: "Jasmine Park",
    age: 22,
    bio: "K-drama addict and aspiring UX researcher. Will recommend you a show that ruins you.",
    compatibility: 81,
    photo: "",
    interests: ["K-Drama", "UX", "Design", "Anime"],
    connected: false,
    trustScore: 80,
    lastActive: new Date(now - 2 * 60 * 60 * 1000), // 2h ago
    isComplete: true,
    responseTimeMinutes: 18,
    completedChats: 10,
    isNearby: true,
    isNew: false,
    gender: "woman",
    lookingFor: ["man", "nonbinary"],
  },
  {
    id: "12",
    name: "Riley Morgan",
    age: 25,
    bio: "Environmental lawyer turned urban farmer. Growing heirlooms on a rooftop in Brooklyn.",
    compatibility: 77,
    photo: "",
    interests: ["Environment", "Farming", "Law", "Gardening"],
    connected: false,
    trustScore: 83,
    lastActive: new Date(now - 4 * 60 * 1000), // 4 min ago
    isComplete: true,
    responseTimeMinutes: 11,
    completedChats: 8,
    isNearby: false,
    isNew: true,
    gender: "nonbinary",
    lookingFor: ["man", "woman", "nonbinary"],
  },
];

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "c1",
    match: {
      id: "1",
      name: "Sarah Chen",
      photo: "/assets/generated/avatar-sarah.dim_200x200.jpg",
    },
    messages: [
      {
        id: "m1",
        senderId: "1",
        text: "Hey! I saw you're into coffee too ☕",
        timestamp: new Date(Date.now() - 3600000 * 2),
      },
      {
        id: "m2",
        senderId: "me",
        text: "Yes! I'm basically running on espresso. Do you have a favorite spot?",
        timestamp: new Date(Date.now() - 3600000 * 1.5),
      },
      {
        id: "m3",
        senderId: "1",
        text: "There's this tiny hidden gem in SoHo — no wifi, just vibes and pour-overs 😄",
        timestamp: new Date(Date.now() - 3600000),
      },
      {
        id: "m4",
        senderId: "me",
        text: "No wifi sounds like heaven honestly",
        timestamp: new Date(Date.now() - 1800000),
      },
      {
        id: "m5",
        senderId: "1",
        text: "We should check it out sometime ✨",
        timestamp: new Date(Date.now() - 900000),
      },
    ],
    lastMessage: "We should check it out sometime ✨",
    lastTime: "15m",
    unread: 1,
  },
  {
    id: "c2",
    match: {
      id: "2",
      name: "Maya Patel",
      photo: "/assets/generated/avatar-maya.dim_200x200.jpg",
    },
    messages: [
      {
        id: "m6",
        senderId: "me",
        text: "Your startup idea sounds really interesting!",
        timestamp: new Date(Date.now() - 3600000 * 5),
      },
      {
        id: "m7",
        senderId: "2",
        text: "Thanks! It's still early days but the traction is wild 🚀",
        timestamp: new Date(Date.now() - 3600000 * 4.5),
      },
      {
        id: "m8",
        senderId: "2",
        text: "What do you do?",
        timestamp: new Date(Date.now() - 3600000 * 4),
      },
    ],
    lastMessage: "What do you do?",
    lastTime: "4h",
    unread: 1,
  },
  {
    id: "c3",
    match: {
      id: "3",
      name: "Zoe Williams",
      photo: "/assets/generated/avatar-zoe.dim_200x200.jpg",
    },
    messages: [
      {
        id: "m9",
        senderId: "3",
        text: "I love your taste in music btw",
        timestamp: new Date(Date.now() - 3600000 * 24),
      },
      {
        id: "m10",
        senderId: "me",
        text: "Ha thanks! Always looking for new recommendations 🎵",
        timestamp: new Date(Date.now() - 3600000 * 23),
      },
    ],
    lastMessage: "Ha thanks! Always looking for new recommendations 🎵",
    lastTime: "1d",
    unread: 0,
  },
];

export const AI_RIZZ_TIPS: Record<string, string[]> = {
  c1: [
    "Ask about her most memorable bookstore find — it'll reveal what she truly loves",
    "Share your own coffee ritual — makes you relatable and opens a deeper convo",
    "Playfully challenge her: 'Bet I can find a better hidden gem'",
  ],
  c2: [
    "Show genuine curiosity about her startup's problem space, not just the idea",
    "Mention something you've built or created — creates mutual respect",
    "Use light humor: 'I'm a professional coffee tester between meetings'",
  ],
  c3: [
    "Ask what song she'd play on a long road trip — reveals her mood",
    "Share a vinyl recommendation — makes the exchange feel personal",
    "Say 'Let me know if you want to swap playlists sometime' — low-pressure next step",
  ],
};
