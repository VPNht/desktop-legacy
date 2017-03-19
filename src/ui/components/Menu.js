import React from 'react';
import { Link } from 'react-router-dom';
import Image from 'react-retina-image';
import {t} from '../utils/localizationUtil';

const Menu = () => (
    <ul className="sidebar">
        <Link to="/">
            <li>
                <Image src="icons/Dashboard%20Icon.png"/>
                <p>{t('dashboard')}</p>
            </li>
        </Link>
        <Link to="/preferences">
            <li>
                <Image src="icons/Country%20Selection.png"/>
                <p>{t('preferences')}</p>
            </li>
        </Link>
    </ul>
);

export default Menu;