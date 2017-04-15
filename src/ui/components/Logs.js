import { remote } from 'electron';
import fs from 'fs';
import promisify from 'es6-promisify';
import React from 'react';
import ReactDOM from 'react-dom';
import T from 'i18n-react';
import LogStore from '../stores/LogStore';
import LogActions from '../actions/LogActions';

const writeFile = promisify( fs.writeFile );

const saveLogsToClipboard = (messages) => {
    if( messages.length === 0) return;

    remote.clipboard.writeText( messages.join( '\n' ) );
    remote.dialog.showMessageBox({
        type: 'info',
        title: T.translate( 'Log Copied' ),
        buttons: [ T.translate( 'OK' ) ],
        message: T.translate( 'Your log file has been copied successfully' )
    });
}

const saveLogsToFile = async (messages) => {
    if( messages.length === 0) return;

    const path = remote.dialog.showSaveDialog({
        title: T.translate( 'Select path for log file' ),
        filters: [{
            name: T.translate( 'Log files' ),
            extensions: [ 'log' ]
        }]
    });

    try {
        await writeFile( path, messages.join( '\n' ) );

        remote.dialog.showMessageBox({
            type: 'info',
            title: T.translate( 'Log saved!' ),
            buttons: [ T.translate( 'OK' ) ],
            message: T.translate( 'Your log file has been saved successfully.' )
        });
    }
    catch( e ) {
        remote.dialog.showErrorBox(
            T.translate( 'Unable to save log path' ),
            T.translate( 'Looks like we can\'t save the log file.\nTry again with another path' )
        );
    }
}

class LogViewer extends React.Component {
    constructor( props ) {
        super( props );

        const { messages } = LogStore.getState();
        this.state = { messages };
    }

    componentDidMount() {
        LogStore.listen( ({messages}) => {
            this.setState({ messages });
        });
    }

    render() {
        const { messages } = this.state;

        return (
            <section className="logs">
                <h1 className="title">{T.translate('Connection report')}</h1>

                <textarea name="description" value={messages.join( '\n' )} readOnly />

                <div className="actions">
                    <button type="submit" onClick={async () => saveLogsToFile( messages )}>
                        <p>{T.translate('Export')}</p>
                    </button>

                    <button type="submit" onClick={() => saveLogsToClipboard( messages )}>
                        <p>{T.translate('Copy to clipboard')}</p>
                    </button>
                </div>
            </section>
        );
    }
}

export default LogViewer;