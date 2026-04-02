# RizzAI

## Current State
App has Home screen with swipe cards, Chat screen with AI assistant panel, Discover, and Profile.

## Requested Changes (Diff)

### Add
- After Connect on Home, show an AI First Message overlay on the Chat screen
- Overlay shows 1 pre-generated suggested opening message tailored to the matched profile
- "Send AI message" primary button sends it with one tap
- "Write my own" dismiss option

### Modify
- HomeScreen: Connect action passes matched profile + aiFirstMessage flag to Chat
- ChatScreen: render overlay on empty chat when flag is set

### Remove
- Nothing

## Implementation Plan
1. Add AI first message suggestion generator based on profile name/interests
2. HomeScreen Connect passes matched profile + flag to ChatScreen
3. ChatScreen shows bottom card overlay: suggested message, Send AI message button, Write my own dismiss
4. On Send, insert message into chat and dismiss overlay
