[![Build Status](https://ci.vpn.ht/buildStatus/icon?job=Desktop)](https://ci.vpn.ht/job/Desktop/)

[![VPN.ht Logo](http://i.imgur.com/qXmqrQA.png)](https://vpn.ht)

## Contributing to VPN.ht

### Getting Started

- `npm install`

To run the app in development:

- `npm start`

Running `npm start` will download and install [Electron](http://electron.atom.io/).

### Building & Release

- `npm run release`

## Architecture

### Overview

**Note: This architecture is work in progress and doesn't reflect the current state of the app, yet!**

VPN.ht is an application built using [electron](https://github.com/atom/electron). While it's work in progress, the goal is to make VPN.ht a high-performance, portable Javascript ES6 application built with React and Flux (using [alt](https://github.com/goatslacker/alt). It adopts a single data flow pattern:

```
╔═════════╗       ╔════════╗       ╔═════════════════╗
║ Actions ║──────>║ Stores ║──────>║ View Components ║
╚═════════╝       ╚════════╝       ╚═════════════════╝
     ^                                      │
     └──────────────────────────────────────┘
```

There are three primary types of objects:
- **Actions**: Interact with the system (OpenVPN, Hub, etc)
- **Views**: Views make up the UI, and trigger available actions.
- **Stores**: Stores store the state of the application.

and since VPN.ht has a large amount of interaction with outside systems, we've added utils:
- **Utils**: Utils interact with APIs, outside systems, CLI tools and generate. They are called by user-generated actions and in return, also create actions based on API return values, CLI output etc.

### Guidelines

- Avoid asynchronous code in Actions, Stores or Views. Instead, put code involving callbacks, promises or generators in utils or actions.

## Copyright and License

Code released under the [GPLv3](LICENSE).
Images are copyrighted by VPN.ht Limited
