// RestoreModal — adapted from Temp/RestoreModal.jsx
import { useState, useEffect } from 'react'
import { useToast } from './Toast.jsx'
import { API_BASE } from '../api.js'
import { csrfStore } from '../csrfStore.js'

const knownItems = [
  { path: 'Settings.json',  label: 'Settings.json' },
  { path: 'last_id.json',   label: 'last_id.json (Checkpoints)' },
  { path: 'system.log',     label: 'system.log (System Log)' },
  { path: 'ValidIDs.json',  label: 'ValidIDs.json (ID List)' },
  { path: 'Games/',         label: 'Games/ (All chunk files)' },
]

export default function RestoreModal({ isOpen, onClose, filename, onRestoreComplete }) {
  const showMessage     = useToast()
  const [availableItems, setAvailableItems] = useState([])
  const [selected, setSelected]             = useState(new Set())
  const [loading, setLoading]               = useState(false)

  const csrfHeader = () => ({
    'Content-Type': 'application/json',
    'X-CSRF-Token': csrfStore.get() ?? '',
  })

  useEffect(() => {
    if (!isOpen || !filename) return
    setLoading(true)
    fetch(`${API_BASE}/api/siri0/data/backup-contents`, {
      method: 'POST', credentials: 'include',
      headers: csrfHeader(),
      body: JSON.stringify({ filename }),
    })
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setAvailableItems(data) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [isOpen, filename])

  const toggleItem = (path) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(path)) next.delete(path); else next.add(path)
      return next
    })
  }

  const performRestore = async () => {
    if (selected.size === 0) { showMessage('Select at least one item', 'warning'); return }
    try {
      const res = await fetch(`${API_BASE}/api/siri0/data/restore-selected`, {
        method: 'POST', credentials: 'include',
        headers: csrfHeader(),
        body: JSON.stringify({ filename, items: [...selected] }),
      })
      const data = await res.json()
      if (data.success) {
        showMessage('Restore completed successfully')
        onClose()
        onRestoreComplete?.()
      } else {
        showMessage('Restore failed: ' + data.message, 'error')
      }
    } catch (err) {
      showMessage('Error: ' + err.message, 'error')
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-fixed show">
      <div className="modal-content card-glass">
        <h3><i className="fas fa-undo" /> Select items to restore</h3>
        <div className="modal-scroll-list">
          {loading ? (
            <div className="loading-shimmer">Loading contents...</div>
          ) : (
            knownItems.map(item => {
              const exists = availableItems.some(i => i.startsWith(item.path))
              return (
                <label key={item.path}>
                  <input
                    type="checkbox"
                    disabled={!exists}
                    checked={selected.has(item.path)}
                    onChange={() => toggleItem(item.path)}
                  />
                  {item.label} {!exists && '(not in backup)'}
                </label>
              )
            })
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-primary" onClick={performRestore}>
            <i className="fas fa-check" /> Restore
          </button>
          <button className="btn btn-outline" onClick={onClose}>
            <i className="fas fa-times" /> Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
