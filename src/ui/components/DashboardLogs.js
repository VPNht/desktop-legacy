import React from 'react';
import ReactDOM from 'react-dom';
import T from 'i18n-react';
import Router from 'react-router';
import {remote} from 'electron';
import fs from 'fs';

import LogStore from '../stores/LogStore';

var _prevBottom = 0;

var DashboardLogs = React.createClass({

    getInitialState: function() {
        return {
            logs: []
        };
    },

    componentDidMount: function() {
        this.update();
        this.scrollToBottom();
        LogStore.on(LogStore.SERVER_LOGS_EVENT, this.update);
    },

    componentDidUpdate: function() {
        this.scrollToBottom();
    },

    componentWillUnmount: function() {
        LogStore.removeListener(LogStore.SERVER_LOGS_EVENT, this.update);
    },

    scrollToBottom: function() {
        var textarea = ReactDOM.findDOMNode(this.refs.logsTextarea);
        textarea.scrollTop = textarea.scrollHeight;
    },

    update: function() {
        if (this.isMounted()) {
            this.setState({
                logs: LogStore.logs()
            });
        }
    },

    handleCopyClipboard: function() {

        remote
            .clipboard
            .writeText(this.state.logs.join("\n"));

        remote
            .dialog
            .showMessageBox({
                type: 'info',
                title: T.translate('Log Copied'),
                buttons: [T.translate('OK')],
                message: T.translate('Your log file has been copied successfully.')
            });
    },

    handleExportLogs: function() {
        var args = {
            title: T.translate('Select path for log file'),
            filters: [{
                name: T.translate('Log files'),
                extensions: ['log']
            }]
        };

        var dialog = remote.dialog;
        var self = this;

        dialog.showSaveDialog(args, function(filename) {
            fs.writeFile(filename, self.state.logs.join("\n"), function(err) {
                if (err) {
                    dialog.showErrorBox(T.translate('Unable to save log path'), t("Looks like we can't save the log file. Try again with another path."))
                } else {
                    dialog.showMessageBox({
                        type: 'info',
                        title: T.translate('Log saved!'),
                        buttons: [T.translate('OK')],
                        message: T.translate('Your log file has been saved successfully.')
                    });
                }

            });
        })
    },

    render: function() {

        var logs = this.state.logs.join("\n");

        return (
            <section>
                <h1 className="title">{T.translate('Connection report')}</h1>
                <textarea ref="logsTextarea" className="logs" name="description" value={logs} readOnly />
                <button className="left" type="submit" onClick={this.handleExportLogs}><p>{T.translate('Export')}</p></button>
                <button className="left" type="submit" onClick={this.handleCopyClipboard}><p>{T.translate('Copy to clipboard')}</p></button>
            </section>
        );

    }
});

module.exports = DashboardLogs;