import { apiRequest } from '../requests';
import moment from 'moment';

export const ORDER_CREATED = 'ORDER_CREATED';
export const ORDER_FAILED = 'ORDER_FAILED';

export function createOrder(values) {
  return (dispatch) => {
    const data = {
      date: moment().toISOString(),
      orderEntries: JSON.stringify(values.entries),
    }
    apiRequest('orders', { method: 'post', data }).then((res) => {
      const { id, ...order } = res.data;
      dispatch({
        type: ORDER_CREATED,
        payload: {id, order: {...order}}
      });
    }).catch((err) => {
      dispatch({
        type: ORDER_FAILED,
        payload: err.response
      })
    });
  }
}