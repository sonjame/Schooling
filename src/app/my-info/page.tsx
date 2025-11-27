'use client'

import React, { useEffect, useState, FormEvent } from 'react'

// 회원가입 정보 타입
interface UserData {
  username: string
  password: string
  school: string
  grade: string
  name?: string
}

const USERS_KEY = 'users'
const LOGGED_KEY = 'loggedInUser'

export default function MyInfoPage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [originalUsername, setOriginalUsername] = useState<string | null>(null)

  // 비밀번호 변경 폼 상태
  const [showPwForm, setShowPwForm] = useState(false)
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [newPw2, setNewPw2] = useState('')
  const [pwMessage, setPwMessage] = useState<string | null>(null)

  /* 로그인한 사용자 정보 불러오기 */
  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      const usersRaw = localStorage.getItem(USERS_KEY)
      const loggedRaw = localStorage.getItem(LOGGED_KEY)

      if (!usersRaw || !loggedRaw) return

      const users: UserData[] = JSON.parse(usersRaw) || []

      let currentUsername: string | null = null

      try {
        const parsed = JSON.parse(loggedRaw)
        if (parsed && typeof parsed === 'object' && 'username' in parsed) {
          currentUsername = parsed.username
        } else {
          currentUsername = loggedRaw
        }
      } catch {
        currentUsername = loggedRaw
      }

      if (!currentUsername) return

      const me = users.find((u) => u.username === currentUsername)
      if (!me) return

      setUser(me)
      setOriginalUsername(me.username)
    } catch (err) {
      console.error('내 정보 불러오기 오류:', err)
    }
  }, [])

  /* 비밀번호 변경 처리 */
  const handlePasswordChange = (e: FormEvent) => {
    e.preventDefault()
    if (!user || !originalUsername) return

    setPwMessage(null)

    if (!currentPw || !newPw || !newPw2) {
      setPwMessage('모든 비밀번호 항목을 입력해주세요.')
      return
    }

    if (currentPw !== user.password) {
      setPwMessage('현재 비밀번호가 일치하지 않습니다.')
      return
    }

    if (newPw !== newPw2) {
      setPwMessage('새 비밀번호가 서로 일치하지 않습니다.')
      return
    }

    try {
      const usersRaw = localStorage.getItem(USERS_KEY)
      const users: UserData[] = usersRaw ? JSON.parse(usersRaw) : []

      const idx = users.findIndex((u) => u.username === originalUsername)
      if (idx === -1) {
        setPwMessage('저장된 회원 정보를 찾을 수 없습니다.')
        return
      }

      const updatedUser: UserData = {
        ...users[idx],
        password: newPw,
      }
      users[idx] = updatedUser
      localStorage.setItem(USERS_KEY, JSON.stringify(users))

      setUser(updatedUser)
      setCurrentPw('')
      setNewPw('')
      setNewPw2('')
      setPwMessage('비밀번호가 성공적으로 변경되었습니다.')
      setShowPwForm(false)
    } catch (err) {
      console.error('비밀번호 변경 오류:', err)
      setPwMessage('비밀번호 변경 중 오류가 발생했습니다.')
    }
  }

  if (!user) {
    return (
      <main
        style={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#f5f7fb',
        }}
      >
        <p style={{ color: '#555' }}>로그인이 필요합니다.</p>
      </main>
    )
  }

  return (
    <main
      style={{
        minHeight: '85vh', // ⭐ 세로 배경 줄임
        background: '#f5f7fb',
        display: 'flex',
        justifyContent: 'center',
        padding: '70px 40px 30px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 520,
          background: '#ffffff',
          borderRadius: 16,
          boxShadow: '0 10px 30px rgba(15,23,42,0.12)',
          padding: 24,
        }}
      >
        <h1
          style={{
            fontSize: 22,
            fontWeight: 700,
            marginBottom: 4,
            textAlign: 'center',
            color: '#111827',
          }}
        >
          내 정보
        </h1>

        <p
          style={{
            fontSize: 13,
            color: '#6b7280',
            marginBottom: 20,
            textAlign: 'center',
          }}
        >
          가입 시 입력된 정보를 확인할 수 있습니다.
        </p>

        {/* 이름 */}
        <Field label="이름" value={user.name || ''} />

        {/* 아이디 */}
        <Field label="아이디" value={user.username} />

        {/* 학교 이름 */}
        <Field label="학교 이름" value={user.school} />

        {/* 학년 */}
        <Field label="학년" value={user.grade} />

        {/* ================================
            🔻 맨 아래로 이동한 비밀번호 변경
        ================================= */}
        <div style={{ marginTop: 30, textAlign: 'center' }}>
          <button
            type="button"
            onClick={() => {
              setPwMessage(null)
              setShowPwForm((prev) => !prev)
            }}
            style={{
              padding: '10px 16px',
              background: '#4FC3F7',
              color: 'white',
              borderRadius: 10,
              border: 'none',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            비밀번호 변경
          </button>

          {showPwForm && (
            <form
              onSubmit={handlePasswordChange}
              style={{
                marginTop: 14,
                padding: 12,
                borderRadius: 10,
                border: '1px solid #e5e7eb',
                background: '#f9fafb',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <input
                type="password"
                placeholder="현재 비밀번호"
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                style={pwInputStyle}
              />
              <input
                type="password"
                placeholder="새 비밀번호"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                style={pwInputStyle}
              />
              <input
                type="password"
                placeholder="새 비밀번호 확인"
                value={newPw2}
                onChange={(e) => setNewPw2(e.target.value)}
                style={pwInputStyle}
              />

              <button
                type="submit"
                style={{
                  marginTop: 4,
                  padding: '9px 12px',
                  borderRadius: 999,
                  border: 'none',
                  background: '#6366f1',
                  color: 'white',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                변경 완료
              </button>
            </form>
          )}

          {pwMessage && (
            <p
              style={{
                marginTop: 6,
                fontSize: 12,
                color: pwMessage.includes('성공') ? '#10b981' : '#ef4444',
              }}
            >
              {pwMessage}
            </p>
          )}
        </div>
      </div>
    </main>
  )
}

/* ===========================
    🔹 공통 읽기 전용 필드
=========================== */
function Field({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        marginBottom: 18,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <label
        style={{
          marginBottom: 6,
          fontSize: 13,
          fontWeight: 600,
          color: '#374151',
          width: '80%',
        }}
      >
        {label}
      </label>

      <input
        value={value}
        readOnly
        disabled
        style={{
          width: '80%',
          padding: '10px 12px',
          borderRadius: 10,
          border: '1px solid #e5e7eb',
          background: '#f3f4f6',
          color: '#6b7280',
          cursor: 'not-allowed',
        }}
      />
    </div>
  )
}

/* 비밀번호 입력 스타일 */
const pwInputStyle: React.CSSProperties = {
  width: '100%',
  padding: '9px 10px',
  borderRadius: 8,
  border: '1px solid #d1d5db',
  fontSize: 13,
  boxSizing: 'border-box',
}
