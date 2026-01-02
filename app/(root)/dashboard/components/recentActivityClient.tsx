"use client"

/**
 * RecentActivity (client) - fetches and displays recent activities
 * Shows top 2 items by default and expands to full list when the user clicks.
 */
import React, { useEffect, useState } from 'react'
import { getActivities, RecentActivity } from '@/lib/client/recentActivityClient'

type Activity = RecentActivity

const RecentActivities = () => {
  const [items, setItems] = useState<Activity[]>([])
  const [expanded, setExpanded] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    let cancelled = false
    const load = async () => {
      setLoading(true)
      try {
        const data = await getActivities(expanded ? 0 : 2)
        if (!cancelled) setItems(data)
      } catch (err) {
        // clear, descriptive console log for debugging
        console.error('Failed to load recent activities (dashboard)', err)
        if (!cancelled) setItems([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return ()=>{ cancelled = true }
  }, [expanded])

  return (
    <div className='p-4 shadow rounded-xl bg-white flex flex-col gap-5'>
      <div className='flex justify-between py-4 '>
        <p className='font-bold text-xl'>Recent Activity</p>
        <button onClick={()=> setExpanded(p=> !p)} className='underline hover:cursor-pointer bg-transparent'>
          {expanded ? 'View Less' : 'View More'}
        </button>
      </div>

      {loading ? (
        <p className='text-sm text-gray-500'>Loading...</p>
      ) : items?.length > 0 ? (
        items.map((activity)=> (
          <div key={activity.id ?? activity.time} className='flex justify-between p-4 hover:border hover:border-blue-500 border rounded-lg transition-colors hover:cursor-pointer'>
            <div>
              <p className='font-semibold'>{activity.name ?? activity.content}</p>
              {activity.content && <p className='text-sm text-gray-600'>{activity.content}</p>}
            </div>
            <p className='text-xs text-gray-400'>{new Date(activity.time ?? '').toLocaleString()}</p>
          </div>
        ))
      ) : (
        <p className='italics text-black/80'>There are no recent activities to report</p>
      )}
    </div>
  )
}

export default RecentActivities
