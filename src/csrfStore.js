// ─── In-memory CSRF token store ───────────────────────────────────────────────
// Never persisted to localStorage / sessionStorage — intentionally ephemeral.
// One variable shared across all modules via ES module singleton semantics.

let _csrfToken = null

export const csrfStore = {
  /** Save token after a successful login */
  set(token) {
    _csrfToken = token
  },

  /** Read the current token */
  get() {
    return _csrfToken
  },

  /** Clear on logout or auth failure */
  clear() {
    _csrfToken = null
  },

  /** True when a token is present */
  isSet() {
    return _csrfToken !== null
  },
}
