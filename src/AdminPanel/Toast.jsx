// Toast context — shared across the admin panel
import { useState, useEffect, useCallback, createContext, useContext } from 'react'

const ToastContext = createContext()

export function useToast() {
  return useContext(ToastContext)
}

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)

  const showMessage = useCallback((text, type = 'success') => {
    setToast({ text, type })
  }, [])

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  return (
    <ToastContext.Provider value={showMessage}>
      {toast && (
        <div className={`settings-message ${toast.type}`} style={{ display: 'block' }}>
          {toast.text}
        </div>
      )}
      {children}
    </ToastContext.Provider>
  )
}
