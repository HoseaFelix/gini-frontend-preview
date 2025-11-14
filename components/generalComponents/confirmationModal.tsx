import React, { useState } from 'react'
import { toast } from 'sonner'

const ConfirmationModal = ({yes, name, visibility, handleVisibility}) => {

  const [nameInput, setName] = useState('')

  const handleDelete = ()=>{
    if(nameInput == name){
      yes()
    } else{
      toast.error('file name incorrect'); 
    }
  }

  const handleCancel = ()=>{
    handleVisibility()
  }

  const collectFileName = (e)=>{
    setName(e.target.value)
  }

  return (
    <div className={`${visibility ? '' : 'hidden'} z-500 absolute-center w-[80dvw] h-max md:w-[400px] rounded-lg bg-white`}>
      <div className='w-full h-full flex py-5 gap-5 flex-col text-lg px-6 md:px-[32px] md:py-[24px]'>

        <p>
          Delete <span className='font-bold'>&quot;{name}&quot;</span>?
        </p>

        <p>
          This will permanently delete the file <span className='font-bold'>&quot;{name}&quot;</span>.
        </p>

        <p>To confirm, please enter the name of the file below</p>

        <input
          onChange={collectFileName}
          type="text"
          className='h-15 w-full p-2 border rounded-lg border-black'
        />

        <div className='w-full flex justify-between'>
          <button
            onClick={handleCancel}
            className='px-[32px] py-[12px] font-bold text-foreground rounded-md border border-foreground hover:cursor-pointer'
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            className='px-[32px] py-[12px] font-bold bg-red-500 rounded-md text-white hover:cursor-pointer'
          >
            Delete
          </button>
        </div>

      </div>
    </div>
  )
}

export default ConfirmationModal
