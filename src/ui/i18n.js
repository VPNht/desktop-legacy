import _ from 'lodash';
import T from 'i18n-react';
import en from '../translations/en.json';
import fr from '../translations/fr.json';

const languages = { en, fr };
const language = navigator.language.toLocaleLowerCase().substr( 0, 2 );
const translations = _.get( languages, language, languages['en'] );
T.setTexts( translations );