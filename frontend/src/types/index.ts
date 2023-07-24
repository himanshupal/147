export interface Message {
  id: string
  from: User
  value: string
  timestamp: number
}

export interface User {
  id: string
  name: string
}
