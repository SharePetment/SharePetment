import { redirect } from 'react-router-dom';

export function getToken() {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    return null;
  }
  return accessToken;
}

export function unAouthLoder() {
  const token = getToken();
  if (!token) {
    return redirect('/');
  }
  return null;
}

export function aouthLoder() {
  const token = getToken();
  if (token) {
    return redirect('/home');
  }
  return null;
}
