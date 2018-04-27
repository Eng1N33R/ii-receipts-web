import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

export function AuthedRoute(ComposedComponent) {
  class AuthedRoute extends Component {
    componentWillMount() {
      if (!this.props.authenticated) {
        this.props.history.push('/login');
      }
    }

    componentWillUpdate(nextProps) {
      if (!nextProps.authenticated) {
        this.props.history.push('/login');
      }
    }

    PropTypes = {
      router: PropTypes.object,
    }

    render() {
      return <ComposedComponent {...this.props} />;
    }
  }

  function mapStateToProps(state) {
    return { authenticated: state.auth.authenticated };
  }

  return connect(mapStateToProps)(AuthedRoute);
}

export function UnauthedRoute(ComposedComponent) {
  class UnauthedRoute extends Component {
    componentWillMount() {
      if (this.props.authenticated) {
        this.props.history.goBack();
      }
    }

    componentWillUpdate(nextProps) {
      if (nextProps.authenticated) {
        this.props.history.goBack();
      }
    }

    PropTypes = {
      router: PropTypes.object,
    }

    render() {
      return <ComposedComponent {...this.props} />;
    }
  }

  function mapStateToProps(state) {
    return { authenticated: state.auth.authenticated };
  }

  return connect(mapStateToProps)(UnauthedRoute);
}

export function IfAuthed(renderedComp) {
  class IfAuthed extends Component {
    render() {
      return this.props.authenticated ? renderedComp : null;
    }
  }

  function mapStateToProps(state) {
    return { authenticated: state.auth.authenticated };
  }

  return React.createElement(connect(mapStateToProps)(IfAuthed));
}

export function IfUnauthed(renderedComp) {
  class IfUnauthed extends Component {
    render() {
      return !this.props.authenticated ? renderedComp : null;
    }
  }

  function mapStateToProps(state) {
    return { authenticated: state.auth.authenticated };
  }

  return React.createElement(connect(mapStateToProps)(IfUnauthed));
}