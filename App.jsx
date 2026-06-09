import { useState, useEffect } from 'react'
import styles from './App.module.css'

function StatCard({ number, label }) {
  return (
    <div className={styles.statCard}>
      <span className={styles.statNumber}>{number}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  )
}

function CategoryPill({ name, active, onClick }) {
  return (
    <button
      className={`${styles.pill} ${active ? styles.pillActive : ''}`}
      onClick={onClick}
    >
      {name}
    </button>
  )
}

function QuoteCard({ text, category, index }) {
  return (
    <article
      className={styles.quoteCard}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <span className={styles.openQuote}>"</span>
      <p className={styles.quoteText}>{text}</p>
      {category && (
        <span className={styles.categoryTag}>{category}</span>
      )}
    </article>
  )
}

export default function App() {
  const [quotes, setQuotes]         = useState([])
  const [categories, setCategories] = useState([])
  const [info, setInfo]             = useState(null)
  const [activeCategory, setActive] = useState('')
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)

  // Fetch categories + app info on mount
  useEffect(() => {
    Promise.all([
      fetch('/api/categories').then(r => r.json()),
      fetch('/api/info').then(r => r.json()),
    ])
      .then(([catData, infoData]) => {
        setCategories(catData.categories)
        setInfo(infoData)
      })
      .catch(() => setError('Could not reach the API.'))
  }, [])

  // Fetch quotes whenever the active category changes
  useEffect(() => {
    setLoading(true)
    setError(null)

    const url = activeCategory
      ? `/api/quotes/category/${activeCategory}`
      : '/api/quotes'

    fetch(url)
      .then(r => r.json())
      .then(data => {
        if (data.error) throw new Error(data.error)
        setQuotes(data.quotes)
      })
      .catch(e => setError(e.message || 'Failed to load quotes.'))
      .finally(() => setLoading(false))
  }, [activeCategory])

  return (
    <div className={styles.page}>

      <header className={styles.header}>
        <div className={styles.headerInner}>
          <p className={styles.eyebrow}>Daily Wisdom</p>
          <h1 className={styles.title}>Quotes</h1>
          {info && (
            <div className={styles.stats}>
              <StatCard number={info.total_quotes} label="quotes" />
              <StatCard number={info.categories.length} label="categories" />
            </div>
          )}
        </div>
        <div className={styles.headerRule} />
      </header>

      <nav className={styles.nav}>
        <CategoryPill
          name="All"
          active={activeCategory === ''}
          onClick={() => setActive('')}
        />
        {categories.map(c => (
          <CategoryPill
            key={c.name}
            name={`${c.name} (${c.count})`}
            active={activeCategory === c.name}
            onClick={() => setActive(c.name)}
          />
        ))}
      </nav>

      <main className={styles.main}>
        {loading && (
          <div className={styles.status}>Loading quotes…</div>
        )}
        {error && (
          <div className={styles.statusError}>{error}</div>
        )}
        {!loading && !error && quotes.length === 0 && (
          <div className={styles.status}>No quotes found.</div>
        )}
        {!loading && !error && (
          <div className={styles.grid}>
            {quotes.map((q, i) => (
              <QuoteCard
                key={q.id}
                text={q.text}
                category={q.category}
                index={i}
              />
            ))}
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        Quotes App · Flask + React · Docker
      </footer>
    </div>
  )
}
