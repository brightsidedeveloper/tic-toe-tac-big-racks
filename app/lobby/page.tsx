'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database, Tables } from '@/types'
import useOnlineStatus from '@/hooks/useOnlineStatus'
import { cn } from '@/lib/utils'

const page = () => {
  const { presence } = useOnlineStatus()
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

  const superUsers = useMemo(
    () =>
      users.map(obj => {
        let status = 'offline'
        Object.values(presence).forEach(
          (thing: any) => thing[0].id === obj.id && (status = thing[0].status)
        )
        return { ...obj, status }
      }),
    [users, presence]
  )

  return (
    <div className='flex flex-col overflow-y-auto w-screen p-8 h-screen gap-4'>
      <h1 className='text-center text-lg font-semibold'>Lobby</h1>
      {superUsers.map(({ id, username, status }) => {
        return (
          <div
            className='relative w-full p-2 bg-gray-500/20 rounded-lg transition-all duration-200 hover:shadow-md'
            key={id}
          >
            <div
              className={cn(
                'absolute -top-1 -right-1 h-3 w-3 rounded-full ',
                status === 'online'
                  ? 'bg-green-500'
                  : status === 'in-game'
                  ? 'bg-yellow-600'
                  : 'bg-gray-500'
              )}
            />
            <p className='font-semibold'>
              {username} - {status}
            </p>
            <p className='italic text-gray-500/60'>12 - 47</p>
            {/* could be a running game score ⬆️ */}
          </div>
        )
      })}
    </div>
  )
}

export default page
