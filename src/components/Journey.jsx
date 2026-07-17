import useReveal from './ui/useReveal'
import journeyData from '../data/journey.json'

export default function Journey() {
  useReveal()
  return (
    <section id="journey" className="section" aria-labelledby="journey-title">
      <div className="container">
        <h2 id="journey-title" className="section-title reveal reveal-d1">Engineering Journey</h2>
        <p className="section-desc reveal reveal-d2">
          From crafting game worlds to architecting backend systems.
        </p>

        <div className="timeline">
          {journeyData.map((item, i) => (
            <div key={i} className={`tl-item reveal reveal-d${(i % 3) + 1}`}>
              <div className="tl-left">
                <div className={`tl-dot ${item.state || 'completed'}`}></div>
                <div className="tl-line"></div>
              </div>
              <div className="tl-content">
                <div className="tl-period">{item.period}</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                {item.points && item.points.length > 0 && (
                  <ul className="tl-points">
                    {item.points.map((pt, j) => (
                      <li key={j}>{pt}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
