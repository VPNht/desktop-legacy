function push(line, obj) {
  let log = false;
  if (obj) {
    log = line.toUpperCase();
    log += JSON.stringify(obj, null, 1)
      .replace(/[\"{}\[\],]/g, '')
      .replace(/\n\s*\n/g, '\n')

    log = log.substring(0, log.lastIndexOf('\n'));
  } else {
    log = line.toUpperCase();
  }

  return log;
}

export const types = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG',
  CLEAR: 'CLEAR'
}

export function error(line, obj) {
  const d = new Date();

  return {
    type: types.ERROR,
    payload: push(`[ERROR] ${d.toLocaleString()} ${line}`, obj)
  };
}

export function warn(line, obj) {
  const d = new Date();

  return {
    type: types.WARN,
    payload: push(`[WARN] ${d.toLocaleString()} ${line}`, obj)
  };
}

export function info(line, obj) {
  const d = new Date();

  return {
    type: types.INFO,
    payload: push(`[INFO] ${d.toLocaleString()} ${line}`, obj)
  };
}

export function debug(line, obj) {
  const d = new Date();

  return {
    type: types.DEBUG,
    payload: push(`[DEBUG] ${d.toLocaleString()} ${line}`, obj)
  };
}

export function clear() {
  return {
    type: types.CLEAR,
    payload: []
  };
}
