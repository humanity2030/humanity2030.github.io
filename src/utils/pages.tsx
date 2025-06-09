// Auto-generated - do not edit
export const pages = [
  {
    "slug": "manifesto",
    "title": "Will You Be AI's Friend or Become a Paperclip?",
    "date": "2025-06-08T00:00:00.000Z",
    "description": "The manifesto of Humanity 2030"
  },
  {
    "slug": "my-story",
    "title": "My Story",
    "date": "2025-06-08T00:00:00.000Z",
    "description": "A story about my life"
  },
  {
    "slug": "articles/state-of-ai-jun-2025",
    "title": "State of AI - June 2025",
    "date": "2025-06-08T00:00:00.000Z",
    "description": "A summary of the state of AI as of June 2025"
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
