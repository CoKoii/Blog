// mock.ts
type Tag = { id: number; name: string; path: string; color: string }
type Article = {
  id: number
  cover: string
  title: string
  authorAvatar: string
  authorName: string
  date: string
  tagIds: number[] // ✅ 用 ID 建立多对多
  views: number
}

// 1) 规范化标签主表（含 path = 路由用的 slug）
export const tagCatalog: Tag[] = [
  { id: 1, name: 'JavaScript', path: 'javascript', color: '#28c840' },
  { id: 2, name: '独立开发', path: 'indie', color: '#f59e0b' },
  { id: 3, name: '读书', path: 'reading', color: '#3b82f6' },
  { id: 4, name: '技术', path: 'tech', color: '#ef4444' },
  { id: 5, name: 'VueJs', path: 'vuejs', color: '#ff5f57' },
  { id: 6, name: 'Node.js', path: 'nodejs', color: '#febc2e' },
]

// 便捷字典
const tagById = Object.fromEntries(tagCatalog.map((t) => [t.id, t]))
const tagIdByPath = Object.fromEntries(tagCatalog.map((t) => [t.path, t.id]))

// 2) 生成文章，并以 tagIds 记录“多对多关系”
function pickTagIds(index: number): number[] {
  const picks: number[] = []
  const base = index % tagCatalog.length || tagCatalog.length // 1..len
  picks.push(base)
  if (index % 2 === 0) picks.push(((base + 1) % tagCatalog.length) + 1) // +2 → +1 因为 base 从 1 起
  if (index % 3 === 0) picks.push(((base + 3) % tagCatalog.length) + 1) // +4 → +3
  return Array.from(new Set(picks))
}

const author = {
  name: 'CaoKai',
  avatar: 'https://q1.qlogo.cn/g?b=qq&nk=2655257336&s=640',
}

export const articles: Article[] = Array.from({ length: 24 }).map((_, i) => {
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
    tagIds: pickTagIds(id), // ✅ 关键：用 tagIds 关联
    views: 50 + ((id * 13) % 950),
  }
})

// 3) 倒排索引：tagId -> articleId[]
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
