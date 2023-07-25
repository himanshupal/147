import type { User, IncomingData, Message, UserLeft } from 'challenge-147-types'
import { useEffect, useRef, useState } from 'react'

const wsURL = (window.location.protocol === 'https:' ? 'wss://' : 'ws://') + import.meta.env.VITE_SERVER_URL

const useWebSocket = (userId?: string) => {
  const ws = useRef<WebSocket | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [messages, setMessages] = useState<Message[]>([])

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
          return setUsers((u) => [...u, userData])
        case 'left':
          const { event: _leftEvent, ...leftUser } = message
          return setUsers((users) =>
            users.map((u) =>
              u.userId === leftUser.userId
                ? {
                    ...u,
                    disconnected: true,
                  }
                : u
            )
          )
        case 'message':
          const { event: _messageEvent, ...messageData } = message
          return setMessages((m) => [...m, messageData])
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

  return { ws: ws.current, messages, users }
}

export default useWebSocket
