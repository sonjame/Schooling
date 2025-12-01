'use client'
import React, { useState } from 'react'

// 📌 data4library 도서 검색 API 함수
async function searchBooks(keyword: string, page: number) {
  const API_KEY = `92b042c40df8b5931243936fe1d4dcfc4298ce03b4e5e16310e30af491a159fc`
  const url = `http://data4library.kr/api/srchBooks?authKey=${API_KEY}&keyword=${encodeURIComponent(
    keyword
  )}&pageNo=${page}&pageSize=10&format=json`

  const res = await fetch(url)
  const json = await res.json()

  return json.response?.docs || []
}

export default function BookSearchPage() {
  const [keyword, setKeyword] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)

  const handleSearch = async (newPage = 1) => {
    if (!keyword.trim()) {
      setError('검색어를 입력해주세요.')
      return
    }

    setError('')
    setLoading(true)
    setPage(newPage)

    const lists = await searchBooks(keyword, newPage)

    // 🟢 모든 도서 결과 그대로 사용
    setResults(lists)

    setLoading(false)
  }

  return (
    <main style={styles.container}>
      <h1 style={styles.title}>🔍 도서 검색</h1>

      {/* 🔍 검색창 */}
      <div style={styles.searchBox}>
        <input
          type="text"
          placeholder="검색어를 입력하세요 (예: 역사, 과학, 소설...)"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={styles.input}
        />
        <button style={styles.button} onClick={() => handleSearch(1)}>
          검색
        </button>
      </div>

      {error && <div style={styles.error}>{error}</div>}
      {loading && <div style={styles.loading}>⏳ 검색 중...</div>}

      {/* 🔽 검색 결과 */}
      <div style={styles.list}>
        {results.map((item: any, index: number) => {
          const book = item.doc

          return (
            <div key={index} style={styles.card}>
              <img
                src={book.bookImageURL || '/no-image.png'}
                alt={book.bookname}
                style={styles.image}
                onError={(e) =>
                  ((e.target as HTMLImageElement).src = '/no-image.png')
                }
              />

              <div style={styles.info}>
                <div style={styles.bookTitle}>{book.bookname}</div>
                <div style={styles.bookAuthor}>저자: {book.authors}</div>
                <div style={styles.publisher}>출판사: {book.publisher}</div>
                <div style={styles.pubYear}>출판년도: {book.pubYear}</div>
                <div style={styles.isbn}>ISBN: {book.isbn13}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* 📌 페이지네이션 */}
      {results.length > 0 && (
        <div style={styles.pagination}>
          {[...Array(15)].map((_, i) => {
            const pageNum = i + 1
            return (
              <button
                key={pageNum}
                style={{
                  ...styles.pageButton,
                  ...(page === pageNum ? styles.activePage : {}),
                }}
                onClick={() => handleSearch(pageNum)}
              >
                {pageNum}
              </button>
            )
          })}
        </div>
      )}
    </main>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '20px',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  searchBox: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  input: {
    flex: 1,
    padding: '12px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
  },
  button: {
    padding: '12px 20px',
    backgroundColor: '#2563eb',
    color: '#fff',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
  },
  error: {
    color: 'red',
    marginBottom: '10px',
  },
  loading: {
    fontSize: '16px',
    marginBottom: '10px',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  card: {
    display: 'flex',
    gap: '14px',
    padding: '12px',
    borderRadius: '10px',
    border: '1px solid #e5e7eb',
    background: '#fff',
  },
  image: {
    width: '110px',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '6px',
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  bookTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
  },
  bookAuthor: {
    fontSize: '14px',
    color: '#555',
  },
  publisher: {
    fontSize: '14px',
    color: '#777',
  },
  pubYear: {
    fontSize: '12px',
    color: '#999',
  },
  isbn: {
    fontSize: '12px',
    color: '#999',
  },

  // 📌 페이지네이션
  pagination: {
    marginTop: '30px',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    justifyContent: 'center',
  },
  pageButton: {
    padding: '8px 12px',
    borderRadius: '6px',
    borderStyle: 'solid',
    borderWidth: '1px',
    borderColor: '#d1d5db',
    background: '#fff',
    cursor: 'pointer',
  },
  activePage: {
    background: '#2563eb',
    color: '#fff',
    fontWeight: 'bold',
    borderColor: '#2563eb',
  },
}
