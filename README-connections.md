# Peer Connection System
This document outlines the architecture, API endpoints, and features of the newly integrated dynamic "LinkedIn-style" Networking & Connection system built into the Smart Education Platform's Community module.

## Core Features
1. **Send, Accept, Reject, Withdraw, and Block Requests**: Users can manage a structured connection list with peers over real-time status networks.
2. **AI Match Suggestions**: An intelligent matching algorithm scores and ranks the best possible peers depending on shared skills, mutual connections, and complementary future goals.
3. **Smart `ConnectionButton`**: React component that autonomously resolves your current relationship tier (`connected`, `pending_sent`, `pending_received`, `not_connected`) and coordinates optimistic updates globally.
4. **Gamification Integration**: Earning specific connection badges (`Networker`, `Connector`, `Hub`) through `gamificationService`. Points awarded out-of-the-box upon sending (2 pts) and accepting (5 pts) interactions.
5. **Real-Time WebSockets**: Fully integrated into the existing `NotificationSocket`, emitting alerts instantaneously on requests and acceptances.

## API Endpoints (`/api/connections`)

All endpoints are protected by standard JWT Auth `protect`. 

| Method | Endpoint                    | Description                                  | Payload Data                     |
| ------ | --------------------------- | ------------------------------------------ | -------------------------------- |
| `POST` | `/request`                  | Send a new connection request to a user.     | `{ receiverId, message }`        |
| `PUT`  | `/:id/accept`               | Accept an incoming connection request.       | n/a                              |
| `PUT`  | `/:id/reject`               | Silently reject an incoming request.         | n/a                              |
| `PUT`  | `/:id/block`                | Block user from future interaction.          | n/a                              |
| `DELETE` | `/:id`                    | Delete/Withdraw connection relation.         | n/a                              |
| `GET`  | `/requests`                 | Get all incoming pending requests.           | None                             |
| `GET`  | `/sent`                     | Get all outgoing pending requests.           | None                             |
| `GET`  | `/my-network`               | Get full list of accepted connections.       | `?search=term&skills=react,node` |
| `GET`  | `/suggestions`              | Get top matched potential peers.             | None                             |
| `GET`  | `/status/:userId`           | Quickly lookup current relationship state.   | None                             |

## Database Modifications
- **New `Connection` Schema**: Tracks `sender`, `receiver`, `status` (`pending`, `accepted`, `rejected`, `blocked`), and a `message`.
- **`User` Schema Additions**: Added `connections[]`, `connectionCount`, `pendingRequestsCount`, `isOpenToConnect`, and `lookingFor[]`.
- **`Notification` Schema Extension**: Added connection-specific types (`connection_request`, `connection_accepted`) and `connectionId` relation mapping.

## AI Matching System Detail
The `suggestionService.js` actively powers the `/suggestions` route, scoring non-connected users with the logic:
- +3 points for every exact skill overlap.
- +5 points for exact future goal (`lookingFor` string array) correlations.
- +1 point per mutual active connection in network maps.
Matches are served alongside pre-calculated `matchReasons` strings for direct frontend display (i.e. "✨ 2 shared skills: React, Node").
