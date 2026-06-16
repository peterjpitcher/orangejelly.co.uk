export function getAllowedAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

export function isAllowedAdmin(
  email: string | undefined | null,
  allowedEmails = getAllowedAdminEmails()
): boolean {
  return Boolean(email && allowedEmails.includes(email.toLowerCase()));
}
