import React from 'react';
import { render } from 'react-dom';

import { Provider, connect } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import reducers from './data/reducers';
import { getSessionOrders } from './data/selectors';
import { apiRequest } from './data/requests';

import Navbar from './components/Navbar';
import Home from './components/Home';
import OrderWizardContainer from './components/orders/OrderWizardContainer';
import OrderList from './components/orders/OrderList';
import OrderListContainer from './components/orders/OrderListContainer';
import Error404 from './components/Error404';

import './static/scss/style.scss';

const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);
const store = createStoreWithMiddleware(
  reducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const SessionOrderList = connect((state) => ({ orders: getSessionOrders(state) }))(OrderList);
const AllOrderList = OrderListContainer(
  (updater) => apiRequest('orders')
    .then((res) => {
      const orders = res.data.map(o => ({
        id: o.id,
        date: o.date,
        pdfUri: o.pdfUri,
        price: o.entries.reduce((acc, current) => acc + current.product.price * current.amount, 0)
      }));
      const state = { orders };
      updater(state);
    })
);

render(
  <Provider store={store}>
    <BrowserRouter>
      <div>
        <Navbar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/create" component={OrderWizardContainer} />
          <Route path="/all" component={AllOrderList} />
          <Route path="/session" component={SessionOrderList} />
          <Route component={Error404} />
        </Switch>
      </div>
    </BrowserRouter>
  </Provider>,
  document.querySelector('#app')
);