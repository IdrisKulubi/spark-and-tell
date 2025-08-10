# 🌐 Multiplayer Feature

Spark & Tell now supports online multiplayer! Two players can play together even when they're not in the same room.

## 🚀 How It Works

### For Players:
1. **Create Room**: One player creates a room and gets a 6-digit code
2. **Share Code**: Share the room code with your partner
3. **Join Room**: The other player enters the code to join
4. **Play Together**: Take turns rolling dice, answering questions, and awarding sparks in real-time

### Technical Implementation:
- **Real-time Sync**: Uses tRPC subscriptions with WebSockets for instant updates
- **Room System**: 6-digit codes for easy room sharing
- **State Management**: Zustand store handles multiplayer game state
- **Reconnection**: Players can reconnect if they lose connection

## 🛠️ Development Setup

### Running with Multiplayer Support:

```bash
# Start both Next.js and WebSocket server
bun run dev:full

# Or run separately:
bun run dev        # Next.js server (port 3000)
bun run dev:ws     # WebSocket server (port 3001)
```

### Architecture:

```
┌─────────────────┐    ┌─────────────────┐
│   Player 1      │    │   Player 2      │
│   Browser       │    │   Browser       │
└─────────┬───────┘    └─────────┬───────┘
          │                      │
          │   HTTP/WebSocket     │
          │                      │
    ┌─────▼──────────────────────▼─────┐
    │        Next.js Server            │
    │         (Port 3000)              │
    └─────────────┬────────────────────┘
                  │
    ┌─────────────▼────────────────────┐
    │      WebSocket Server            │
    │         (Port 3001)              │
    │                                  │
    │  • Room Management               │
    │  • Real-time Events              │
    │  • Game State Sync               │
    └──────────────────────────────────┘
```

## 🎮 Game Flow

### Room Creation:
1. Player 1 clicks "Play Online"
2. Enters their name and creates room
3. Gets 6-digit room code
4. Waits in lobby for Player 2

### Joining:
1. Player 2 clicks "Play Online" → "Join Room"
2. Enters room code and their name
3. Joins the lobby
4. Host can configure game settings and start

### Gameplay:
1. **Turn-based**: Players alternate turns
2. **Real-time Updates**: All actions sync instantly
3. **Dice Rolling**: Only current player can roll
4. **Question Display**: Both players see the question
5. **Spark Awarding**: Other player awards sparks
6. **Score Tracking**: Live score updates

## 🔧 Key Components

### Backend (`/src/server/api/routers/game.ts`):
- `createRoom` - Creates new game room
- `joinRoom` - Joins existing room
- `startGame` - Begins gameplay
- `rollDice` - Handles dice rolls
- `awardSparks` - Awards spark points
- `subscribeToRoom` - Real-time event subscription

### Frontend:
- `MultiplayerSetup` - Room creation/joining UI
- `MultiplayerLobby` - Pre-game lobby
- `MultiplayerGamePlay` - Main game interface
- `multiplayerStore` - Zustand state management

### Types (`/src/types/multiplayer.ts`):
- `GameRoom` - Room data structure
- `Player` - Player information
- `GameEvent` - Real-time event types
- `MultiplayerGameState` - Extended game state

## 🚀 Deployment Considerations

### Production Setup:
1. **WebSocket Server**: Deploy WebSocket server separately or use serverless WebSockets
2. **State Persistence**: Consider Redis for room state in production
3. **Scaling**: Use Redis pub/sub for multi-instance deployments
4. **Security**: Add rate limiting and input validation

### Environment Variables:
```env
# WebSocket URL for production
NEXT_PUBLIC_WS_URL=wss://your-websocket-server.com
```

## 🎯 Features

### ✅ Implemented:
- Room creation and joining
- Real-time game synchronization
- Turn-based gameplay
- Spark awarding system
- Connection status indicators
- Room code sharing

### 🔄 Future Enhancements:
- Reconnection handling
- Spectator mode
- Multiple game rooms
- Chat functionality
- Game replay system
- Mobile app support

## 🐛 Troubleshooting

### Common Issues:

1. **WebSocket Connection Failed**:
   - Ensure WebSocket server is running on port 3001
   - Check firewall settings
   - Verify WebSocket URL in production

2. **Room Not Found**:
   - Room codes expire after inactivity
   - Check for typos in room code
   - Ensure room is still active

3. **Sync Issues**:
   - Refresh both browsers
   - Check network connectivity
   - Verify WebSocket connection status

### Debug Mode:
```bash
# Enable tRPC logging
NODE_ENV=development bun run dev:full
```

## 📱 Mobile Support

The multiplayer feature is fully responsive and works on:
- Mobile browsers (iOS Safari, Chrome)
- Tablet devices
- Desktop browsers
- Progressive Web App (PWA) ready

## 🎉 Usage Examples

### Creating a Room:
```typescript
const { mutate: createRoom } = api.game.createRoom.useMutation({
  onSuccess: (data) => {
    console.log(`Room created: ${data.roomCode}`);
  }
});

createRoom({ hostName: "Alice" });
```

### Joining a Room:
```typescript
const { mutate: joinRoom } = api.game.joinRoom.useMutation({
  onSuccess: (data) => {
    console.log(`Joined room: ${data.roomCode}`);
  }
});

joinRoom({ roomCode: "ABC123", guestName: "Bob" });
```

### Real-time Events:
```typescript
api.game.subscribeToRoom.useSubscription(
  { roomId, playerId },
  {
    onData: (event) => {
      switch (event.type) {
        case "DICE_ROLLED":
          console.log(`Dice rolled: ${event.payload.category}`);
          break;
        case "SPARKS_AWARDED":
          console.log(`Sparks awarded: ${event.payload.sparkTypes}`);
          break;
      }
    }
  }
);
```

---

**Ready to connect hearts across distances! 💕🌐**