export function parseJwt(token) {
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodeURIComponent(escape(decoded)));
  } catch (e) {
    return null;
  }
}

export function getUserFromToken() {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('prescripto_token');
  const data = parseJwt(token);
  if (!data) return null;
  return { id: data.id, email: data.email, role: data.role };
}
