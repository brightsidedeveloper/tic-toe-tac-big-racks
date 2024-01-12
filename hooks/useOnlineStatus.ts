'use client'
import { Database, Tables } from '@/types'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useCallback, useEffect, useRef, useState } from 'react'

export default function useOnlineStatus() {
  const supabase = createClientComponentClient<Database>()

  const roomRef = useRef<any | null>(null)

  const [presence, setPresence] = useState<any>([])

  const switchStatus = useCallback(async (status: 'online' | 'in-game') => {
    const userId = (await supabase.auth.getUser()).data?.user?.id ?? ''
    const trackUser = {
      id: userId,
      status,
    }
    await roomRef.current.track(trackUser)
  }, [])

  useEffect(() => {
    roomRef.current = supabase.channel('lobby')
    roomRef.current
      .on('presence', { event: 'sync' }, () => {
        const newState = roomRef.current.presenceState()
        setPresence(newState)
      })
      .subscribe(async (status: any) => {
        if (status !== 'SUBSCRIBED') return
        const userId = (await supabase.auth.getUser()).data?.user?.id ?? ''
        const trackUser = {
          id: userId,
          status: 'online',
        }
        await roomRef.current.track(trackUser)
      })
  }, [])

  return { presence, switchStatus }
}
