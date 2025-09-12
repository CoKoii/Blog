type Tag = { id: number; name: string; path: string; color: string; desc: string }
type Article = {
  id: number
  cover: string
  title: string
  authorAvatar: string
  authorName: string
  date: string
  tagIds: number[]
  views: number
}
export const tagCatalog: Tag[] = [
  {
    id: 1,
    name: 'JavaScript',
    path: 'javascript',
    color: '#28c840',
    desc: 'JavaScript 是一种广泛使用的脚本语言，语法简洁、功能强大，主要用于构建交互式 Web 应用。',
  },
  {
    id: 2,
    name: '独立开发',
    path: 'indie',
    color: '#f59e0b',
    desc: '独立开发专注于从零到一的产品实践，涵盖选题、实现、发布与增长的全流程经验。',
  },
  {
    id: 3,
    name: '读书',
    path: 'reading',
    color: '#3b82f6',
    desc: '读书与书摘笔记，记录思考与收获，沉淀方法论与长期认知。',
  },
  {
    id: 4,
    name: '技术',
    path: 'tech',
    color: '#ef4444',
    desc: '技术专题，涵盖前后端、工程化、性能与架构等实战与总结。',
  },
  {
    id: 5,
    name: 'VueJs',
    path: 'vuejs',
    color: '#ff5f57',
    desc: 'Vue.js 相关内容：组合式 API、组件设计、生态与最佳实践。',
  },
  {
    id: 6,
    name: 'Node.js',
    path: 'nodejs',
    color: '#febc2e',
    desc: 'Node.js 实战与工具链，后端服务、脚手架、构建与部署。',
  },
]
const tagById = Object.fromEntries(tagCatalog.map((t) => [t.id, t]))
const tagIdByPath = Object.fromEntries(tagCatalog.map((t) => [t.path, t.id]))

function pickTagIds(index: number): number[] {
  const picks: number[] = []
  const base = index % tagCatalog.length || tagCatalog.length
  picks.push(base)
  if (index % 2 === 0) picks.push(((base + 1) % tagCatalog.length) + 1)
  if (index % 3 === 0) picks.push(((base + 3) % tagCatalog.length) + 1)
  return Array.from(new Set(picks))
}

const author = {
  name: 'CaoKai',
  avatar: 'https://q1.qlogo.cn/g?b=qq&nk=2655257336&s=640',
}

export const articles: Article[] = Array.from({ length: 40 }).map((_, i) => {
  const id = i + 1
  const month = String((i % 9) + 1).padStart(2, '0')
  const day = String(((i * 3) % 28) + 1).padStart(2, '0')
  return {
    id,
    cover: `https://picsum.photos/seed/article-${id}/1200/700`,
    title: `文章标题 ${id} · 实战与总结`,
    authorAvatar: author.avatar,
    authorName: author.name,
    date: `2024-${month}-${day}`,
    tagIds: pickTagIds(id),
    views: 50 + ((id * 13) % 950),
  }
})
const tagIndex: Record<number, number[]> = {}
for (const art of articles) {
  for (const tid of art.tagIds) {
    ;(tagIndex[tid] ||= []).push(art.id)
  }
}
export function getArticlesByTagPath(tagPath?: string): Article[] {
  if (!tagPath || tagPath === 'all') return articles
  const tid = tagIdByPath[tagPath]
  if (!tid) return []
  const ids = tagIndex[tid] || []
  const set = new Set(ids)
  return articles.filter((a) => set.has(a.id))
}
export const usedTags = tagCatalog.filter((t) => (tagIndex[t.id]?.length ?? 0) > 0)
export function getTagCounts(): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const t of usedTags) counts[t.path] = tagIndex[t.id]?.length ?? 0
  counts['all'] = articles.length
  return counts
}
export function expandArticleTags(a: Article) {
  return a.tagIds.map((id) => tagById[id])
}

export const MOCK_DELAY_MS = 400

function jitteredDelay(base = MOCK_DELAY_MS) {
  const min = Math.floor(base * 0.8)
  const max = Math.ceil(base * 1.2)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export async function withMockDelay<T>(value: T, ms: number = MOCK_DELAY_MS): Promise<T> {
  const wait = jitteredDelay(ms)
  await new Promise((resolve) => setTimeout(resolve, wait))
  return value
}

export async function fetchUsedTags(): Promise<Tag[]> {
  return withMockDelay(usedTags)
}

export async function fetchTagCounts(): Promise<Record<string, number>> {
  return withMockDelay(getTagCounts())
}

export async function fetchArticlesByTagPath(tagPath?: string): Promise<Article[]> {
  return withMockDelay(getArticlesByTagPath(tagPath))
}

export async function fetchArticlesPageByTagPath(
  tagPath: string | undefined,
  page = 1,
  pageSize = 6,
): Promise<{ items: Article[]; total: number }> {
  const all = getArticlesByTagPath(tagPath)
  const total = all.length
  const start = Math.max(0, (page - 1) * pageSize)
  const end = start + pageSize
  const items = all.slice(start, end)
  return withMockDelay({ items, total })
}
