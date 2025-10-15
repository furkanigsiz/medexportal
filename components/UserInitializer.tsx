'use client'

import { useMutation, useQuery } from 'convex/react'
import { api } from '../convex/_generated/api'
import { useEffect, useState } from 'react'

export default function UserInitializer() {
  const createUser = useMutation(api.users.createUserIfNotExists)
  const user = useQuery(api.users.getCurrentUser)
  const [isInitializing, setIsInitializing] = useState(false)

  useEffect(() => {
    // Kullanıcı yoksa ve henüz initialize edilmemişse
    if (user === null && !isInitializing) {
      setIsInitializing(true)
      
      const initializeUser = async () => {
        try {
          await createUser()
        } catch (error) {
          console.error('Kullanıcı oluşturma hatası:', error)
        } finally {
          setIsInitializing(false)
        }
      }

      // Biraz bekle ve sonra kullanıcı oluştur
      const timer = setTimeout(initializeUser, 2000)
      
      return () => clearTimeout(timer)
    }
  }, [user, createUser, isInitializing])

  return null
}
