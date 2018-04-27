import { AUTH, UNAUTH, AUTH_ERROR, REAUTH } from '../actions';

export default function(state={}, action) {
  switch (action.type) {
    case AUTH:
      return { ...state, authenticated: true };
    case REAUTH:
      return { ...state, authenticated: true };
    case UNAUTH:
      return { ...state, authenticated: false };
    case AUTH_ERROR:
      return { ...state, error: action.payload };
  }
  return state;
}