const { utils: { fromBuildIdentifier } } = require('@electron-forge/core');
const packageJson = require('./package.json');

/**
 * Electron Forge config.
 *
 * https://www.electronforge.io/config/makers/squirrel.windows
 * https://www.electronforge.io/config/makers/zip
 * https://www.electronforge.io/config/publishers/github
 */
module.exports = {
    // Previously, buildIdentidier was either 'prod' or 'beta'. Now, it is always 'prod'.
    buildIdentifier: 'prod',
    packagerConfig: {
        appBundleId: fromBuildIdentifier({ prod: 'fi.traficom.lem.ui', beta: 'fi.traficom.beta.lem.ui' }),
        icon: "./appicons/icons/win/favicon.ico"
    },
    makers: [
        {
            name: "@electron-forge/maker-squirrel",
            config: {
                name: "lem",
                authors: "Traficom, Helsingin Seudun Liikenne -kuntayhtyma",
                // iconUrl: "https://raw.githubusercontent.com/HSLdevcom/helmet-ui/e3714d944c62c6ba4b8ed1ce8ac57fcbecaf0f13/helmet.ico",
                // loadingGif: '',
                // setupIcon: 'helmet.ico',
            }
        },
        {
            name: "@electron-forge/maker-zip",
        },
        {
            name: "@electron-forge/maker-deb",
            config: {}
        },
    ],
    publishers: [
        {
            name: '@electron-forge/publisher-github',
            config: {
                repository: {
                    owner: 'Traficom',
                    name: 'lem-ui'
                },
                draft: true,
                prerelease: false,
                authToken: process.env.GITHUB_TOKEN,
                tagName: packageJson.version,
            }
        }
    ]
}
