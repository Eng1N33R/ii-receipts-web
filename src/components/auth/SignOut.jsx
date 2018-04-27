import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { signInAction } from '../../data/actions';
import { connect } from 'react-redux';

class Signin extends Component {
  render() {
    return (
      <h2><a href='#'>Sign out</a></h2>
    );
  }
}

function mapStateToProps(state) {
  return { errorMessage: state.auth.error };
}

const reduxFormSignin = reduxForm({
  form: 'signin'
})(Signin);

export default Signin;