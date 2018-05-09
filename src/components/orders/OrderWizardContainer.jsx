import React, { Component } from 'react';
import { createOrder } from '../../data/actions';
import { connect } from 'react-redux';
import OrderWizard from './OrderWizard';

class OrderWizardContainer extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(values) {
    this.props.createOrder(values);
  }

  render() {
    return (
      <OrderWizard 
        onSubmit={this.handleSubmit} />
    );
  }
}

export default connect(null, { createOrder })(OrderWizardContainer);