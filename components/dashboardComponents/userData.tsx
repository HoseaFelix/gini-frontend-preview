import React from 'react'

const UserData = () => {
    const userdata = [
        {
            name: 'Filled Application',
            number: 0,
        },
        {
            name: 'Optimized Resume',
            number: 0,
        },
        {
            name: 'Cover Letter Generated',
            number: 0,
        },
        {
            name: 'Perfomance Rating',
            number: 0,
        }
    ]

  return (
    <div className='w-full flex flex-wrap h-fit gap-5'>
        {userdata.map((data, index)=>(
            <div key={index} className='w-[200px] h-[150px] bg-white rounded-lg shadow flex flex-col justify-between p-2 '>
                <p>{data.name}</p>
                <p className='font-bold text-xl'>{data.number}</p>


            </div>
        ))}
      
    </div>
  )
}

export default UserData
