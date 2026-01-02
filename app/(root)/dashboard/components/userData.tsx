import { API_BASE } from '@/lib/config'
import { getSavedCoverLetter, getSavedResume } from '@/lib/constants/constants'
import React, { useEffect, useState } from 'react'

const UserData = () => {
    const [SavedResume, setSavedResume] = useState<any[]>([])
    const [savedCover, setSavedCover] = useState<any[]>([])

    useEffect(() => {

        const fetchData = async () => {
            await getSavedResume();
            const stored = localStorage.getItem('savedResume')
            if (stored) {
                setSavedResume(JSON.parse(stored))
            }

            await getSavedCoverLetter();
            const storedCover = localStorage.getItem('savedCoverLetters')
            if (storedCover) {
                setSavedCover(JSON.parse(storedCover))
            }
        };



        fetchData()
    }, [])

    const userdata = [
        {
            name: 'Filled Application',
            number: 0,
        },
        {
            name: 'Optimized Resume',
            number: SavedResume.length,
        },
        {
            name: 'Cover Letter Generated',
            number: savedCover.length,
        },
        {
            name: 'Perfomance Rating',
            number: 0,
        }
    ]

    return (
        <div className='w-full flex flex-wrap h-fit gap-5'>
            {userdata.map((data, index) => (
                <div key={index} className='flex-grow basis-[200px] md:h-[150px] h-[100px] bg-white rounded-lg shadow flex flex-col justify-between p-2'>
                    <p>{data.name}</p>
                    <p className='font-bold text-xl'>{data.number}</p>


                </div>
            ))}

        </div>
    )
}

export default UserData
