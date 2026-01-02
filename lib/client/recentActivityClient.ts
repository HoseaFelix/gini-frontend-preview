/**
 * Client helper for logging and fetching recent activities
 * All functions are safe to call from the browser (client-side).
 */
import { useAuthStore } from '@/store/store'
import { API_BASE } from '@/lib/config'

// Base URL for the recent-activities API on your server.
// Update if your server URL changes or if you proxy through a different path.
const BASE = `${API_BASE}/api/recent-activities`

// Activity type returned by the server (matches the Postgres table definition)
export type RecentActivity = {
  id: number
  name: string
  content?: string | null
  time: string // ISO timestamp string (exact time activity took place)
  user_id?: string | null
}

// Helper: get auth token from client-side store
const getToken = () => useAuthStore.getState().token

// Helper: parse a non-OK response and throw a helpful Error
async function parseErrorResponse(res: Response) {
  // try to parse JSON error body first
  try {
    const body = await res.json()
    // if server sends { error: '...' } or { message: '...' }
    const message = body?.error || body?.message || JSON.stringify(body)
    throw new Error(`Server ${res.status} ${res.statusText}: ${message}`)
  } catch {
    // body stream already consumed; can't read again
    throw new Error(`Server ${res.status} ${res.statusText}: Request failed`)
  }
}

// Helper: unified fetch wrapper that logs clear errors for server and network issues
async function safeFetch(input: RequestInfo, init?: RequestInit) {
  try {
    const res = await fetch(input, init)
    if (!res.ok) await parseErrorResponse(res)
    return res
  } catch (err: unknown) {
    // Distinguish network failures (server not reachable) from other errors
    if (err instanceof TypeError) {
      // TypeError is commonly thrown for network errors/fetch failures
      console.error('Network error: Could not reach activity server. Is it running?', err)
      throw new Error('Network error: Could not reach activity server')
    }
    console.error('Unexpected error while calling activity API', err)
    throw err
  }
}

/**
 * Create a new recent activity on the server.
 * @param name short activity name (e.g. 'Upload Resume')
 * @param content optional longer description
 * @param time optional ISO timestamp string for when the activity occurred.
 *             If omitted, the client will send the current time (new Date().toISOString()).
 * @returns the created RecentActivity object from the server
 */
export async function createActivity(name: string, content?: string, time?: string) {
  // prepare the payload; ensure `time` is an ISO timestamp
  console.log('creating activity')
  const payload = {
    name,
    content: content ?? null,
    time: time ?? new Date().toISOString(),
  }

  const token = getToken()

  const res = await safeFetch(BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  })

  // parse and return created activity
  const data = await res.json()
  console.log('created activity', data)
  return data.activity as RecentActivity
}

/**
 * Fetch a list of recent activities for current user.
 * @param limit optional number of items to return (server may ignore if 0)
 */
export async function getActivities(limit = 0) {
  console.log('getting activities')
  const token = getToken()
  const url = limit > 0 ? `${BASE}?limit=${limit}` : BASE

  try {
    const res = await safeFetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })

    const data = await res.json()
    console.log('got activities', data)

    // Handle various response shapes
    if (Array.isArray(data)) {
      return data as RecentActivity[]
    }
    if (Array.isArray(data.activities)) {
      return data.activities as RecentActivity[]
    }
    if (Array.isArray(data.data)) {
      return data.data as RecentActivity[]
    }

    console.warn('Unexpected activities response format, returning empty list', data)
    return []
  } catch (err) {
    // log and return empty list so callers can continue
    console.error('Failed to load recent activities', err)
    return []
  }
}

/**
 * Fetch a single activity by id.
 */
export async function getActivity(id: number) {
  const token = getToken()
  const url = `${BASE}/${id}`
  try {
    const res = await safeFetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
    const data = await res.json()
    return data.activity as RecentActivity
  } catch (err) {
    console.error(`Failed to fetch activity id=${id}`, err)
    return null
  }
}


/**
 * Update an existing activity by id. `updates` can contain name/content/time.
 */
export async function updateActivity(id: number, updates: Partial<Omit<RecentActivity, 'id' | 'user_id'>>) {
  const token = getToken()
  const url = `${BASE}/${id}`
  try {
    const res = await safeFetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(updates),
    })
    const data = await res.json()
    return data.activity as RecentActivity
  } catch (err) {
    console.error(`Failed to update activity id=${id}`, err)
    return null
  }
}

/**
 * Delete an activity by id.
 */
export async function deleteActivity(id: number) {
  const token = getToken()
  const url = `${BASE}/${id}`
  try {
    await safeFetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
    return true
  } catch (err) {
    console.error(`Failed to delete activity id=${id}`, err)
    return false
  }
}

/**
 * Backwards-compatible helper used in many places in the app.
 * Keeps previous `logActivity(name, content)` behaviour but sends an exact timestamp.
 */
export async function logActivity(name: string, content?: string) {
  try {
    await createActivity(name, content, new Date().toISOString())
  } catch (err) {
    // don't let logging break the app; print a clear console warning.
    console.warn('Failed to log activity', err)
  }
}
