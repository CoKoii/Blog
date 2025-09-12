const tagCatalog = [
  { name: 'JavaScript', path: 'javascript', color: '#28c840', id: 1 },
  { name: '独立开发', path: 'indie', color: '#f59e0b', id: 2 },
  { name: '读书', path: 'reading', color: '#3b82f6', id: 3 },
  { name: '技术', path: 'tech', color: '#ef4444', id: 4 },
  { name: 'VueJs', path: 'vuejs', color: '#ff5f57', id: 5 },
  { name: 'Node.js', path: 'nodejs', color: '#febc2e', id: 6 },
]

const author = {
  name: 'CaoKai',
  avatar: 'https://q1.qlogo.cn/g?b=qq&nk=2655257336&s=640',
}

function pickTags(index) {
  const picks = []
  const base = index % tagCatalog.length
  picks.push(tagCatalog[base].name)
  if (index % 2 === 0) picks.push(tagCatalog[(base + 2) % tagCatalog.length].name)
  if (index % 3 === 0) picks.push(tagCatalog[(base + 4) % tagCatalog.length].name)
  return Array.from(new Set(picks))
}

export const articles = Array.from({ length: 24 }).map((_, i) => {
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
    tags: pickTags(id),
    views: 50 + ((id * 13) % 950),
  }
})

const usedTagNames = new Set(articles.flatMap((a) => a.tags))
export const tags = tagCatalog.filter((t) => usedTagNames.has(t.name))

export default { articles, tags }
