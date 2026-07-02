export function isTrialExpired(user) {
  if (!user) return false;
  if (user.isPro) return false;
  if (!user.createdAt) return false;
  
  const createdAtTime = new Date(user.createdAt).getTime();
  const trialDurationMs = 7 * 24 * 60 * 60 * 1000;
  return (Date.now() - createdAtTime) > trialDurationMs;
}
