export type ManagedContentKind = "projects" | "logo_works"
export type ManagedContentSourceState = "managed" | "fallback-empty" | "fallback-error"

const sourceStatus: {
  projects: ManagedContentSourceState
  logoWorks: ManagedContentSourceState
} = {
  projects: "fallback-empty",
  logoWorks: "fallback-empty",
}

export function recordManagedContentSource(
  kind: ManagedContentKind,
  state: ManagedContentSourceState,
) {
  sourceStatus[kind === "projects" ? "projects" : "logoWorks"] = state
}

export function getManagedContentSourceStatus() {
  return { ...sourceStatus }
}
