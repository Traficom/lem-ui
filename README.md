# VLEM UI

![master](https://github.com/Traficom/lem-ui)

VLEM UI is a desktop user interface for [Model System](https://github.com/Traficom/lem-model-system). 
 If you wish to develop the UI, continue below.

## Development requirements

This is an [Electron](https://electrojs.org) application written in JavaScript _([NodeJS API](https://nodejs.org/api/)
and [Electron API](https://www.electronjs.org/docs/api) available within app)_, HTML and CSS.

- Git client
- Node.js LTS & NPM
- EMME 4.x.x _(Windows-only)_
- _[optionally]_ [model-system](https://swd.int.traficom.fi/stash/projects/VLE/repos/model-system) _(otherwise downloaded and auto-installed by the UI)_

On Mac and Linux, [Wine](https://www.winehq.org/) and [Mono](https://www.mono-project.com/) are also required to make the app for Windows.

## Setup

Due to tight integration with EMME, the application is mainly targeted for Windows but can be developed on Mac and Linux as well.
However, the final testing should always happen on Windows with Emme.

```
$ git clone <this repository>
$ npm install
```

EMME and EMME-Python versions can be set in [versions.js](src/versions.js), affecting the automatic resolving of Python binary.

## Running and building

`npm start` command is used to start the application in development environment. Running `npm run make` will create an installer binary to be distributed to end-users.

See also: [Electronforge.io](https://www.electronforge.io/)

## Version control

[GitHub](https://github.com/Traficom/lem-ui) is used as the primary tool for version control and `master` branch is the main development line.
All changes should be made in dedicated feature/bugfix branches, followed by a and a peer-review.
Then, after all checks have passed, the branch may be merged in `master`.