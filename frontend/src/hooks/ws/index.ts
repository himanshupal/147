import type { User, IncomingData, Message, UserLeft } from 'challenge-147-types'
import { useEffect, useRef, useState } from 'react'
import { limitAmount } from '@/config'
import { toast } from 'react-toastify'

const wsURL = (window.location.protocol === 'https:' ? 'wss://' : 'ws://') + import.meta.env.VITE_SERVER_URL

const useWebSocket = (userId?: string) => {
  const ws = useRef<WebSocket | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [pastTimestamps, setPastTimestamps] = useState<number[]>([])

  // Reserved for future functionality to display remaining time to restore message sending capability
  // const [restoreTTL, setRestoreTTL] = useState<[minute: number, second: number]>([0, 0])
  // useEffect(() => {
  //   function updateTimestamp() {
  //     const [closestDelay] = pastTimestamps
  //     const totalSeconds = expireDuration - Math.floor((Date.now() - closestDelay) / 1000)
  //     const minute = Math.floor(totalSeconds / 60)
  //     const second = Math.floor(totalSeconds % 60)
  //     setRestoreTTL([minute, second])
  //   }

  //   if (pastTimestamps.length) {
  //     const timer = setInterval(updateTimestamp, 1000)
  //     return () => {
  //       clearInterval(timer)
  //     }
  //   }
  // }, [pastTimestamps])

  useEffect(() => {
    if (ws.current) return

    ws.current = new WebSocket(wsURL)

    ws.current.onopen = function () {
      console.debug('Connected to WS Server...')
    }

    ws.current.onclose = function () {
      console.debug('Server disconnected...')
    }

    ws.current.onmessage = async function (e: MessageEvent<Blob>) {
      const message: IncomingData = JSON.parse(await e.data.text())
      switch (message.event) {
        case 'join':
          const { event: _userEvent, ...userData } = message
          return setUsers((u) => {
            if (u.some(({ userId }) => userId === userData.userId)) {
              return u.map((user) => (user.userId === userData.userId ? { ...user, disconnected: '0' } : user))
            } else {
              return [...u, userData]
            }
          })
        case 'left':
          const { event: _leftEvent, ...leftUser } = message
          return setUsers((users) => users.map((u) => (u.userId === leftUser.userId ? { ...u, disconnected: '1' } : u)))
        case 'message':
          const { event: _messageEvent, ...messageData } = message
          return setMessages((m) => [...m, messageData])
        case 'connected':
          setMessages((m) => [...m, ...message.messages])
          return setUsers((u) => [...u, ...message.users])
        case 'limit':
          if (message.previousKeys.length === limitAmount) toast.warn("You've hit the rate limit.\nPlease wait for some time.")
          return setPastTimestamps(message.previousKeys.map((v) => +v.split(':').at(-1)!).sort((a, b) => b - a))
      }
    }
  }, [])

  useEffect(() => {
    const onBeforeUnload = () => {
      if (userId) {
        const leavingMessage: UserLeft = { event: 'left', userId }
        ws.current?.send(JSON.stringify(leavingMessage))
      }
      ws.current?.close()
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload)
    }
  }, [userId])

  return { ws: ws.current, messages, users, pastTimestamps }
}

export default useWebSocket
