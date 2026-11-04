# Turret Game: FixedFunction and a game loop

A turret that moves from left to right that shoots cannonballs against floating targets. You can arc the shoot and change the potency.

## Requirements

- Node.js 18 or later (tested with Node 24)
- npm
- A browser with WebGL2 support

## Run

1. Install the dependencies. This is the only step that needs a network connection.

   ```
   npm install
   ```

2. Start the development server.

   ```
   npm run dev
   ```

3. Open `http://localhost:5173` in your browser.

## Use

- Press `Left Arrow` and `Right Arrow` to move from side to side.
- Press `Down Arrow` and `Up Arrow` to  angle the shot.
- Press `1` through `3` to change the force of the shot, lowest to highest.
- Press `F` to also change the force of the shot, ciclically.
- Press `Space` to shoot the cannonball.
- Press `R` to reset the game.

## Game loop

Each frame runs five steps in this order:

1. `processInput` handles the `Space` and `R` presses recorded since the last frame.
2. `update(dt, scene)` applies inputs every SIM_STEP, changing the scene dinamically.
3. `stepProjectile` simulates the flight of the projectile. Is accumulated in the SIM_STEP of last step.
4. `updateSceneTranform` applies the transformation to each object in the scene.
5. `render` draws the scene.

`dt` is the time since the last frame, in seconds. The value is clamped to 0.1 s. A hidden tab does not make the cube jump when the tab becomes visible again. The rotation speed is in radians per second. The cube turns at the same speed on a 60 Hz display and on a 120 Hz display.

## Other commands

| Command           | Action                                          |
| ----------------- | ----------------------------------------------- |
| `npm run build`   | Type-check with `tsc` and build to `dist/`      |
| `npm run preview` | Serve the built `dist/` folder locally          |

## Project layout

```
index.html                 page markup
src/main.ts                WebGL setup, the game loop, and the canvas
src/spheres.ts             algorithm to draw spheres iterating
src/cylinders.ts           algorithm to draw cilynders iterating
src/physics.ts             functions to calculate colitions and parabolic movement
src/constants.ts           other geometry, colors, clear color, initial positions, angles
src/vendor/ff/             FF v1.0 (read only; do not edit)
```

## Troubleshooting

- **Blank page or "WebGL2 is not available."** Enable hardware acceleration in the browser, or try another browser.
- **Port 5173 is in use.** Stop the other process, or run `npx vite --port 3000`.
