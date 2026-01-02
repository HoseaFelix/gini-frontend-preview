"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { getActivities, RecentActivity as ActivityType } from '@/lib/client/recentActivityClient'

const RecentActivity = () => {
    const [activities, setActivities] = useState<ActivityType[] | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let mounted = true

        async function load() {
            setLoading(true)
            setError(null)
            try {
                console.log('getting activities')
                const data = await getActivities(5)
                if (!mounted) return
                setActivities(data)
            } catch (err) {
                if (!mounted) return
                setError((err as Error)?.message || 'Failed to load activities')
            } finally {
                if (!mounted) return
                setLoading(false)
            }
        }

        load()
        return () => {
            mounted = false
        }
    }, [])

    return (
        <div className='p-4 shadow rounded-xl bg-white flex flex-col gap-5'>
            <div className='flex justify-between py-4 '>
                <p className='font-bold text-xl'>Recent Activity</p>
                <Link href="" className='underline hover:cursor-pointer'>View More</Link>
            </div>

            {loading ? (
                <p className='text-sm text-gray-600'>Loading recent activities...</p>
            ) : error ? (
                <p className='text-sm text-red-600'>Failed to load activities: {error}</p>
            ) : activities && activities.length > 0 ? (
                activities.map((activity) => (
                    <div key={activity.id} className='flex justify-between p-4 hover:border hover:border-blue-500 border rounded-lg transition-colors hover:cursor-pointer'>
                        <div className='flex flex-col'>
                            <p className='font-medium'>{activity.name}</p>
                            {activity.content ? <p className='text-sm text-gray-600'>{activity.content}</p> : null}
                        </div>
                        <p className='text-sm text-gray-500'>{new Date(activity.time).toLocaleString()}</p>
                    </div>
                ))
            ) : (
                <p className='italics text-black/80'>there are no recent activities to report</p>
            )}
        </div>
    )
}

export default RecentActivity
