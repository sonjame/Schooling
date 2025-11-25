'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function PopularPosts() {
  const boardKeys = [
    'board_free',
    'board_promo',
    'board_club',
    'board_grade1',
    'board_grade2',
    'board_grade3',
  ]

  const [posts, setPosts] = useState<any[]>([])

  useEffect(() => {
    let allPosts: any[] = []

    boardKeys.forEach((key) => {
      const raw = localStorage.getItem(key)
      if (!raw) return

      try {
        const list = JSON.parse(raw)
        if (Array.isArray(list)) {
          allPosts = [...allPosts, ...list]
        }
      } catch {}
    })

    // 🔥 좋아요순 정렬 후 TOP 3
    const popular = [...allPosts]
      .sort((a, b) => (b.likes || 0) - (a.likes || 0))
      .slice(0, 3)

    setPosts(popular)
  }, [])

  if (posts.length === 0)
    return <p style={{ color: '#777' }}>아직 게시글이 없습니다.</p>

  return (
    <ul>
      {posts.map((p) => (
        <li key={p.id}>
          <Link href={`/board/post/${p.id}`} style={{ textDecoration: 'none' }}>
            <strong>{p.title}</strong> — ❤️ {p.likes || 0}
          </Link>
        </li>
      ))}
    </ul>
  )
}
