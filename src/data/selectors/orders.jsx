import { createSelector } from 'reselect';

const getOrders = (state) => state.orders.session;
const getOrderFormData = (state) => state.form.orderWizard.values;

export const getSessionOrders = createSelector(
  [ getOrders ],
  (orders) => {
    return orders.map(o => ({ id: o.id, date: o.order.date, pdfUri: o.order.pdfUri, price: o.order.entries.reduce((acc, current) => acc + current.product.price * current.amount, 0) }));
  }
);

export const getOrderFormEntries = createSelector(
  [ getOrderFormData ],
  (data) => {
    if (!data || !data.entries || data.entries.length == 0) {
      return [];
    }

    return data.entries.map((x) => parseInt(x.amount));
  }
);