# JAXtari Arcade

Atari games written in JAX, exported as StableHLO, and compiled to WebAssembly in the browser by whlo.

Fully static: no build step. Served by the lab site's GitHub Pages at
https://ml-research.github.io/people/remunds/jaxtari-arcade/ (all paths are relative,
so the folder can live at any subpath).

Local preview: `python3 -m http.server 8000` in this folder and open http://localhost:8000
(a server is needed; opening index.html via file:// won't load the module worker).

Layout:
- `index.html` – UI
- `worker.mjs` – loads a game's reset/step StableHLO and runs it
- `whlo/`, `pkg/` – whlo runtime + compiler (wasm-bindgen output)
- `games/<name>/` – `reset`/`step` modules (gzip+base64), `thumb.png`; `games/index.json` lists games

Games are exported from JAXtari (`dev` branch). Both modules are exported with
`jax.jit(..., keep_unused=True)` so their inputs line up with the state leaves:

- `reset(key u32[2]) -> (*state_leaves, frame u8[H,W,3])`
- `step(*state_leaves, action i32) -> (*state_leaves, frame, reward f32, done i32)`
