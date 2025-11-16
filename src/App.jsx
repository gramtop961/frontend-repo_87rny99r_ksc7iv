import { useEffect, useMemo, useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function useUser() {
  const [userId, setUserId] = useState(() => localStorage.getItem('user_id') || '')
  const [displayName, setDisplayName] = useState(() => localStorage.getItem('display_name') || '')
  const save = (id, name) => {
    localStorage.setItem('user_id', id)
    localStorage.setItem('display_name', name)
    setUserId(id)
    setDisplayName(name)
  }
  return { userId, displayName, save }
}

async function api(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) throw new Error(`${res.status}`)
  return res.json()
}

export default function App() {
  const { userId, displayName, save } = useUser()
  const [showOnboarding, setShowOnboarding] = useState(!userId)

  const [profile, setProfile] = useState(null)
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [error, setError] = useState('')

  const [bet, setBet] = useState(10)
  const [slotResult, setSlotResult] = useState(null)
  const [spinning, setSpinning] = useState(false)

  const [miniResult, setMiniResult] = useState(null)
  const [playingMini, setPlayingMini] = useState(false)

  const [quests, setQuests] = useState([])
  const [events, setEvents] = useState([])

  // Load profile + meta
  useEffect(() => {
    if (!userId) return
    const run = async () => {
      setLoadingProfile(true)
      setError('')
      try {
        const p = await api(`/profiles/${userId}`)
        setProfile(p)
        const [q, e] = await Promise.all([
          api(`/quests/${userId}`),
          api(`/events`),
        ])
        setQuests(q)
        setEvents(e)
      } catch (e) {
        setError('Unable to load profile. Please complete onboarding.')
      } finally {
        setLoadingProfile(false)
      }
    }
    run()
  }, [userId])

  // Onboarding submit
  const [nameInput, setNameInput] = useState(displayName || '')
  const [idInput, setIdInput] = useState(userId || (crypto?.randomUUID?.() || `user_${Math.floor(Math.random()*1e6)}`))
  const [creating, setCreating] = useState(false)

  const submitOnboarding = async (e) => {
    e?.preventDefault()
    if (!idInput || !nameInput) return
    setCreating(true)
    setError('')
    try {
      const body = {
        user_id: idInput,
        display_name: nameInput,
        avatar: null,
        currencies: { coins: 500, stars: 0, energy: 20, keys: 0 },
        level: 1,
        exp: 0,
        streak: 0,
      }
      const created = await api('/profiles', { method: 'POST', body: JSON.stringify(body) })
      save(created.user_id, created.display_name)
      setProfile(created)
      setShowOnboarding(false)
      const [q, e2] = await Promise.all([
        api(`/quests/${created.user_id}`),
        api(`/events`),
      ])
      setQuests(q)
      setEvents(e2)
    } catch (e) {
      setError('Failed to create profile. Try again.')
    } finally {
      setCreating(false)
    }
  }

  // Play slot (Sunny Garden Spin)
  const playSlot = async () => {
    if (!profile) return
    setSpinning(true)
    setError('')
    setSlotResult(null)
    try {
      const result = await api('/play/slot', {
        method: 'POST',
        body: JSON.stringify({ user_id: profile.user_id, theme: 'sunny_garden', bet })
      })
      setSlotResult(result)
      // refresh profile
      const p = await api(`/profiles/${profile.user_id}`)
      setProfile(p)
    } catch (e) {
      setError('Not enough energy or server error.')
    } finally {
      setSpinning(false)
    }
  }

  // Play mini-game (Bubble Pop Chance)
  const playMini = async () => {
    if (!profile) return
    setPlayingMini(true)
    setError('')
    setMiniResult(null)
    try {
      const result = await api('/play/mini', {
        method: 'POST',
        body: JSON.stringify({ user_id: profile.user_id, game: 'bubble_pop' })
      })
      setMiniResult(result)
      const p = await api(`/profiles/${profile.user_id}`)
      setProfile(p)
    } catch (e) {
      setError('Not enough energy or server error.')
    } finally {
      setPlayingMini(false)
    }
  }

  const coins = profile?.currencies?.coins ?? 0
  const stars = profile?.currencies?.stars ?? 0
  const energy = profile?.currencies?.energy ?? 0
  const keys = profile?.currencies?.keys ?? 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-amber-50 text-slate-800">
      {/* HUD */}
      <header className="sticky top-0 z-10 backdrop-blur bg-white/60 border-b border-white/40">
        <div className="max-w-3xl mx-auto flex items-center justify-between p-3">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-amber-300 to-pink-300 grid place-items-center text-xl">🌼</div>
            <div className="font-semibold">Cozy Casino</div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Pill icon="🪙" value={coins} color="from-amber-300 to-yellow-400"/>
            <Pill icon="⭐" value={stars} color="from-yellow-200 to-amber-300"/>
            <Pill icon="⚡" value={energy} color="from-green-200 to-emerald-300"/>
            <Pill icon="🔑" value={keys} color="from-blue-200 to-sky-300"/>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4 space-y-6">
        {/* Hero */}
        <section className="rounded-2xl p-5 bg-gradient-to-br from-rose-200/60 to-pink-200/60 border border-white/50 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">Welcome{displayName ? `, ${displayName}` : ''}!</h1>
              <p className="text-sm text-slate-600">Spin, pop, and collect rewards with a cozy vibe.</p>
            </div>
            <button onClick={() => setShowOnboarding(true)} className="px-3 py-2 rounded-lg bg-white/80 hover:bg-white shadow border border-white/60 text-sm">Profile</button>
          </div>
        </section>

        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>
        )}

        {/* Sunny Garden Spin */}
        <section className="rounded-2xl p-5 bg-white/80 border border-white/60 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold">Sunny Garden Spin</h2>
            <div className="flex items-center gap-2">
              <label className="text-sm">Bet</label>
              <select className="px-2 py-1 rounded border" value={bet} onChange={(e)=>setBet(Number(e.target.value))}>
                {[10,20,50,100].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
              <button disabled={spinning || !profile} onClick={playSlot} className="px-3 py-2 rounded-lg bg-amber-400 hover:bg-amber-500 text-white font-semibold disabled:opacity-50">{spinning ? 'Spinning...' : 'Spin'}</button>
            </div>
          </div>

          {/* Reels */}
          <div className="grid grid-cols-3 gap-2">
            {(slotResult?.reels || [["🌼","🍀","🍓"],["🐝","🌼","🍓"],["🧚","💎","🍓"]]).map((col, i) => (
              <div key={i} className={`aspect-square rounded-xl bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-100 grid place-items-center text-4xl font-bold ${spinning ? 'animate-pulse' : ''}`}>
                <div className="flex flex-col items-center gap-1">
                  {col.map((s, idx) => (
                    <div key={idx} className="h-10 w-10 grid place-items-center">{s}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {slotResult && (
            <div className="mt-3 text-sm">
              <div className="font-semibold">Outcome: <span className="capitalize">{slotResult.outcome}</span></div>
              <div>Win: {slotResult.win_amount} coins</div>
            </div>
          )}
        </section>

        {/* Bubble Pop Chance */}
        <section className="rounded-2xl p-5 bg-white/80 border border-white/60 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold">Bubble Pop Chance</h2>
            <button disabled={playingMini || !profile} onClick={playMini} className="px-3 py-2 rounded-lg bg-sky-400 hover:bg-sky-500 text-white font-semibold disabled:opacity-50">{playingMini ? 'Playing...' : 'Play'}</button>
          </div>
          {miniResult && (
            <div className="text-sm">
              <div className="font-semibold">{miniResult.success ? 'Success!' : 'Try again!'}</div>
              <div>Score: {miniResult.score}</div>
              <div>Reward: {miniResult.reward?.amount || 0} coins</div>
            </div>
          )}
        </section>

        {/* Quests & Events */}
        <section className="rounded-2xl p-5 bg-white/80 border border-white/60 shadow-sm">
          <h3 className="font-semibold mb-2">Quests</h3>
          <div className="grid gap-2">
            {quests.map(q => (
              <div key={q.quest_id} className="p-3 rounded-lg bg-rose-50 border border-rose-100">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{q.title}</div>
                    <div className="text-xs text-slate-600">{q.description}</div>
                  </div>
                  <div className="text-xs">{q.progress}/{q.target}</div>
                </div>
                <div className="mt-2 h-2 bg-white/70 rounded">
                  <div className="h-2 rounded bg-rose-300" style={{ width: `${Math.min(100, Math.round((q.progress/q.target)*100))}%` }} />
                </div>
                <div className="mt-1 text-xs">Reward: {q.reward.amount} {q.reward.type}</div>
              </div>
            ))}
            {quests.length === 0 && <div className="text-sm text-slate-600">No quests yet.</div>}
          </div>
        </section>

        <section className="rounded-2xl p-5 bg-white/80 border border-white/60 shadow-sm">
          <h3 className="font-semibold mb-2">Events</h3>
          <div className="flex gap-2 flex-wrap">
            {events.map(ev => (
              <div key={ev.event_id} className="px-3 py-2 rounded-full bg-gradient-to-r from-pink-200 to-amber-200 border border-white/60 text-sm shadow-sm">{ev.name}</div>
            ))}
            {events.length === 0 && <div className="text-sm text-slate-600">No active events</div>}
          </div>
        </section>

      </main>

      {showOnboarding && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm grid place-items-center p-4">
          <form onSubmit={submitOnboarding} className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl border border-white/60">
            <h2 className="text-lg font-bold mb-3">Welcome!</h2>
            <p className="text-sm text-slate-600 mb-3">Create your cozy profile to start playing.</p>
            <label className="block text-sm font-medium mb-1">Display name</label>
            <input value={nameInput} onChange={(e)=>setNameInput(e.target.value)} className="w-full mb-3 px-3 py-2 rounded-lg border" placeholder="Your name"/>
            <label className="block text-sm font-medium mb-1">User ID</label>
            <input value={idInput} onChange={(e)=>setIdInput(e.target.value)} className="w-full mb-4 px-3 py-2 rounded-lg border font-mono text-xs"/>
            <div className="flex items-center justify-end gap-2">
              <button type="button" onClick={()=> setShowOnboarding(false)} className="px-3 py-2 rounded-lg border">Close</button>
              <button disabled={creating || !nameInput || !idInput} type="submit" className="px-3 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold disabled:opacity-50">{creating ? 'Creating...' : 'Let\'s Play'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

function Pill({ icon, value, color }) {
  return (
    <div className={`px-2 py-1 rounded-full bg-gradient-to-r ${color} text-slate-800 border border-white/60 shadow-sm flex items-center gap-1`}> 
      <span>{icon}</span>
      <span className="font-semibold text-sm">{value}</span>
    </div>
  )
}
