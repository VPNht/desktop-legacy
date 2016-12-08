import path from 'path';

export default class ResourcesUtil {

  static resourceDir() {
    return process.env.BIN_PATH;
  }

  static macsudo() {
    return path.join(this.resourceDir(), 'macsudo');
  }

}
