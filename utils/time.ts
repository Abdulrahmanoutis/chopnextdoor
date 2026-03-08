export const formatDuration = (totalSeconds: number): string => {
  if (totalSeconds <= 0) return "EXPIRED";
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

export const getRemainingTime = (expiresAt: string | null | undefined): string => {
  if (!expiresAt) return "EXPIRED";
  const expiryMs = new Date(expiresAt).getTime();
  if (Number.isNaN(expiryMs)) return "EXPIRED";
  const nowMs = Date.now();
  const diffSeconds = Math.floor((expiryMs - nowMs) / 1000);
  return formatDuration(diffSeconds);
};
