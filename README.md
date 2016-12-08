# [![VPN.ht Logo](http://i.imgur.com/qXmqrQA.png)](https://vpn.ht)

[![Build Status](https://ci.vpn.ht/buildStatus/icon?job=Desktop)](https://ci.vpn.ht/job/Desktop/)
[![Dependency Status](https://david-dm.org/vpnht/desktop.svg)](https://david-dm.org/vpnht/desktop)
[![devDependency Status](https://david-dm.org/vpnht/desktop/dev-status.svg)](https://david-dm.org/vpnht/desktop#info=devDependencies)
[![optionalDependency Status](https://david-dm.org/vpnht/desktop/optional-status.svg)](https://david-dm.org/vpnht/desktop#info=optionalDependencies)

## Contributing to VPN.ht

### Getting Started

- `npm install`

To run the app in development:

- `npm run dev`

### Building & Release

- `npm run package`

## Architecture

### Overview

**Note: This architecture is work in progress and doesn't reflect the current state of the app, yet!**

VPN.ht is an application built using [electron](https://github.com/atom/electron). While it's work in progress, the goal is to make VPN.ht a high-performance, portable Javascript ES6 application built with [React](https://facebook.github.io/react/index.html) and [Redux](http://redux.js.org/). It adopts a single data flow pattern:

```
╔═════════╗    ╔══════════╗    ╔═══════╗    ╔══════╗
║ Actions ║───>║ Reducers ║───>║ Store ║───>║ View ║
╚═════════╝    ╚══════════╝    ╚═══════╝    ╚══════╝
    ^                                          │
    └──────────────────────────────────────────┘
```

There are three primary types of objects:
- **Actions**: Interact with the system. (OpenVPN, Hub, etc)
- **Reducers**:
- **Store**: Stores the state of the application.
- **Views**: Views make up the UI, and trigger available actions.

and since VPN.ht has a large amount of interaction with outside systems, we've added utils:
- **Utils**: Utils interact with APIs, outside systems, CLI tools and generate. They are called by user-generated actions and in return, also create actions based on API return values, CLI output etc.

### Guidelines

- Avoid asynchronous code in the Views. Instead, put code involving promises or async functions in Utils/APIs.

## Copyright and License

Code released under the [GPLv3](LICENSE).
Images are copyrighted by VPN.ht Limited
