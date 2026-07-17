import { useState } from 'react'
import useReveal from '../ui/useReveal'
import skillsData from '../../data/skills.json'

export default function Skills() {
  useReveal()
  const [activePhase, setActivePhase] = useState('known')

  const phases = [
    { 
      id: 'known', 
      title: 'Experienced With', 
      desc: 'Technologies I have solid hands-on experience with.', 
      color: 'green', 
      icon: '🟢',
      panelTitle: 'Technologies I have solid hands-on experience with'
    },
    { 
      id: 'learning', 
      title: 'Current Focus', 
      desc: 'What I am actively learning and applying right now.', 
      color: 'yellow', 
      icon: '🟡',
      panelTitle: 'What I am actively learning and applying right now'
    },
    { 
      id: 'future', 
      title: 'Future Goals', 
      desc: 'Next steps planned on my engineering roadmap.', 
      color: 'red', 
      icon: '🔴',
      panelTitle: 'Technologies planned on my engineering roadmap'
    }
  ]

  return (
    <section id="skills" className="section" aria-labelledby="skills-h2">
      <div className="container">
        <div className="skills-header reveal">
          <span className="section-label">Technical skills</span>
          <h2 className="section-title" id="skills-h2">What I know, what I'm learning, what's next.</h2>
          <p className="section-desc">Click a card to explore each phase.</p>
        </div>

        <div className="phase-selector reveal reveal-d1" role="tablist" aria-label="Skill phases">
          {phases.map(p => {
            const count = skillsData[p.id].categories.reduce((acc, cat) => acc + cat.items.length, 0)
            return (
              <button
                key={p.id}
                className={`phase-card ${activePhase === p.id ? 'active' : ''}`}
                data-phase={p.id}
                role="tab"
                aria-selected={activePhase === p.id}
                onClick={() => setActivePhase(p.id)}
              >
                <div className="pc-icon-row" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span className="pc-emoji">{p.icon}</span>
                  <div className="pc-title">{p.title}</div>
                </div>
                <div className="pc-desc">{p.desc}</div>
                <div className="pc-bottom">
                  <span className="pc-count">{count} Skills</span>
                  <span className="pc-explore">Click to explore <span className="arrow">→</span></span>
                </div>
              </button>
            )
          })}
        </div>

        <div className="skills-content reveal reveal-d2">
          {phases.map(p => (
            <div
              key={p.id}
              className={`phase-panel ${activePhase === p.id ? 'active' : ''}`}
              id={`panel-${p.id}`}
              role="tabpanel"
            >
              <div className={`phase-heading ${p.color}`}>
                <span className="phase-heading-icon">{p.icon}</span>
                {p.panelTitle}
                <span className="phase-count">{skillsData[p.id].categories.reduce((acc, cat) => acc + cat.items.length, 0)} Items</span>
              </div>
              <div className="categories-grid">
                {skillsData[p.id].categories.map((cat, i) => (
                  <div key={i} className="category-card animate-in" style={{ animationDelay: `${i * 100}ms` }}>
                    <h4 className="cat-name">{cat.name}</h4>
                    <div className="tag-list">
                      {cat.items.map((item, j) => (
                        <span key={j} className="tag">{item}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
