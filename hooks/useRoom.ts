'use client'
import { Database } from '@/types'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useCallback, useEffect, useRef } from 'react'

export default function useRoom(id: string) {
  const supabase = createClientComponentClient<Database>()

  const roomRef = useRef<any | null>(null)

  const messageReceived = useCallback((payload: any) => {}, [])

  const sendMessage = useCallback((message: string) => {
    if (!roomRef.current) return
  }, [])

  useEffect(() => {
    roomRef.current = supabase.channel(id, {
      config: { broadcast: { self: true } },
    })
    roomRef.current.on()
  }, [])
}
