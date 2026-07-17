import { useState, useEffect, useRef } from 'react'

export default function Terminal() {
  const [content, setContent] = useState('')
  const containerRef = useRef(null)

  useEffect(() => {
    let mounted = true
    let currentText = ''
    
    const lines = [
      { text: 'alhaithem@demo-server:~$ ', type: 'prompt' },
      { text: 'curl https://api.example.com/v1/profile', type: 'input', delay: 800 },
      { text: '\nFetching data...\n', type: 'system', delay: 400 },
      { text: 'Status: 200 OK\n\n', type: 'system', delay: 600 },
      { text: '{\n', type: 'json' },
      { text: '  "name": "AL Haithem",\n', type: 'json' },
      { text: '  "role": "Backend Engineer",\n', type: 'json' },
      { text: '  "focus": "Architecture & Security",\n', type: 'json' },
      { text: '  "stack": ["Node.js", "Express", "Docker"],\n', type: 'json' },
      { text: '  "status": "Ready to build"\n', type: 'json' },
      { text: '}\n\n', type: 'json' },
      { text: 'alhaithem@demo-server:~$ ', type: 'prompt', delay: 500 }
    ]

    const typeWriter = async () => {
      for (const line of lines) {
        if (!mounted) break
        
        if (line.delay) {
          await new Promise(r => setTimeout(r, line.delay))
        }

        if (line.type === 'input') {
          // Type character by character
          for (let i = 0; i < line.text.length; i++) {
            if (!mounted) break
            currentText += line.text.charAt(i)
            setContent(currentText)
            await new Promise(r => setTimeout(r, Math.random() * 30 + 20))
          }
        } else {
          // Output instantly
          currentText += line.text
          setContent(currentText)
        }
        
        // Auto scroll
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight
        }
      }
    }

    typeWriter()

    return () => { mounted = false }
  }, [])

  return (
    <div className="terminal-window reveal reveal-d2">
      <div className="tw-header">
        <div className="tw-dots">
          <div className="tw-dot red"></div>
          <div className="tw-dot yellow"></div>
          <div className="tw-dot green"></div>
        </div>
        <div className="tw-title">alhaithem@demo-server</div>
      </div>
      <div className="tw-body" ref={containerRef} aria-live="polite">
        {content}
        <span className="tw-cursor"></span>
      </div>
    </div>
  )
}
