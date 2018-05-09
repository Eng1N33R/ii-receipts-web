import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';
import { connect } from 'react-redux';
import { Field, FieldArray, reduxForm } from 'redux-form';
import { getOrderFormEntries } from '../../data/selectors';
import { apiRequest } from '../../data/requests';
import axios from 'axios';
import uuidValidate from 'uuid-validate';
import update from 'immutability-helper';

import { Table, Button, Input } from 'semantic-ui-react';

const validate = values => {
  const errors = {};

  if (!values.date) {
    errors.date = 'Required';
  }

  if (!values.entries || !values.entries.length) {
    errors.entries = { _error: 'At least one entry must exist' };
  } else {
    const entriesArrayErrors = [];
  
    values.entries.forEach((entry, entryIndex) => {
      const entryErrors = {};
      if (!entry || !entry.product || entry.product === '') {
        entryErrors.product = 'Required';
        entriesArrayErrors[entryIndex] = entryErrors;
      }
      if (entry && entry.product && !uuidValidate(entry.product)) {
        entryErrors.product = 'Invalid ID';
        entriesArrayErrors[entryIndex] = entryErrors;
      }
      if (!entry || !entry.amount) {
        entryErrors.amount = 'Required';
        entriesArrayErrors[entryIndex] = entryErrors;
      }
    });
  
    if (entriesArrayErrors.length) {
      errors.entries = entriesArrayErrors;
    }
  }

  return errors;
};

class ValidatedField extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="order-wizard__input-container">
        <Input className="order-wizard__input" {...this.props.input} type={this.props.type} placeholder={this.props.label} />
        {this.props.meta.touched && this.props.meta.error && <span className="order-wizard__validation-error">{this.props.meta.error}</span>}
      </div>
    );
  }
}

class ProductField extends Component {
  constructor(props) {
    super(props);
    this.state = {value: '', data: []};
    this.cancelSource = axios.CancelToken.source();
  }

  onChange = (event, { newValue }) => {
    this.setState({
      value: (newValue instanceof String ? newValue : '' )
    });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.cancelSource.cancel('new input received');
    this.cancelSource = axios.CancelToken.source();
    apiRequest(`products/find/${value}/10`, { cancel: this.cancelSource.token })
      .then((res) => {
        this.setState({ data: res.data });
      }).catch(() => {});
  };

  onSuggestionsClearRequested = () => {
    this.setState({ data: [] });
  };

  getDataValue(x, input) {
    input.onChange(x.id);
    return x.id;
  }

  renderData(x) {
    return <div>{x.name} ({x.id})</div>;
  }

  render() {
    const { value, data } = this.state;

    const inputProps = {
      placeholder: this.props.label,
      value,
      name: this.props.name,
      onChange: this.onChange,
      ref: 'input',
      type: this.props.type,
      className: 'order-wizard__input',
      ...this.props.input
    };

    const renderInput = inputProps => (<Input {...inputProps} />);

    return (
      <div className="order-wizard__input-container">
        <Autosuggest
          suggestions={data}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          onSuggestionSelected={(e, d) => this.props.onUpdate(this.props.index, d.suggestion.price)}
          getSuggestionValue={x => this.getDataValue(x, this.props.input)}
          renderSuggestion={this.renderData}
          inputProps={inputProps}
          renderInputComponent={renderInput}
        />
        {this.props.meta.touched && this.props.meta.error && <span className="order-wizard__validation-error">{this.props.meta.error}</span>}
      </div>
    );
  }
}

class OrderEntryArray extends Component {
  constructor(props) {
    super(props);
    this.state = { prices: [] };
    this.cancelSource = axios.CancelToken.source();

    this.getPrice = this.getPrice.bind(this);
    this.updatePrice = this.updatePrice.bind(this);
    this.sumPrices = this.sumPrices.bind(this);
  }

  getPrice(index) {
    if (this.state.prices[index] === undefined) {
      return 0;
    }
    return this.state.prices[index];
  }

  updatePrice(index, price) {
    this.setState({
      prices: update(this.state.prices, {[index]: price})
    });
  }

  sumPrices() {
    const price = this.props.formEntries.map((x, i) => x * this.getPrice(i))
      .reduce((prev, next) => prev + next, 0);
    return (isNaN(price) ? 0 : price).toFixed(2);
  }

  priceFor(index) {
    const price = this.props.formEntries[index] * this.getPrice(index);
    return (isNaN(price) ? 0 : price).toFixed(2);
  }

  render() {
    return (
      <div>
        <div>
          <h2>New order</h2>
          <Button type="button" onClick={() => this.props.fields.push({})}>Add entry</Button>
          {this.props.meta.touched && this.props.meta.error && <span className="order-wizard__validation-error">{this.props.meta.error}</span>}
        </div>
        <Table celled>
          <Table.Header>
            <Table.Row>
                <Table.HeaderCell width={1}></Table.HeaderCell>
                <Table.HeaderCell width={11}>Product</Table.HeaderCell>
                <Table.HeaderCell width={3}>Amount</Table.HeaderCell>
                <Table.HeaderCell width={1}>Price</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {this.props.fields.map((entry, index) =>
              <Table.Row key={index}>
                <Table.Cell style={{textAlign: 'center'}}>
                  <button className="order-wizard__remove-entry"
                    onClick={() => {
                      this.props.fields.remove(index);
                      this.setState({
                        prices: update(this.state.prices, { [index]: undefined })
                      });
                    }}>x</button>
                </Table.Cell>
                <Table.Cell>
                  <Field
                    name={`${entry}.product`}
                    type="text"
                    component={ProductField}
                    label="Product ID"
                    index={index}
                    onUpdate={this.updatePrice} />
                </Table.Cell>
                <Table.Cell>
                  <Field
                    name={`${entry}.amount`}
                    type="number"
                    component={ValidatedField}
                    label="Amount"/>
                </Table.Cell>
                <Table.Cell>
                  <span>£{this.priceFor(index)}</span>
                </Table.Cell>
              </Table.Row>
            )}
            <Table.Row>
              <Table.Cell colSpan={3} style={{textAlign: 'right', fontWeight: 'bold'}}>
                <span>Total</span>
              </Table.Cell>
              <Table.Cell style={{fontWeight: 'bold'}}>
                <span>£{this.sumPrices()}</span>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </div>
    );
  }
}

const OrderWizard = (props) => {
  const { handleSubmit, submitting, formEntries } = props;

  return (
    <form className={'order-wizard ' + (submitting ? 'order-wizard--submitting' : '')} onSubmit={handleSubmit}>
      <FieldArray name="entries" formEntries={formEntries} component={OrderEntryArray}/>
      <div>
        <Button className="order-wizard__submit" type="submit" disabled={submitting}>Submit</Button>
      </div>
    </form>
  );
};

const mapStateToProps = (state) => { 
  return { formEntries: getOrderFormEntries(state) };
};

export default reduxForm({
  form: 'orderWizard',
  validate
})(connect(mapStateToProps)(OrderWizard));