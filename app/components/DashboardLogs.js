import { connect } from 'react-redux';
import { remote } from 'electron';
import fs from 'fs';
import React, { Component, PropTypes } from 'react';

import { translate } from '../utils/localizationUtil';

const { clipboard, dialog } = remote;

@connect(store => {
  return {
    logs: store.logReducer.logs
  }
})
export default class DashboardLogs extends Component {

  static propTypes = {
    logs: PropTypes.array.isRequired
  };

  static defaultProps = {
    logs: []
  };

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  handleExportLogs() {
    const args = {
      title: translate('Select path for log file'),
      filters: [{
        name: translate('Log files'),
        extensions: ['log']
      }]
    };

    remote.dialog.showSaveDialog(args, (filename) => {
      fs.writeFile(filename, this.props.logs.join('\n'), err => {
        if (err) {
          dialog.showErrorBox(
            translate('Unable to save log path'),
            translate('Looks like we can\'t save the log file. Try again with another path.')
          );
        } else {
          dialog.showMessageBox({
            type: 'info',
            title: translate('Log saved !'),
            buttons: [translate('OK')],
            message: translate('Your log file has been saved successfully.')
          });
        }
      });
    });
  }

  handleCopyClipboard() {
    clipboard.writeText(this.props.logs.join('\n'));
    dialog.showMessageBox({
      type: 'info',
      title: translate('Log Copied'),
      buttons: [translate('OK')],
      message: translate('Your log file has been copied successfully.')
    });
  }

  scrollToBottom() {
    const textarea = this.refs.logsTextarea;
    textarea.scrollTop = textarea.scrollHeight;
  }

  render() {
    return (
      <section>
        <h1 className="title">Connection report</h1>
        <textarea ref="logsTextarea" className="logs" name="description" value={this.props.logs.join('\n')} readOnly />
        <button className="left" type="submit" onClick={this.handleExportLogs.bind(this)}>
          <p>{translate('Export')}</p>
        </button>
        <button className="left" type="submit" onClick={this.handleCopyClipboard.bind(this)}>
          <p>{translate('Copy to clipboard')}</p>
        </button>
      </section>
    );
  }

}
