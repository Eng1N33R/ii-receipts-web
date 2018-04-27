import React from 'react';
import { Menu, Button, Responsive } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { IfAuthed, IfUnauthed } from './auth/Auth';

export default props => (
  <div>
    <div className="navbar-container">
      <Menu stackable className="navbar">
        <Menu.Item as={ Link } name="index" to="/" className="navbar-brand">Receipts</Menu.Item>
        {IfAuthed(
          <Menu.Menu position='left'>
              <Menu.Item>
                <Link to="/create">New</Link>
              </Menu.Item>
              <Menu.Item>
                <Link to="/session">Session</Link>
              </Menu.Item>
          </Menu.Menu>
        )}
        <Menu.Menu position='right'>
          <Responsive as={ Menu.Item } minWidth={768}>
            {IfUnauthed(<Button as={ Link } to="/login">Sign in</Button>)}
            {IfAuthed(<Button as={ Link } to="/logout">Sign out</Button>)}
          </Responsive>
          <Responsive as={ Menu.Item } maxWidth={768} className="navbar-responsive">
            {IfUnauthed(<Link to="/logout">Вход</Link>)}
            {IfAuthed(<Link to="/logout">Выход</Link>)}
          </Responsive>
        </Menu.Menu>
      </Menu>
    </div>
  </div>
);