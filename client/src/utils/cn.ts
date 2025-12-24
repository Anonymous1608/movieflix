// Simple class merging utility that doesn't rely on external packages
export function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(" ");
}
