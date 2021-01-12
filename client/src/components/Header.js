import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <div className="ui pointing menu">
            <Link to="/" className="item">
                <img src='/favicon.ico' alt='favicon' />
            </Link>
            <div className="right menu">
            <Link to="/" className="item">
                Prediction market
            </Link>
            <Link to="/markets/new" className="item">
                +
            </Link>
            </div>
        </div>
    );
}

export default Header;