import { User, Hash, Link2, FileText, MessageSquare } from "lucide-react"

export type StoryType = 'social' | 'creator' | 'student' | 'gaming' | 'travel' | 'coding' | 'journal'
export type ContextType = 'user' | 'thread' | 'topic' | 'file' | 'link'

export const STORY_TYPES: { value: StoryType; label: string }[] = [
  { value: 'social', label: 'social' },
  { value: 'creator', label: 'creator' },
  { value: 'student', label: 'student' },
  { value: 'gaming', label: 'gaming' },
  { value: 'travel', label: 'travel' },
  { value: 'coding', label: 'coding' },
  { value: 'journal', label: 'journal' }
] as const

export const CONTEXT_TYPES: ContextType[] = ['user', 'thread', 'topic', 'file', 'link'] as const

export const CONTEXT_PREVIEWS = {
  social: {
    user: {
      title: "Kai Chen",
      preview: "Music Curator · Festival Enthusiast",
      metadata: { 
        author: "kai@enso.chat",
        date: "Active now",
        avatar: "/avatars/kai.jpg",
        status: "online",
        bio: "living for the music 🎵"
      }
    },
    thread: {
      title: "festival-memories",
      preview: "coachella 2023 photo dump & highlights",
      metadata: { 
        author: "Started by Emma",
        date: "Last year",
        participants: 5,
        photos: 42,
        lastActive: "2 hours ago",
        pinned: true
      }
    },
    topic: {
      title: "festival-fits",
      preview: "outfit planning & style ideas",
      metadata: { 
        author: "15 contributors",
        date: "Active now",
        posts: 128,
        images: 56,
        lastUpdate: "5 min ago",
        trending: true
      }
    },
    file: {
      title: "packing-list.pdf",
      preview: "everything you need for the weekend",
      metadata: { 
        size: "1.2 MB",
        date: "Updated today",
        type: "PDF",
        pages: 3,
        author: "Emma",
        downloads: 8
      }
    },
    link: {
      title: "Set Times",
      preview: "Weekend 1 full schedule & map",
      metadata: { 
        url: "https://coachella.com/schedule",
        date: "Live updates",
        type: "Schedule",
        source: "Coachella Official",
        lastSync: "2 min ago",
        external: true
      }
    }
  },
  creator: {
    user: {
      title: "Mia Zhang",
      preview: "Art Director · Visual Designer",
      metadata: { author: "mia@enso.chat", date: "In design review" }
    },
    thread: {
      title: "Brand Evolution",
      preview: "Visual identity and style exploration for 2024",
      metadata: { author: "Design Team", date: "Updated today" }
    },
    topic: {
      title: "visual-language",
      preview: "Our evolving design system and principles",
      metadata: { author: "8 contributors", date: "Active discussion" }
    },
    file: {
      title: "mood-board-v2.pdf",
      preview: "Visual direction and style guide",
      metadata: { size: "2.4 MB", date: "Added yesterday" }
    },
    link: {
      title: "Design System",
      preview: "Living documentation of our visual language",
      metadata: { url: "design.enso.chat", date: "Updated today" }
    }
  },
  student: {
    user: {
      title: "Jay Park",
      preview: "PhD Candidate · Research Lead",
      metadata: { author: "jay@enso.chat", date: "Writing thesis" }
    },
    thread: {
      title: "Research Framework",
      preview: "Methodology development and literature review",
      metadata: { author: "Research Team", date: "Updated yesterday" }
    },
    topic: {
      title: "methodology",
      preview: "Research methods and approaches",
      metadata: { author: "6 contributors", date: "Active research" }
    },
    file: {
      title: "thesis-draft.pdf",
      preview: "Latest version of research thesis",
      metadata: { size: "3.8 MB", date: "Last edited 2h ago" }
    },
    link: {
      title: "Research Database",
      preview: "Collection of academic papers and references",
      metadata: { url: "papers.academia.edu", date: "Updated weekly" }
    }
  },
  gaming: {
    user: {
      title: "Nova Kim",
      preview: "Raid Leader · Strategy Guide Author",
      metadata: { author: "nova@enso.chat", date: "In raid" }
    },
    thread: {
      title: "Boss Strategies",
      preview: "Detailed mechanics and team coordination",
      metadata: { author: "Raid Team", date: "Updated 3h ago" }
    },
    topic: {
      title: "team-comp",
      preview: "Optimal team compositions and roles",
      metadata: { author: "10 contributors", date: "Active planning" }
    },
    file: {
      title: "raid-guide.pdf",
      preview: "Complete walkthrough and strategies",
      metadata: { size: "5.2 MB", date: "Version 2.4" }
    },
    link: {
      title: "Team Stats",
      preview: "Real-time raid progress and analytics",
      metadata: { url: "stats.raid.gg", date: "Live tracking" }
    }
  },
  travel: {
    user: {
      title: "Rin Tanaka",
      preview: "Local Guide · Food Explorer",
      metadata: { author: "rin@enso.chat", date: "Exploring" }
    },
    thread: {
      title: "Secret Spots",
      preview: "Off-the-beaten-path locations and experiences",
      metadata: { author: "Travel Team", date: "Updated today" }
    },
    topic: {
      title: "local-tips",
      preview: "Insider recommendations and tips",
      metadata: { author: "14 contributors", date: "Active sharing" }
    },
    file: {
      title: "city-guide.pdf",
      preview: "Curated guide to hidden gems and local favorites",
      metadata: { size: "4.1 MB", date: "Spring 2024" }
    },
    link: {
      title: "Local Events",
      preview: "What's happening this week in the city",
      metadata: { url: "events.local.guide", date: "Updated daily" }
    }
  },
  coding: {
    user: {
      title: "Zoe Chen",
      preview: "Senior Engineer · OSS Contributor",
      metadata: { author: "zoe@enso.chat", date: "Coding" }
    },
    thread: {
      title: "Architecture Review",
      preview: "System design and technical decisions for the new API",
      metadata: { author: "Tech Lead", date: "In review" }
    },
    topic: {
      title: "performance",
      preview: "Performance optimizations and benchmarks",
      metadata: { author: "7 contributors", date: "Active discussion" }
    },
    file: {
      title: "system-design.excalidraw",
      preview: "High-level architecture diagrams and flows",
      metadata: { size: "842 KB", date: "Updated 1h ago" }
    },
    link: {
      title: "CI Dashboard",
      preview: "Build status and deployment metrics",
      metadata: { url: "ci.dev.team", date: "Last build: 5m ago" }
    }
  },
  journal: {
    user: {
      title: "Personal Journal",
      preview: "Private thoughts and reflections",
      metadata: { author: "you@enso.chat", date: "Writing" }
    },
    thread: {
      title: "Morning Pages",
      preview: "Daily stream of consciousness writing",
      metadata: { author: "Private", date: "Updated today" }
    },
    topic: {
      title: "gratitude",
      preview: "Collection of moments and appreciations",
      metadata: { author: "Personal", date: "Daily entries" }
    },
    file: {
      title: "reflection-2024.md",
      preview: "Annual review and future aspirations",
      metadata: { size: "156 KB", date: "Last edit: Mar 15" }
    },
    link: {
      title: "Meditation Timer",
      preview: "Mindfulness sessions and tracking",
      metadata: { url: "calm.mind", date: "Last session: 6h ago" }
    }
  }
} as const

export const DEMO_CONTENT = {
  social: {
    threadLinking: {
      title: "Festival Vibes",
      message: "@kai the playlist from >music-night was perfect! the sunset vibes were incredible 🌅",
      reference: {
        title: "Music Night",
        content: "Shared playlists and memories"
      }
    }
  },
  creator: {
    threadLinking: {
      title: "Visual Design",
      message: "@mia the aesthetic from >mood-board is exactly what i was thinking for the #new-series ✨",
      reference: {
        title: "Mood Board",
        content: "Visual inspiration and style ideas"
      }
    }
  },
  student: {
    threadLinking: {
      title: "Study Group",
      message: "@jay check out the examples from >lecture-notes! they connect perfectly with #thesis-ideas 📚",
      reference: {
        title: "Lecture Notes",
        content: "Research methodology and frameworks"
      }
    }
  },
  gaming: {
    threadLinking: {
      title: "Raid Team",
      message: "@nova your strats from >raid-guide are working perfectly for #boss-fights ⚔️",
      reference: {
        title: "Raid Guide",
        content: "Strategy guide and team compositions"
      }
    }
  },
  travel: {
    threadLinking: {
      title: "Travel Plans",
      message: "@rin those spots from >local-guide would be perfect for #hidden-gems 🗺️",
      reference: {
        title: "Local Guide",
        content: "Hidden spots and local recommendations"
      }
    }
  },
  coding: {
    threadLinking: {
      title: "Code Review",
      message: "@zoe the patterns in >system-arch align perfectly with the #performance optimizations 🚀",
      reference: {
        title: "System Architecture",
        content: "Core system design patterns"
      }
    }
  },
  journal: {
    threadLinking: {
      title: "Reflection",
      message: "reviewing my thoughts from >morning-pages and seeing patterns emerge in #gratitude ✨",
      reference: {
        title: "Morning Pages",
        content: "Stream of consciousness writing"
      }
    }
  }
} as const 