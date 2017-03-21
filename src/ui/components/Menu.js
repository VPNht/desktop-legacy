import React from 'react';
import { Link } from 'react-router-dom';
import Image from 'react-retina-image';
import T from 'i18n-react';

const Menu = () => (
    <ul className="sidebar">
        <Link to="/">
            <li>
                <Image src="icons/Dashboard%20Icon.png"/>
                <p>{T.translate('dashboard')}</p>
            </li>
        </Link>
        <Link to="/preferences">
            <li>
                <Image src="icons/Country%20Selection.png"/>
                <p>{T.translate('preferences')}</p>
            </li>
        </Link>
    </ul>
);

export default Menu;