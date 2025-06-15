import { visit } from 'unist-util-visit'

export function remarkRDFa () {
    return (tree: any) => {
        let h1Found = false
        visit(tree, {type: 'heading', depth: 1}, (node: any) => {
            if (!h1Found) {
                node.data = node.data || {}
                node.data.hProperties = node.data.hProperties || {}
                node.data.hProperties.property = 'schema:headline'
                h1Found = true
            }
        })
        visit(tree, {type: 'link'}, (node: any) => {
            if (node.url && (node.url.startsWith('http://') || node.url.startsWith('https://'))) {
                node.data = node.data || {}
                node.data.hProperties = node.data.hProperties || {}
                node.data.hProperties.rel = 'nofollow'
            }
        })
    }
}