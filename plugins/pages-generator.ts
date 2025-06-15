import { readdir, readFile, writeFile } from 'fs/promises'
import { join, parse, relative } from 'path'
import chokidar from 'chokidar'
import frontMatter from 'front-matter'

const staticPages = [
  {
    path: '/',
    title: 'AI Alignment from the Edge',
    description: 'Preparing humanity\'s value proposition for the post-AGI world',
    tags: []
  },
  {
    path: '/support.html',
    title: 'Support',
    description: 'Support our AI alignment research',
    tags: []
  },
  {
    path: '/articles/index.html',
    title: 'Articles',
    description: 'Insights and analysis on AI alignment, safety, and the future of humanity',
    tags: []
  }
]

export function pagesGenerator() {
  return {
    name: 'pages-generator',
    async buildStart() {
      await generatePages()
    },
    configureServer(server) {
      const watcher = chokidar.watch('src/pages/**/*.mdx', {
        ignored: /node_modules/,
        persistent: true
      })

      watcher.on('add', async (path) => {
        console.log(`📄 New page added: ${path}`)
        await generatePages()
        server.ws.send({
          type: 'full-reload'
        })
      })

      watcher.on('change', async (path) => {
        console.log(`📝 Page updated: ${path}`)
        await generatePages()
        server.ws.send({
          type: 'full-reload'
        })
      })

      watcher.on('unlink', async (path) => {
        console.log(`🗑️ Page deleted: ${path}`)
        await generatePages()
        server.ws.send({
          type: 'full-reload'
        })
      })

      server.httpServer?.on?.('close', () => {
        watcher.close()
      })
    }
  }
}

const componentName = (filePath: string) => {
    return filePath
        .split('/')
        .map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))
        .join('')
        .split(/[-_]/)
        .map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))
        .join('')
}

async function getAllMdxFiles(dir: string): Promise<string[]> {
    const files = await readdir(dir, { withFileTypes: true, recursive: true })
    return files
        .filter(file => file.isFile() && file.name.endsWith('.mdx'))
        .map(file => join(file.parentPath, file.name))
}

async function generatePages() {
    try {
        const pagesDir = 'src/pages'
        const mdxFiles = await getAllMdxFiles(pagesDir)
        console.log('Found MDX files:', mdxFiles)
        
        const pages: Record<string, any>[] = []
        
        for (const filePath of mdxFiles) {
            const relativePath = relative(pagesDir, filePath)
            const { name, dir } = parse(relativePath)
            
            const slug = dir ? `${dir}/${name}` : name
            
            const fileContent = await readFile(filePath, 'utf-8')
            const parsed = frontMatter(fileContent)
            const frontmatter = parsed?.attributes as Record<string, any>
            const body = parsed?.body || ''

            const wordCount = body.split(/\s+/).map(word => word.trim()).filter(word => /\w+/.test(word)).length
            if (!frontmatter || typeof frontmatter !== 'object') {
                console.error(`No frontmatter found in ${filePath}`)
                continue
            }
            
            pages.push({
                slug,
                title: frontmatter.title || name,
                date: frontmatter.date || new Date().toISOString(),
                description: frontmatter.description || '',
                wordCount,
                ...frontmatter
            })
        }
      
        const pagesCode = `// Auto-generated - do not edit
export const pages = ${JSON.stringify(pages, null, 2)}
  
export function getAllPages() {
    return pages.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}
  
export function getPageBySlug(slug) {
    return pages.find(page => page.slug === slug)
}

export const staticPages = ${JSON.stringify(staticPages, null, 2)}

export function getAllStaticPages() {
    return [...pages.map(page => ({ 
        path: \`/\${page.slug}.html\`, 
        title: page.title, 
        description: page.description,
        tags: 'tags' in page && Array.isArray(page.tags) ? page.tags : []
    })), ...staticPages]
}

export function getAllPageLinks() {
    const mdxPageLinks = pages.map(page => \`/\${page.slug}.html\`)
    const staticPageLinks = staticPages.map(page => page.path)
    return [...mdxPageLinks, ...staticPageLinks]
}
`
      
        const writeIfNeeded = async (filePath, newContent) => {
            try {
                const currentContent = await readFile(filePath, 'utf-8');
                if (currentContent === newContent) return;
            } catch (err) {
                if (err.code !== 'ENOENT') throw err;
            }
            await writeFile(filePath, newContent);
        }

        await writeIfNeeded('src/utils/pages.tsx', pagesCode)
      
        const importsCode = `// Auto-generated - do not edit
import { lazy } from 'preact-iso'
import { MDXLayout } from '../components/MDXLayout'

${pages.map(page => {
    const component = componentName(page.slug)
    return `const ${component}Raw = lazy(() => import('../pages/${page.slug}.mdx'))
const ${component} = () => <MDXLayout><${component}Raw /></MDXLayout>`
}).join('\n')}

export const pageComponents = {
${pages.map(page => `  '${page.slug}.html': ${componentName(page.slug)}`).join(',\n')}
}
`
      
        await writeIfNeeded('src/utils/page-components.tsx', importsCode)
      
        console.log(`✅ Generated ${pages.length} pages`)
    } catch (error) {
        console.error('Error generating pages:', error)
    }
}
  