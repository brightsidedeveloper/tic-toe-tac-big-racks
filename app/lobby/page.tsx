'use client'
import React, { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database, Tables } from '@/types'

const page = () => {
  const supabase = createClientComponentClient<Database>()
  const [users, setUsers] = useState<Tables<'users'>[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('users')
      .select('*')
      .then(({ data, error }) => {
        if (error) setError(error.message)
        else setUsers(data)
      })
  }, [])

  return (
    <div className='flex flex-col overflow-y-auto w-screen p-8 h-screen gap-4'>
      {users.map(({ id, username }) => (
        <div className='relative w-full p-2 bg-gray-500/20 rounded-lg' key={id}>
          <div className='absolute -top-2 -right-2 h-3 w-3 rounded-full bg-green-500' />
          <p className='font-semibold'>{username}</p>
          <p>Status: </p>
        </div>
      ))}
    </div>
  )
}

export default page
