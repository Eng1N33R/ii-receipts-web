import React from 'react';
import { render } from 'react-dom';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import reduxThunk from 'redux-thunk';
import reducers from './data/reducers';

import { BrowserRouter, Switch, Route } from 'react-router-dom';

import { AuthedRoute, UnauthedRoute } from './components/auth/Auth';
import Navbar from './components/Navbar';
import SignIn from './components/auth/SignIn';
import Home from './components/Home';
import Callback from './components/auth/Callback';
import OrderWizardContainer from './components/orders/OrderWizardContainer';
import OrderList from './components/orders/OrderList';

import { AUTHED } from './data/actions';
import { refreshToken } from './data/actions';

import './static/scss/style.scss';

const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);
const store = createStoreWithMiddleware(
    reducers,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

const user = localStorage.getItem('user');

if (user) {
  refreshToken(user, localStorage.getItem('refresh'))(store.dispatch);
}

render(
    <Provider store={store}>
        <BrowserRouter>
            <div>
                <Navbar />
                <Switch>
                    <Route exact path="/" component={AuthedRoute(Home)} />
                    <Route path="/login" component={UnauthedRoute(SignIn)} />
                    <Route path="/create" component={AuthedRoute(OrderWizardContainer)} />
                    <Route path="/session" component={AuthedRoute(OrderList)} />
                    <Route path="/callback" component={Callback} />
                </Switch>
            </div>
        </BrowserRouter>
    </Provider>,
    document.querySelector('#app')
);