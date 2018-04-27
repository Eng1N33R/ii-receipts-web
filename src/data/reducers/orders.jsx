import { ORDER_CREATED, ORDER_FAILED } from '../actions';

export default function(state={success: true, session: []}, action) {
  switch (action.type) {
    case ORDER_CREATED: {
      console.log('order created')
      const newState = { ...state, success: true };
      newState.session.push({ ...action.payload });
      return newState;
    }
    case ORDER_FAILED: {
      const newState = { ...state, success: false, error: action.payload };
      return newState;
    }
  }
  return state;
}