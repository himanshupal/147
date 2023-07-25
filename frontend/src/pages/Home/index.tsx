import type { UserJoined, Message, User, MessageSent } from 'challenge-147-types'
import { useState, useEffect, useMemo } from 'react'
import clockIcon from '@/assets/icons/clock.svg'
import { createId } from '@paralleldrive/cuid2'
import sendIcon from '@/assets/icons/send.svg'
import { USER_LS_KEY } from '@/config'
import useWebSocket from '@/hooks/ws'
import dayjs from 'dayjs'

function Home() {
  const [currentUser, setCurrentUser] = useState<User>()
  const [inputText, setInputText] = useState<string>('')
  const [username, setUsername] = useState<string>('')

  const { ws, users, messages } = useWebSocket(currentUser?.userId)
  const userMap = useMemo(() => new Map(users.map((u) => [u.userId, u])), [users])
  const connectedUsers = useMemo(() => users.filter((u) => u.disconnected === '0'), [users])
  const orderedMessages = useMemo(() => messages.sort((a, b) => a.timestamp - b.timestamp), [messages])

  useEffect(() => {
    const existingUser = window.localStorage.getItem(USER_LS_KEY)
    if (existingUser) {
      const userData: User = JSON.parse(existingUser)
      setCurrentUser(userData)
      const joiningData: UserJoined = { event: 'join', ...userData }
      if (ws?.readyState === ws?.OPEN) {
        ws?.send(JSON.stringify(joiningData))
      }
    }
  }, [ws, ws?.readyState])

  const joinChat: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    const user: User = {
      username,
      disconnected: '0',
      userId: createId(),
      joinedAt: Date.now(),
    }
    setCurrentUser(user)
    const joiningData: UserJoined = { event: 'join', ...user }
    window.localStorage.setItem(USER_LS_KEY, JSON.stringify(user))
    ws?.send(JSON.stringify(joiningData))
  }

  const sendMessage: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    if (!currentUser) return
    const message: Message = {
      id: createId(),
      from: currentUser.userId,
      timestamp: Date.now(),
      value: inputText,
    }
    const messageData: MessageSent = { event: 'message', ...message }
    ws?.send(JSON.stringify(messageData))
    setInputText('')
  }

  return (
    <div className="w-screen h-screen flex bg-slate-600">
      {/* Sidebar */}
      <div className="w-96 p-8 bg-slate-700">
        <h2 className="font-bold text-2xl mb-4">Users Connected</h2>
        {!!connectedUsers.length && (
          <div className="bg-slate-600 p-1.5 rounded-md flex flex-col gap-2">
            {connectedUsers.map(({ userId, username }) => (
              <div key={userId} className="p-1.5 bg-slate-700 rounded-md font-semibold">
                {username} {userId === currentUser?.userId && '(You)'}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Messages or Login */}
      {!currentUser ? (
        <form className="h-1/2 w-full grid place-content-center" onSubmit={joinChat}>
          <label htmlFor="username" className="italic">
            Preffered Username
          </label>
          <input
            type="text"
            name="username"
            className="bg-slate-800 p-2 text-md rounded-lg flex-1 min-w-250"
            onChange={({ target }) => setUsername(target.value)}
          />
          <button className="p-2 rounded-md bg-amber-500 mt-2 disabled:bg-amber-400" disabled={!username}>
            Join
          </button>
        </form>
      ) : (
        <div className="h-full w-full flex flex-col gap-4 p-8">
          <div className="max-h-full h-full overflow-y-auto rounded-md">
            <div className="grow h-100 flex flex-col gap-4 justify-end">
              {orderedMessages.length ? (
                orderedMessages.map(({ id, from, value, timestamp }) => {
                  const messageTime = dayjs.unix(Math.floor(timestamp / 1000))
                  const fromUser = userMap.get(from)
                  return (
                    <div
                      key={id}
                      className={`p-2 rounded-md min-w-150 w-max max-w-5xl ${from === currentUser.userId ? `bg-cyan-600 self-end` : `bg-cyan-700`}`}
                    >
                      <div className="text-xs mb-1 font-bold italic">{fromUser?.username}</div>
                      <span>{value}</span>
                      <div className="text-xs text-right mt-1 font-semibold">{messageTime.format('hh:mm A')}</div>
                    </div>
                  )
                })
              ) : (
                <div className="grid h-full place-content-center">No messages yet!</div>
              )}
            </div>
          </div>

          <div>
            <div className="flex gap-1 italic text-slate-300">
              <img src={clockIcon} alt="" width={12} height={12} />
              Slowmode is enabled.
            </div>
            <form className="flex w-full gap-4" onSubmit={sendMessage}>
              <input
                type="text"
                value={inputText}
                placeholder="Enter your message..."
                className="bg-slate-800 p-2 text-md rounded-lg flex-1"
                onChange={({ target }) => setInputText(target.value)}
              />
              <button
                className="rounded-full bg-slate-800 w-12 h-12 grid place-content-center outline outline-white outline-2 disabled:outline-none disabled:bg-slate-400"
                disabled={!inputText}
                type="submit"
              >
                <img src={sendIcon} alt="Send" width={22} height={22} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
