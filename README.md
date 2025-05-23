# Snake Bot 🐍

A smart Snake game WHICH uses Breadth-First Search (BFS) algorithm to intelligently hunt down its prey. Watch as the snake navigates the game board with purpose, always finding the optimal path to its next meal!

## Features

- **Intelligent SnakeBot**: Uses BFS pathfinding algorithm to find the shortest route to food
- **Autonomous Gameplay**: The snake plays itself, making strategic decisions in real-time
- **Classic Snake Mechanics**: All the nostalgic gameplay you remember, enhanced with BFS

## How It Works

The Snake Bot employs a Breadth-First Search algorithm to:
- Analyze the current game state
- Calculate the shortest path to the nearest food
- Avoid collisions with walls and its own body
- Make optimal movement decisions

## Getting Started

### Prerequisites
- Node.js 
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <https://github.com/shams72/SnakeBot.git>
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

## Available Scripts

### `npm start`
Runs the app in development mode. The snake bot will begin playing automatically once the page loads.

## Game Controls

The snake operates autonomously, but you can also use keyboard controls to influence its movement during autonomous play:

- **Arrow Keys**: Override AI decisions and manually control snake direction

## Algorithm Details

The BFS implementation ensures the snake:
- Always finds the shortest path when one exists
- Handles edge cases like being trapped
- Maintains optimal performance even on larger grids
- Provides consistent, predictable behavior
