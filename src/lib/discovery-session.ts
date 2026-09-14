// In-memory discovery survives Astro navigation, but never a browser refresh.
let discovered = false;

export function isTimeMachineDiscovered() {
  return discovered;
}

export function revealTimeMachine() {
  discovered = true;
  document.querySelectorAll<HTMLElement>('[data-secret-link]').forEach(link => {
    link.hidden = false;
  });
}
