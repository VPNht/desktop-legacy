import React from 'react';
import { Link } from 'react-router-dom';
import Image from 'react-retina-image';
import T from 'i18n-react';

const Menu = () => (
    <ul className="sidebar">
        <Link to="/">
            <li>
                <Image src="icons/dashboard.png"/>
                <p>{T.translate('DASHBOARD')}</p>
            </li>
        </Link>
        <Link to="/preferences">
            <li>
                <Image src="icons/preferences.png"/>
                <p>{T.translate('PREFERENCES')}</p>
            </li>
        </Link>
        <Link to="/logs">
            <li>
                <Image src="icons/logs.png"/>
                <p>{T.translate('CONNECTION_REPORT')}</p>
            </li>
        </Link>
    </ul>
);

export default Menu;