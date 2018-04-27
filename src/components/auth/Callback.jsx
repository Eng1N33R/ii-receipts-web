import React, { Component } from 'react';
import queryString from 'query-string';
import { signInAction } from '../../data/actions';
import { connect } from 'react-redux';

class Callback extends Component {
  componentDidMount() {
    const auth_code = queryString.parse(this.props.location.search).code;
    this.props.signInAction({ auth_code }, this.props.history);
  }

  render() {
    return (<h2>Please wait...</h2>)
  }
}

function mapStateToProps(state) {
  return { errorMessage: state.auth.error };
}

export default connect(mapStateToProps, {signInAction})(Callback);