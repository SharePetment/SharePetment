export const SERVER_URL =
  window.location.hostname === 'localhost'
    ? 'http://43.202.86.53:8080'
    : `/api`;

export const ZIP_URL =
  'https://grpc-proxy-server-mkvo6j4wsq-du.a.run.app/v1/regcodes?regcode_pattern=';
export const MAP_URL = '';
export const NGROK = 'https://99d7-59-11-30-105.ngrok-free.app/';
