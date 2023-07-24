import { useRef, useState, useId } from 'react'
import clockIcon from '@/assets/icons/clock.svg'
import sendIcon from '@/assets/icons/send.svg'
import { Message } from '@/types'
import dayjs from 'dayjs'

function Home() {
  const [inputText, setInputText] = useState<string>('')
  const sendButton = useRef<HTMLButtonElement>(null)

  const userId = useId()

  const messages: Message[] = [
    {
      id: useId(),
      from: {
        id: userId,
        name: 'Me',
      },
      timestamp: Date.now(),
      value: 'This is sent from me',
    },
    {
      id: useId(),
      from: {
        id: useId(),
        name: 'Other user',
      },
      timestamp: Date.now(),
      value:
        'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Possimus molestias facilis velit eos, dolorum voluptatibus maxime deserunt fuga sed. Voluptate quo, inventore, debitis suscipit facilis nobis deleniti magni molestiae dignissimos eveniet autem quia voluptatum provident fuga optio doloremque nostrum dolore nesciunt consequatur temporibus, totam sunt quis eos? Quibusdam sit dolor non dicta quae molestias pariatur ipsum eaque quis? Excepturi architecto distinctio voluptatibus deleniti natus, esse officiis molestiae consequatur porro rerum quae placeat! Odit aliquid, sapiente voluptas consequuntur in ipsam autem minus saepe quaerat placeat fugit distinctio unde molestiae eligendi pariatur excepturi dolorem porro sit esse deleniti officiis non suscipit! Velit exercitationem vitae repellat. Distinctio libero, ipsam nisi adipisci voluptatem vero possimus sunt natus quia facere nesciunt recusandae dolores consectetur maxime blanditiis aut ad explicabo quam! Nam eveniet sapiente fuga eligendi beatae veniam voluptate pariatur molestias, vero aliquid, quam amet error repellat, in ab quas rem expedita? Quis ullam rerum voluptatibus.',
    },
    {
      id: useId(),
      from: {
        id: userId,
        name: 'Me',
      },
      timestamp: Date.now(),
      value: 'This is sent from me',
    },
    {
      id: useId(),
      from: {
        id: useId(),
        name: 'Other user',
      },
      timestamp: Date.now(),
      value:
        'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Possimus molestias facilis velit eos, dolorum voluptatibus maxime deserunt fuga sed. Voluptate quo, inventore, debitis suscipit facilis nobis deleniti magni molestiae dignissimos eveniet autem quia voluptatum provident fuga optio doloremque nostrum dolore nesciunt consequatur temporibus, totam sunt quis eos? Quibusdam sit dolor non dicta quae molestias pariatur ipsum eaque quis? Excepturi architecto distinctio voluptatibus deleniti natus, esse officiis molestiae consequatur porro rerum quae placeat! Odit aliquid, sapiente voluptas consequuntur in ipsam autem minus saepe quaerat placeat fugit distinctio unde molestiae eligendi pariatur excepturi dolorem porro sit esse deleniti officiis non suscipit! Velit exercitationem vitae repellat. Distinctio libero, ipsam nisi adipisci voluptatem vero possimus sunt natus quia facere nesciunt recusandae dolores consectetur maxime blanditiis aut ad explicabo quam! Nam eveniet sapiente fuga eligendi beatae veniam voluptate pariatur molestias, vero aliquid, quam amet error repellat, in ab quas rem expedita? Quis ullam rerum voluptatibus.',
    },
    {
      id: useId(),
      from: {
        id: userId,
        name: 'Me',
      },
      timestamp: Date.now(),
      value: 'This is sent from me',
    },
    {
      id: useId(),
      from: {
        id: useId(),
        name: 'Other user',
      },
      timestamp: Date.now(),
      value:
        'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Possimus molestias facilis velit eos, dolorum voluptatibus maxime deserunt fuga sed. Voluptate quo, inventore, debitis suscipit facilis nobis deleniti magni molestiae dignissimos eveniet autem quia voluptatum provident fuga optio doloremque nostrum dolore nesciunt consequatur temporibus, totam sunt quis eos? Quibusdam sit dolor non dicta quae molestias pariatur ipsum eaque quis? Excepturi architecto distinctio voluptatibus deleniti natus, esse officiis molestiae consequatur porro rerum quae placeat! Odit aliquid, sapiente voluptas consequuntur in ipsam autem minus saepe quaerat placeat fugit distinctio unde molestiae eligendi pariatur excepturi dolorem porro sit esse deleniti officiis non suscipit! Velit exercitationem vitae repellat. Distinctio libero, ipsam nisi adipisci voluptatem vero possimus sunt natus quia facere nesciunt recusandae dolores consectetur maxime blanditiis aut ad explicabo quam! Nam eveniet sapiente fuga eligendi beatae veniam voluptate pariatur molestias, vero aliquid, quam amet error repellat, in ab quas rem expedita? Quis ullam rerum voluptatibus.',
    },
    {
      id: useId(),
      from: {
        id: userId,
        name: 'Me',
      },
      timestamp: Date.now(),
      value: 'This is sent from me',
    },
    {
      id: useId(),
      from: {
        id: useId(),
        name: 'Other user',
      },
      timestamp: Date.now(),
      value:
        'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Possimus molestias facilis velit eos, dolorum voluptatibus maxime deserunt fuga sed. Voluptate quo, inventore, debitis suscipit facilis nobis deleniti magni molestiae dignissimos eveniet autem quia voluptatum provident fuga optio doloremque nostrum dolore nesciunt consequatur temporibus, totam sunt quis eos? Quibusdam sit dolor non dicta quae molestias pariatur ipsum eaque quis? Excepturi architecto distinctio voluptatibus deleniti natus, esse officiis molestiae consequatur porro rerum quae placeat! Odit aliquid, sapiente voluptas consequuntur in ipsam autem minus saepe quaerat placeat fugit distinctio unde molestiae eligendi pariatur excepturi dolorem porro sit esse deleniti officiis non suscipit! Velit exercitationem vitae repellat. Distinctio libero, ipsam nisi adipisci voluptatem vero possimus sunt natus quia facere nesciunt recusandae dolores consectetur maxime blanditiis aut ad explicabo quam! Nam eveniet sapiente fuga eligendi beatae veniam voluptate pariatur molestias, vero aliquid, quam amet error repellat, in ab quas rem expedita? Quis ullam rerum voluptatibus.',
    },
    {
      id: useId(),
      from: {
        id: userId,
        name: 'Me',
      },
      timestamp: Date.now(),
      value: 'This is sent from me',
    },
    {
      id: useId(),
      from: {
        id: useId(),
        name: 'Other user',
      },
      timestamp: Date.now(),
      value:
        'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Possimus molestias facilis velit eos, dolorum voluptatibus maxime deserunt fuga sed. Voluptate quo, inventore, debitis suscipit facilis nobis deleniti magni molestiae dignissimos eveniet autem quia voluptatum provident fuga optio doloremque nostrum dolore nesciunt consequatur temporibus, totam sunt quis eos? Quibusdam sit dolor non dicta quae molestias pariatur ipsum eaque quis? Excepturi architecto distinctio voluptatibus deleniti natus, esse officiis molestiae consequatur porro rerum quae placeat! Odit aliquid, sapiente voluptas consequuntur in ipsam autem minus saepe quaerat placeat fugit distinctio unde molestiae eligendi pariatur excepturi dolorem porro sit esse deleniti officiis non suscipit! Velit exercitationem vitae repellat. Distinctio libero, ipsam nisi adipisci voluptatem vero possimus sunt natus quia facere nesciunt recusandae dolores consectetur maxime blanditiis aut ad explicabo quam! Nam eveniet sapiente fuga eligendi beatae veniam voluptate pariatur molestias, vero aliquid, quam amet error repellat, in ab quas rem expedita? Quis ullam rerum voluptatibus.',
    },
    {
      id: useId(),
      from: {
        id: userId,
        name: 'Me',
      },
      timestamp: Date.now(),
      value: 'This is sent from me',
    },
    {
      id: useId(),
      from: {
        id: useId(),
        name: 'Other user',
      },
      timestamp: Date.now(),
      value:
        'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Possimus molestias facilis velit eos, dolorum voluptatibus maxime deserunt fuga sed. Voluptate quo, inventore, debitis suscipit facilis nobis deleniti magni molestiae dignissimos eveniet autem quia voluptatum provident fuga optio doloremque nostrum dolore nesciunt consequatur temporibus, totam sunt quis eos? Quibusdam sit dolor non dicta quae molestias pariatur ipsum eaque quis? Excepturi architecto distinctio voluptatibus deleniti natus, esse officiis molestiae consequatur porro rerum quae placeat! Odit aliquid, sapiente voluptas consequuntur in ipsam autem minus saepe quaerat placeat fugit distinctio unde molestiae eligendi pariatur excepturi dolorem porro sit esse deleniti officiis non suscipit! Velit exercitationem vitae repellat. Distinctio libero, ipsam nisi adipisci voluptatem vero possimus sunt natus quia facere nesciunt recusandae dolores consectetur maxime blanditiis aut ad explicabo quam! Nam eveniet sapiente fuga eligendi beatae veniam voluptate pariatur molestias, vero aliquid, quam amet error repellat, in ab quas rem expedita? Quis ullam rerum voluptatibus.',
    },
  ]

  return (
    <div className="w-screen h-screen flex bg-slate-600">
      {/* Sidebar */}
      <div className="w-96 p-8 bg-slate-700">
        <h2 className="font-bold text-2xl">Users Connected</h2>
      </div>

      {/* Messages */}
      <div className="h-full w-full flex flex-col gap-4 p-8">
        <div className="max-h-full h-full overflow-y-auto scroll-smooth rounded-md">
          <div className="grow flex flex-col gap-4 justify-end">
            {messages.length ? (
              messages.map(({ id, from, value, timestamp }) => {
                const messageTime = dayjs.unix(Math.floor(timestamp / 1000))
                return (
                  <div key={id} className={`p-2 rounded-md min-w-150 w-max max-w-5xl ${from.id === userId ? `bg-cyan-600 self-end` : `bg-cyan-700`}`}>
                    <div className="text-xs mb-1 font-bold italic">{from.name}</div>
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
          <form className="flex w-full gap-4">
            <input
              type="text"
              value={inputText}
              placeholder="Enter your message..."
              className="bg-slate-800 p-2 text-md rounded-lg flex-1"
              onChange={({ target }) => {
                setInputText(target.value)
              }}
              onFocus={() => {
                sendButton.current?.classList.add('outline', 'outline-white', 'outline-2')
              }}
              onBlur={() => {
                sendButton.current?.classList.remove('outline', 'outline-white', 'outline-2')
              }}
            />
            <button
              ref={sendButton}
              className="rounded-full bg-slate-800 w-12 h-12 grid place-content-center disabled:outline-none disabled:bg-slate-400"
              disabled={!inputText}
              type="submit"
            >
              <img src={sendIcon} alt="Send" width={22} height={22} />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Home
