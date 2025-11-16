import { useEffect, useMemo, useState } from 'react'
import Spline from '@splinetool/react-spline'

const api = import.meta.env.VITE_BACKEND_URL || ''

function CurrencyBar({ coins, stars, energy, keys }){
  return (
    <div className="flex items-center gap-3 bg-white/70 backdrop-blur rounded-full px-3 py-2 shadow-lg">
      <Chip color="from-yellow-300 to-orange-400" label={`${coins.toLocaleString()} Coins`} />
      <Chip color="from-pink-300 to-rose-400" label={`${stars} Stars`} />
      <Chip color="from-sky-300 to-cyan-400" label={`${energy} Energy`} />
      <Chip color="from-emerald-300 to-green-400" label={`${keys} Keys`} />
    </div>
  )
}

function Chip({ color, label }){
  return (
    <div className={`text-xs sm:text-sm px-3 py-1 rounded-full bg-gradient-to-br ${color} text-slate-800 font-semibold shadow-inner shadow-white/50`}>{label}</div>
  )
}

function Tab({ active, label, onClick }){
  return (
    <button onClick={onClick} className={`px-4 py-2 rounded-full transition-all text-sm font-semibold ${active ? 'bg-white text-slate-800 shadow' : 'text-white/80 hover:text-white hover:bg-white/10'}`}>
      {label}
    </button>
  )
}

function BigCTA({ onClick }){
  return (
    <button onClick={onClick} className="group relative overflow-hidden rounded-2xl px-8 py-4 text-xl font-extrabold text-white bg-gradient-to-br from-orange-400 to-pink-500 shadow-lg hover:scale-[1.02] active:scale-95 transition-all">
      <span className="relative z-10">Play</span>
      <div className="absolute inset-0 bg-white/30 translate-x-[-120%] group-hover:translate-x-[120%] transition-transform duration-700 skew-x-12" />
    </button>
  )
}

function Hero({ onPlay }){
  return (
    <div className="relative h-[320px] sm:h-[420px] w-full rounded-3xl overflow-hidden shadow-xl">
      <Spline scene="https://prod.spline.design/atN3lqky4IzF-KEP/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0b1220]/60 via-transparent to-transparent" />
      <div className="absolute inset-0 p-5 sm:p-8 flex flex-col justify-between">
        <div className="flex justify-between items-center">
          <h1 className="text-white text-2xl sm:text-4xl font-extrabold drop-shadow">Cozy Playland</h1>
          <CurrencyBar coins={12345} stars={3} energy={20} keys={1} />
        </div>
        <div>
          <p className="text-white/90 max-w-md text-sm sm:text-base">Bright, soft and friendly social-casino fun. Unlock areas, meet cute characters, and enjoy satisfying wins.</p>
          <div className="mt-4">
            <BigCTA onClick={onPlay} />
          </div>
        </div>
      </div>
    </div>
  )
}

function Card({ title, subtitle, onClick, children }){
  return (
    <button onClick={onClick} className="text-left w-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-800">{title}</h3>
          {subtitle && <p className="text-slate-500 text-sm">{subtitle}</p>}
        </div>
        <div className="text-2xl">→</div>
      </div>
      {children}
    </button>
  )
}

function SlotsShowcase(){
  const slots = useMemo(() => ([
    { key:'sunny_garden_spin', name:'Sunny Garden Spin', desc:'Flowers, butterflies and a golden carrot jackpot.' },
    { key:'candy_carnival_wheel', name:'Candy Carnival Wheel', desc:'Cupcakes, popcorn and candy wilds.' },
    { key:'pirate_treasure_reels', name:'Pirate Treasure Reels', desc:'Anchors, parrots and chest scatters.' },
    { key:'fairytale_forest_fortune', name:'Fairytale Forest Fortune', desc:'Mushrooms, crystals and magical vines.' },
    { key:'royal_pet_palace', name:'Royal Pet Palace', desc:'Cats, yarn and playful jackpots.' },
  ]), [])
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {slots.map(s => (
        <div key={s.key} className="bg-gradient-to-br from-white to-white/80 rounded-2xl p-4 border border-white/60 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-slate-800 font-bold">{s.name}</div>
              <div className="text-slate-500 text-sm">{s.desc}</div>
            </div>
            <button className="px-4 py-2 rounded-full bg-orange-500 text-white text-sm font-bold hover:scale-105 active:scale-95 transition">Play</button>
          </div>
          <div className="mt-3 h-24 rounded-xl bg-gradient-to-br from-amber-100 via-pink-100 to-sky-100" />
        </div>
      ))}
    </div>
  )
}

function MiniGames(){
  const games = useMemo(() => ([
    { key:'lucky_flip_tiles', name:'Lucky Flip Tiles', desc:'Match pairs to win!' },
    { key:'bubble_pop_chance', name:'Bubble Pop Chance', desc:'Pop before the timer ends.' },
    { key:'treasure_drop_path', name:'Treasure Drop Path', desc:'One nudge before landing.' },
    { key:'magic_timing_ring', name:'Magic Timing Ring', desc:'Stop in the green zone.' },
    { key:'puzzle_pick_chest', name:'Puzzle Pick Chest', desc:'Choose a chest with hints.' },
  ]), [])
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {games.map(g => (
        <div key={g.key} className="bg-white rounded-2xl p-4 border border-white/60 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-slate-800 font-bold">{g.name}</div>
              <div className="text-slate-500 text-sm">{g.desc}</div>
            </div>
            <button className="px-4 py-2 rounded-full bg-pink-500 text-white text-sm font-bold hover:scale-105 active:scale-95 transition">Play</button>
          </div>
          <div className="mt-3 h-24 rounded-xl bg-gradient-to-br from-sky-100 via-emerald-100 to-indigo-100" />
        </div>
      ))}
    </div>
  )
}

export default function App(){
  const [tab, setTab] = useState('Home')
  const tabs = ['Home', 'Slots', 'Instant', 'Events', 'Shop', 'Profile']

  useEffect(() => {
    // Warm the backend
    fetch(api + '/test').catch(()=>{})
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1220] to-[#15223b]">
      <div className="max-w-5xl mx-auto px-4 py-4 sm:py-6">
        <Hero onPlay={() => setTab('Slots')} />

        <div className="mt-6 flex gap-2 overflow-x-auto no-scrollbar">
          {tabs.map(t => <Tab key={t} active={tab===t} label={t} onClick={() => setTab(t)} />)}
        </div>

        <div className="mt-6 grid gap-4">
          {tab === 'Home' && (
            <div className="grid gap-4">
              <Card title="Quests" subtitle="Daily and weekly tasks to earn rewards">
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <QuestPill title="Spin the Garden" reward="100 Coins" progress={2} goal={3} />
                  <QuestPill title="Pop Bubbles" reward="2 Stars" progress={10} goal={50} weekly />
                  <QuestPill title="Login Streak" reward="Wooden Chest" progress={3} goal={7} />
                </div>
              </Card>
              <Card title="Events" subtitle="Limited-time themes with mini-rewards">
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <EventBadge name="Spring Garden Gala" theme="garden" />
                  <EventBadge name="Sweet Carnival" theme="candy" />
                </div>
              </Card>
            </div>
          )}

          {tab === 'Slots' && <SlotsShowcase/>}
          {tab === 'Instant' && <MiniGames/>}
          {tab === 'Events' && (
            <div className="grid gap-3">
              <EventBadge name="Spring Garden Gala" theme="garden" large />
              <EventBadge name="Sweet Carnival" theme="candy" large />
            </div>
          )}
          {tab === 'Shop' && (
            <div className="grid gap-3">
              <ShopPack title="Starter Bundle" bonus="x2 Coins" price="$2.99" colors="from-yellow-200 to-orange-300"/>
              <ShopPack title="Garden Fan" bonus="+5 Keys" price="$4.99" colors="from-emerald-200 to-teal-300"/>
            </div>
          )}
          {tab === 'Profile' && (
            <div className="grid gap-3">
              <Card title="Your Profile" subtitle="Avatar, frames, mascot skins, stats">
                <div className="mt-3 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-300 to-orange-300 shadow-inner" />
                  <div>
                    <div className="font-bold text-slate-800">You</div>
                    <div className="text-slate-500 text-sm">Level 1 • Garden Explorer</div>
                  </div>
                </div>
              </Card>
              <Card title="Achievements" subtitle="Collect cute badges">
                <div className="mt-3 grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {Array.from({length:6}).map((_,i)=> <Badge key={i}/>) }
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function QuestPill({ title, reward, progress, goal, weekly }){
  const pct = Math.min(100, Math.round((progress/goal)*100))
  return (
    <div className="rounded-xl p-3 bg-gradient-to-br from-white to-white/80 border border-white/60">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-slate-800 font-semibold">{title}</div>
          <div className="text-slate-500 text-xs">Reward: {reward} {weekly && '• Weekly'}</div>
        </div>
        <div className="text-xs font-bold text-slate-600">{progress}/{goal}</div>
      </div>
      <div className="mt-2 w-full h-2 rounded-full bg-slate-200 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-emerald-400 to-green-500" style={{width: pct+'%'}} />
      </div>
    </div>
  )
}

function EventBadge({ name, theme, large }){
  const colors = theme === 'garden' ? 'from-emerald-200 to-lime-200' : 'from-pink-200 to-rose-200'
  return (
    <div className={`rounded-2xl p-4 bg-gradient-to-br ${colors} border border-white/60 shadow-inner ${large? 'h-28' : 'h-20'}`}>
      <div className="text-slate-800 font-bold">{name}</div>
      <div className="text-slate-600 text-sm">Themed rewards and cute skins</div>
    </div>
  )
}

function Badge(){
  return (
    <div className="aspect-square rounded-xl bg-gradient-to-br from-indigo-200 to-sky-200 border border-white/60 shadow-inner" />
  )
}

function ShopPack({ title, bonus, price, colors }){
  return (
    <div className={`rounded-2xl p-4 bg-gradient-to-br ${colors} border border-white/60 shadow-inner flex items-center justify-between`}>
      <div>
        <div className="text-slate-800 font-bold">{title}</div>
        <div className="text-slate-600 text-sm">{bonus}</div>
      </div>
      <button className="px-4 py-2 rounded-full bg-slate-900 text-white text-sm font-bold hover:scale-105 active:scale-95 transition">{price}</button>
    </div>
  )
}
