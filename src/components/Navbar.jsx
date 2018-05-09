import React from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

export default () => (
  <div>
    <div className="navbar-container">
      <Menu stackable className="navbar">
        <Menu.Item as={ Link } name="index" to="/" className="navbar-brand">Receipts</Menu.Item>
        <Menu.Menu position="left">
          <Menu.Item>
            <Link to="/create">New</Link>
          </Menu.Item>
          <Menu.Item>
            <Link to="/session">Session</Link>
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    </div>
  </div>
);