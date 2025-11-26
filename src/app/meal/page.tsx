'use client'

import { useEffect, useState } from 'react'

// ---------------------------
//  Google Fonts + Icons 로딩
// ---------------------------
const loadGoogleResources = () => {
  const font = document.createElement('link')
  font.rel = 'stylesheet'
  font.href =
    'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap'

  const icon = document.createElement('link')
  icon.rel = 'stylesheet'
  icon.href =
    'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined'

  document.head.appendChild(font)
  document.head.appendChild(icon)
}

// ---------------------------
//  학교 데이터 (교육청코드 + 학교코드)
// ---------------------------
const SCHOOL_DATA: Record<string, { edu: string; code: string }> = {
  양주고등학교: { edu: 'J10', code: '7580167' },
  덕계고등학교: { edu: 'J10', code: '7531116' },
  회천고등학교: { edu: 'J10', code: '7620312' },
}

// ---------------------------
//  급식 API 불러오기 함수 (단일 날짜 조회)
// ---------------------------
async function fetchMeal(date: string, eduCode: string, schoolCode: string) {
  const KEY = process.env.NEXT_PUBLIC_NEIS_KEY

  const url = `https://open.neis.go.kr/hub/mealServiceDietInfo?KEY=109e3660c3624bf5a4803631891234ef&Type=json&ATPT_OFCDC_SC_CODE=J10&SD_SCHUL_CODE=7531116&MLSV_YMD=${date}`

  try {
    const res = await fetch(url)
    const data = await res.json()

    if (!data.mealServiceDietInfo) return null

    return data.mealServiceDietInfo[1].row[0].DDISH_NM.replace(
      /<br\/>/g,
      '\n'
    ).split('\n')
  } catch {
    return null
  }
}

// ---------------------------
//  이번 주 월~금 날짜 구하기
// ---------------------------
function getWeekDates() {
  const today = new Date()

  // 한국 시간 기준으로 변환
  const kr = new Date(today.getTime() + 9 * 60 * 60 * 1000)
  const day = kr.getDay() // 0: 일, 1: 월...
  const monday = new Date(kr)
  monday.setDate(kr.getDate() - (day === 0 ? 6 : day - 1))

  const dates = []
  for (let i = 0; i < 5; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)

    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')

    dates.push({
      key: `${y}${m}${dd}`,
      label: `${m}/${dd}`,
    })
  }

  return dates
}

// ---------------------------
//  메인 컴포넌트
// ---------------------------
export default function WeeklyMealPage() {
  const [weekMeals, setWeekMeals] = useState<
    { date: string; label: string; meal: string[] | null }[]
  >([])
  const [loading, setLoading] = useState(true)

  // ---------------------------
  //  회원정보 기반 학교 불러오기
  // ---------------------------
  const [eduCode, setEduCode] = useState('J10') // 기본값
  const [schoolCode, setSchoolCode] = useState('7580167') // 기본값: 양주고

  useEffect(() => {
    loadGoogleResources()

    // ⭐ 로그인한 사용자의 학교 불러오기
    const userSchool = localStorage.getItem('userSchool')

    if (userSchool && SCHOOL_DATA[userSchool]) {
      setEduCode(SCHOOL_DATA[userSchool].edu)
      setSchoolCode(SCHOOL_DATA[userSchool].code)
    }

    const dates = getWeekDates()

    Promise.all(
      dates.map(async (d) => {
        const meal = await fetchMeal(d.key, eduCode, schoolCode)
        return { date: d.key, label: d.label, meal }
      })
    ).then((results) => {
      setWeekMeals(results)
      setLoading(false)
    })
  }, [eduCode, schoolCode])

  return (
    <div
      style={{
        fontFamily: "'Noto Sans KR', sans-serif",
        maxWidth: '500px',
        margin: '0 auto',
        padding: '20px',
      }}
    >
      <h1
        style={{
          fontSize: '24px',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 30 }}>
          restaurant_menu
        </span>
        주간 급식표
      </h1>

      {loading && <p style={{ marginTop: 20, fontSize: 16 }}>불러오는 중...</p>}

      {!loading &&
        weekMeals.map((d, i) => (
          <div
            key={i}
            style={{
              marginTop: 16,
              padding: 18,
              borderRadius: 12,
              background: '#fafafa',
              boxShadow: '0 3px 12px rgba(0,0,0,0.08)',
            }}
          >
            <div
              style={{
                fontSize: 18,
                fontWeight: 600,
                marginBottom: 10,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span className="material-symbols-outlined">calendar_month</span>
              {d.label}
            </div>

            {!d.meal && <p>급식 없음</p>}

            {d.meal &&
              d.meal.map((item, idx) => (
                <p key={idx} style={{ margin: '6px 0', fontSize: 15 }}>
                  • {item}
                </p>
              ))}
          </div>
        ))}
    </div>
  )
}
