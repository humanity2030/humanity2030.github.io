import { hydrate, prerender as ssr } from 'preact-iso'
import { createHead } from '@unhead/ssr'
import { App } from './App'
import './styles.css'

const head = createHead()

if (typeof window !== 'undefined') {
  hydrate(<App head={head} />, document.getElementById('app')!)
}

export async function prerender(data?: any) {
  const result = await ssr(<App head={head} {...data} />)
  
  try {
    const { getAllPageLinks } = await import('./utils/pages')
    const pageLinks = getAllPageLinks()
    
    const headEntries = [...head.entries.entries()]
    const elements = new Set()
    let htmlAttrs = {}
    let title = ''
    
    headEntries.forEach(([_, entry]) => {
      const { input } = entry
      
      if (input.htmlAttrs) {
        htmlAttrs = { ...htmlAttrs, ...input.htmlAttrs }
      }
      
      if (input.title && typeof input.title === 'string') {
        title = input.title
      }
      
      if (input.meta) {
        const metaTags = Array.isArray(input.meta) ? input.meta : [input.meta]
        metaTags.forEach(tag => {
          if (tag) {
            elements.add({ type: 'meta', props: tag })
          }
        })
      }
    })
    
    return {
      ...result,
      links: new Set([...result.links || [], ...pageLinks]),
      head: {
        htmlAttrs,
        title,
        elements
      }
    }
  } catch (error) {
    return result
  }
}