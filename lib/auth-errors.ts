/** Map Supabase Auth errors to clearer messages for the UI. */
export function mapAuthError(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes("rate limit") || lower.includes("email rate")) {
    return (
      "Too many emails sent (Supabase limit). Wait about 1 hour, or turn off " +
      '"Confirm email" in Supabase → Authentication → Providers → Email for local dev.'
    );
  }

  if (lower.includes("already registered") || lower.includes("already been registered")) {
    return "This email is already registered. Try signing in instead.";
  }

  if (lower.includes("invalid login credentials")) {
    return "Wrong email or password. If you just signed up, confirm your email first (check inbox).";
  }

  return message;
}
