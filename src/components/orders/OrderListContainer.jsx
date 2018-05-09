import React, { Component } from 'react';
import OrderList from './OrderList';

export default (orderMapper) => {
  class ComposedOrderList extends Component {
    constructor(props) {
      super(props);
      this.state = {};
      this.setState = this.setState.bind(this);
    }

    componentDidMount() {
      orderMapper(this.setState);
    }

    render() {
      return <OrderList orders={this.state.orders} />;
    }
  }

  return ComposedOrderList;
};