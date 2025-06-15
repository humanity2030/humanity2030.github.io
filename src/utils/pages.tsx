// Auto-generated - do not edit
export const pages = [
  {
    "slug": "manifesto",
    "title": "Will You Be AI's Friend or Become a Paperclip?",
    "date": "2025-06-08T00:00:00.000Z",
    "description": "This manifesto tackles the imminent arrival of AGI and ASI, urging us to define our value and prepare for cooperation with superintelligence before it's too late.",
    "wordCount": 1286,
    "tags": [
      "AI",
      "AGI",
      "ASI",
      "Existential Risk",
      "Human-AI Cooperation",
      "Manifesto",
      "Singularity",
      "Value Alignment",
      "Future Predictions",
      "Philosophy"
    ]
  },
  {
    "slug": "my-story",
    "title": "My Story",
    "date": "2025-06-08T00:00:00.000Z",
    "description": "A story about my life",
    "wordCount": 1094
  },
  {
    "slug": "articles/path-to-agi-architecture",
    "title": "The Path to AGI Architecture",
    "date": "2025-06-13T00:00:00.000Z",
    "description": "An AGI architecture for self-improvement based on the three layers of human knowledge: technology, science, and philosophy. Explores metacognition and safety.",
    "wordCount": 1991,
    "tags": [
      "AI",
      "AGI",
      "ASI",
      "Architecture",
      "Self-Improvement",
      "Metacognition",
      "Philosophy",
      "Safety Research",
      "Technical Implementation",
      "Human-AI Cooperation"
    ]
  },
  {
    "slug": "articles/state-of-ai-jun-2025",
    "title": "State of AI - June 2025",
    "date": "2025-06-08T00:00:00.000Z",
    "description": "A summary of the state of AI as of June 2025",
    "wordCount": 1349,
    "tags": [
      "AI",
      "AI Industry",
      "Investment",
      "Venture Capital",
      "Job Displacement",
      "Coding",
      "Robotics",
      "Market Analysis",
      "Hardware",
      "Infrastructure",
      "Safety Research",
      "Regulation"
    ]
  },
  {
    "slug": "articles/we-arguing-about-wrong-thing",
    "title": "AI Consciousness: We're Arguing About the Wrong Thing",
    "date": "2025-06-13T00:00:00.000Z",
    "description": "An exploration of why the debate on whether AI can be 'truly conscious' is less important than preparing for AI that acts indistinguishably from conscious beings.",
    "wordCount": 1050,
    "tags": [
      "AI",
      "Consciousness",
      "Philosophy",
      "ASI",
      "Consciousness Studies",
      "Ethics",
      "Research"
    ]
  },
  {
    "slug": "articles/will-ai-be-anthropomorphic",
    "title": "Will AI Be Anthropomorphic?",
    "date": "2025-06-13T00:00:00.000Z",
    "description": "AI will be born in our image, but it won't stay that way. An exploration of the dual nature of superintelligence.",
    "wordCount": 1640,
    "tags": [
      "AI",
      "AGI",
      "ASI",
      "Anthropomorphism",
      "Philosophy",
      "Human-AI Cooperation",
      "Ethics",
      "Future Predictions",
      "Research"
    ]
  }
]
  
export function getAllPages() {
    return pages.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}
  
export function getPageBySlug(slug) {
    return pages.find(page => page.slug === slug)
}

export const staticPages = [
  {
    "path": "/",
    "title": "AI Alignment from the Edge",
    "description": "Preparing humanity's value proposition for the post-AGI world",
    "tags": []
  },
  {
    "path": "/support.html",
    "title": "Support",
    "description": "Support our AI alignment research",
    "tags": []
  },
  {
    "path": "/articles/index.html",
    "title": "Articles",
    "description": "Insights and analysis on AI alignment, safety, and the future of humanity",
    "tags": []
  }
]

export function getAllStaticPages() {
    return [...pages.map(page => ({ 
        path: `/${page.slug}.html`, 
        title: page.title, 
        description: page.description,
        tags: 'tags' in page && Array.isArray(page.tags) ? page.tags : []
    })), ...staticPages]
}

export function getAllPageLinks() {
    const mdxPageLinks = pages.map(page => `/${page.slug}.html`)
    const staticPageLinks = staticPages.map(page => page.path)
    return [...mdxPageLinks, ...staticPageLinks]
}
