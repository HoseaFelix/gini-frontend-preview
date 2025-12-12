/**
 * Client helper for logging and fetching recent activities
 * All functions are safe to call from the browser (client-side).
 */
import { useAuthStore } from '@/store/store'

const BASE = 'https://aidgeny.onrender.com/api/recent-activities'

/**
 * Log a user activity to the backend.
 * @param name short activity name (e.g. 'Sign In', 'Export')
 * @param content optional longer description shown to the user
 */
export async function logActivity(name: string, content?: string) {
  try {
    const token = useAuthStore.getState().token

    await fetch(BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ name, content }),
    })
  } catch (err) {
    // don't let logging break the app; fail silently but keep a console hint
    // eslint-disable-next-line no-console
    console.warn('Failed to log activity', err)
  }
}

/**
 * Fetch recent activities for the current user.
 * @param limit optional limit of items to fetch
 */
export async function fetchRecentActivities(limit = 0) {
  try {
    const token = useAuthStore.getState().token
    const url = limit > 0 ? `${BASE}?limit=${limit}` : BASE
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })

    if (!res.ok) return []
    const data = await res.json()
    return data.activities || []
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('Failed to fetch recent activities', err)
    return []
  }
}
