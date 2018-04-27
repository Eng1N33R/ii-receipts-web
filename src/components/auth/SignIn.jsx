import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { signInAction } from '../../data/actions';
import { connect } from 'react-redux';

class Signin extends Component {
  render() {
    return (
      <div style={{textAlign: 'center'}}>
        <h2><a href='http://localhost:8080/oauth/authorize?response_type=code&client_id=client&redirect_uri=http://localhost:8081/callback&state=123'>Sign in</a></h2>
      </div>
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