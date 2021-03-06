import { multinetApi, UserSpec } from 'multinet';
import { host } from '@/environment';

const api = multinetApi(`${host}/api`);

export async function getUserInfo(): Promise<UserSpec | null> {
  const resp = await fetch(`${host}/api/user/info`, {
    credentials: 'include',
  });

  if (resp.ok) {
    return resp.json();
  }

  return null;
}

export function logout() {
  return fetch(`${host}/api/user/logout`, {
    credentials: 'include',
  });
}

export default api;
