## PART 1: BACKEND

### Develop a Node.js API that:

- Accepts a new message, identifies the sender, the content, and the timestamp.
- Retrieves the last 50 messages in the chat when a new user joins the room.
- Implements a rate-limiting mechanism to restrict the number of messages a user can send within a certain timeframe (for instance, 15 messages per minute).

## Part 2: FRONTEND

### Design a basic chat room interface that:

- Lets users enter a name and send messages to the chat room.
- Updates in real-time when a new message is sent.
- Shows a notification when a user hits the rate limit.

## PART 3: TESTING

### Write automated tests for the following scenarios:

- A user tries to exceed the rate limit.
- Multiple users send messages concurrently.
- Messages appear in the correct order when sent concurrently.
