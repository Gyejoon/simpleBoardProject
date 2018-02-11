import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

class Header extends React.Component {
    render() {

        const loginButton = (
            <li>
                <Link to="/login">
                    <i className="material-icons">vpn_key</i>
                </Link>
            </li>
        );

        const logoutButton = (
            <li>
                <a>
                    <i className="material-icons">lock_open</i>
                </a>
            </li>
        );

        return (
            <nav>
              <div className="nav-wrapper blue">
                <Link to="/" className="brand-logo">SimpleBoard</Link>
                <ul className="brand-logo center">
                    <li><i className="material-icons prefix">search</i></li>
                    <li><input className="materialize-textarea center" placeholder="검색"></input></li>
                </ul>
                <div className="right">
                    <ul>
                        { this.props.isLoggedIn ? logoutButton : loginButton }
                    </ul>
                </div>
              </div>
            </nav>

        );
    }
}

Header.propTypes = {
    isLoggedIn: PropTypes.bool,
    onLogout: PropTypes.func
};

Header.defaultProps = {
    isLoggedIn: false,
    onLogout: () => { console.error("logout is not defined"); }
};

export default Header;
