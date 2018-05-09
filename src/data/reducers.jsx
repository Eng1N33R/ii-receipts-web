import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import orderReducer from './reducers/orders';

import { ORDER_CREATED } from './actions';

const rootReducer = combineReducers({
    form: formReducer.plugin({
        orderWizard: (state, action) => {
            switch (action.type) {
                case ORDER_CREATED:
                    return undefined;
                default:
                    return state;
            }
        }
    }),
    orders: orderReducer
});

export default rootReducer;