import React from 'react';
import { Link } from 'react-router-dom';
import RetinaImage from 'react-retina-image';
import {t} from '../utils/localizationUtil';

var Sidebar = React.createClass({
    componentWillMount: function() {
        this.start = Date.now();
    },
    render: function() {
        return (
            <ul className="sidebar">
                <Link to="/">
                    <li>
                        <RetinaImage src="icons/Dashboard%20Icon.png"/>
                        <p>{t('dashboard')}</p>
                    </li>
                </Link>
                <Link to="/preferences">
                    <li>
                        <RetinaImage src="icons/Country%20Selection.png"/>
                        <p>{t('preferences')}</p>
                    </li>
                </Link>
            </ul>
        );
    }
});

module.exports = Sidebar;