import axios from 'axios';
import queryString from 'query-string';

const API_URL = 'http://localhost:8080/api';
const CLIENT = 'client';
const SECRET = 'deadbeef';

export const AUTH = 'AUTH';
export const UNAUTH = 'UNAUTH';
export const REAUTH = 'REAUTH';
export const AUTH_ERROR = 'AUTH_ERROR';

export function signInAction({ auth_code }, history) {
  return (dispatch) => {
    try {
      const res = axios({
        method: 'post',
        url: `http://localhost:8080/oauth/token`,
        params: {
          'grant_type': 'authorization_code',
          'code': auth_code,
          'client_id': CLIENT,
          'client_secret': SECRET,
          'redirect_uri': 'http://localhost:8081/callback'
        },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }).then((res) => {
        dispatch({ type: AUTH });
        localStorage.setItem('user', res.data.access_token);
        localStorage.setItem('refresh', res.data.refresh_token);
        history.push('/');
      }).catch((error) => {
        dispatch({
          type: AUTH_ERROR,
          payload: error.response
        });
      });
    } catch (error) {
      dispatch({
        type: AUTH_ERROR,
        payload: error
      });
    }
  };
}

export function refreshToken(token, refresh_token) {
  return (dispatch) => {
    const res = axios({
      method: 'post',
      url: `http://localhost:8080/oauth/token`,
      params: {
        'grant_type': 'refresh_token',
        'client_id': CLIENT,
        'client_secret': SECRET,
        'refresh_token': refresh_token
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${token}`
      }
    }).then((res) => {
      dispatch({ type: REAUTH });
        localStorage.setItem('user', res.data.access_token);
        localStorage.setItem('refresh', res.data.refresh_token);
      
    }).catch((error) => {
      dispatch({ type: UNAUTH });
      if (error.response.data.error_description.startsWith('Invalid refresh token')) {
        localStorage.removeItem('user');
        localStorage.removeItem('refresh');
      }
    });
  }
}