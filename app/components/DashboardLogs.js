import fs from 'fs';
import React, { Component, PropTypes } from 'react';
import { remote } from 'electron';

export default class DashboardLogs extends Component {

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  handleExportLogs() {
    console.log('handleExportLogs');

    const args = {
      title: 'Select path for log file',
      filters: [{
        name: 'Log files',
        extensions: ['log']
      }]
    };

    remote.dialog.showSaveDialog(args, (filename) => {
      // fs.writeFile(filename, this.props.logs.join("\n"), err => {
      fs.writeFile(filename, 'logs', (err) => {
        if (err) {
          remote.dialog.showErrorBox('Unable to save log path', 'Looks like we can\'t save the log file. Try again with another path.');
        } else {
          remote.dialog.showMessageBox({
            type: 'info',
            title: 'Log saved !',
            buttons: ['OK'],
            message: 'Your log file has been saved successfully.'
          });
        }
      });
    });
  }

  handleCopyClipboard() {
    console.log('handleCopyClipboard');

    remote.clipboard.writeText(this.props.logs.join('\n'));
    remote.dialog.showMessageBox({
      type: 'info',
      title: 'Log Copied',
      buttons: ['OK'],
      message: 'Your log file has been copied successfully.'
    });
  }

  scrollToBottom() {
    const textarea = this.refs.logsTextarea;
    textarea.scrollTop = textarea.scrollHeight;
  }

  render() {
    const logs = 'logs';

    return (
      <section>
        <h1 className="title">Connection report</h1>
        <textarea ref="logsTextarea" className="logs" name="description" value={logs} readOnly />
        <button className="left" type="submit" onClick={this.handleExportLogs.bind(this)}>
          <p>Export</p>
        </button>
        <button className="left" type="submit" onClick={this.handleCopyClipboard.bind(this)}>
          <p>Copy to clipboard</p>
        </button>
      </section>
    );
  }

}

DashboardLogs.propTypes = {
  logs: PropTypes.string
};
