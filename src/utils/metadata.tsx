import { useHead } from '@unhead/react'
import { getPageBySlug } from './pages'

export const siteConfig = {
  title: 'Humanity 2030', 
  description: 'AI Alignment from the Edge - Preparing humanity\'s value proposition for the post-AGI world',
  url: 'https://humanity2030.github.io',
  author: 'Anonymous Technical Researcher'
}

export function usePageMeta({
  title,
  description,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  tags,
}: {
  title?: string
  description?: string
  type?: string
  publishedTime?: string
  modifiedTime?: string
  author?: string
  tags?: string[]
}) {
  const pageTitle = title ? `${title} | ${siteConfig.title}` : siteConfig.title
  const pageDescription = description || siteConfig.description
  const pageAuthor = author || siteConfig.author

  return useHead({
    title: pageTitle,
    meta: [
      { name: 'description', content: pageDescription },
      { name: 'author', content: pageAuthor },
      ...(tags ? [{ name: 'keywords', content: tags.join(', ') }] : []),
      
      { property: 'og:type', content: type },
      { property: 'og:title', content: pageTitle },
      { property: 'og:description', content: pageDescription },
      { property: 'og:url', content: siteConfig.url },
      
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: pageTitle },
      { name: 'twitter:description', content: pageDescription },
      
      ...(type === 'article' && publishedTime ? [
        { property: 'article:published_time', content: publishedTime },
        { property: 'article:author', content: pageAuthor },
      ] : []),
      ...(type === 'article' && modifiedTime ? [
        { property: 'article:modified_time', content: modifiedTime }
      ] : []),
      ...(type === 'article' && tags ? 
        tags.map(tag => ({ property: 'article:tag', content: tag })) : []
      ),
    ]
  })
}

export function getMdxPageMeta(slug: string) {
  const page = getPageBySlug(slug)
  
  if (!page) return {}
  
  return {
    title: page.title,
    description: page.description,
    publishedTime: page.date,
    type: 'article',
    author: siteConfig.author,
    tags: 'tags' in page && Array.isArray(page.tags) ? page.tags : []
  }
} 