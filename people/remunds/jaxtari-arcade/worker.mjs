// Runs one JAXtari game: compiles its exported reset/step StableHLO with
// whlo and steps it, keeping the env state (flattened pytree leaves) here so
// only the action goes in and only the frame comes out.
//
//   main -> worker: {type: "load", name} | {type: "reset"} | {type: "step", action}
//   worker -> main: {type: "ready", compileMs} | {type: "frame", frame, reward, done, ms}
//                   | {type: "error", message}

import { compile } from "./whlo/index.mjs";

let reset = null;
let step = null;
let leaves = null;

/** Fetch a StableHLO module stored as base64 of its gzip bytes, and inflate it to text. */
async function fetchModule(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Could not download ${url} (HTTP ${res.status}).`);
  const bin = atob((await res.text()).trim());
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"));
  return new Response(stream).text();
}

function doReset() {
  // PRNGKey(seed) is [0, seed] as raw u32 key data.
  const seed = (Math.random() * 2 ** 32) >>> 0;
  const out = reset.run({ [reset.inputs[0].name]: new Uint32Array([0, seed]) });
  const names = reset.outputs.map((o) => o.name);
  leaves = names.slice(0, -1).map((n) => out[n]);
  return { frame: out[names[names.length - 1]], reward: 0, done: 0, ms: 0 };
}

function doStep(action) {
  const inputs = {};
  step.inputs.forEach((slot, i) => {
    inputs[slot.name] = i < leaves.length ? leaves[i] : new Int32Array([action]);
  });
  const t = performance.now();
  const out = step.run(inputs);
  const ms = performance.now() - t;
  const names = step.outputs.map((o) => o.name);
  const n = leaves.length;
  leaves = names.slice(0, n).map((name) => out[name]);
  return { frame: out[names[n]], reward: out[names[n + 1]][0], done: out[names[n + 2]][0], ms };
}

function postFrame(f) {
  postMessage({ type: "frame", ...f }, [f.frame.buffer]);
}

function explain(e) {
  const msg = String(e?.message ?? e);
  if (/wasm-unsafe-eval|Content Security Policy|WebAssembly.*(disallowed|not allowed)/i.test(msg)) {
    return "This browser blocked WebAssembly compilation on this page, so the game can't run here.\n\n" + msg;
  }
  return msg;
}

onmessage = async ({ data }) => {
  try {
    if (data.type === "load") {
      const base = `games/${data.name}`;
      const [resetText, stepText] = await Promise.all([
        fetchModule(`${base}/reset.mlir.gz.b64.txt`),
        fetchModule(`${base}/step.mlir.gz.b64.txt`),
      ]);
      const t = performance.now();
      reset = await compile(resetText);
      step = await compile(stepText);
      postMessage({ type: "ready", compileMs: performance.now() - t });
      postFrame(doReset());
    } else if (data.type === "reset") {
      postFrame(doReset());
    } else if (data.type === "step") {
      postFrame(doStep(data.action));
    }
  } catch (e) {
    postMessage({ type: "error", message: explain(e) });
  }
};
