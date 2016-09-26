const RNFS = require('react-native-xsy-fs');
const ZipArchive = require('react-native-xsy-zip-archive')
const { NativeModules, Platform, NetInfo } = require('react-native');
const upgrade = NativeModules.XSYUpgrade;

export default class XSYUpgrade {
    constructor(param) {
        this.checkUpdateUrl = param['checkUpdateUrl'];
    }

    async  copyFolder(currentVersion, versionPath, folderName) {
        let assetsSourcePath = `${RNFS.DocumentDirectoryPath}/js/${currentVersion}/${folderName}/`;
        let assetsTargetPath = `${versionPath}${folderName}/`;
        console.log('assetsSourcePath,assetsTargetPath', assetsSourcePath + ',' + assetsTargetPath);
        await RNFS.mkdir(assetsTargetPath);
        await RNFS.copyFile(assetsSourcePath, assetsTargetPath)
            .then(n => {
                // console.log('copy finished!  ', n);
            });
    }

    async checkUpgrade() {
        let {checkUpdateUrl} = this.checkUpdateUrl;
        console.log('Network detecting...',NativeModules,upgrade);
        let reach = await NetInfo.fetch();
        console.log('Network detecting...', reach, typeof reach);
        if (reach === 'none') {
            console.log('No network connecting! Update canceled!');
            return;
        }
        let currentVersion = await upgrade.currentVersion();
        if(currentVersion == undefined){
            await upgrade.setVersion('1.0.0');
        }
        let baseVersion = await upgrade.baseVersion();
        let arVersions = await fetch(url)
            .query({
                currentVersion:currentVersion,
                type:Platform.OS === 'ios' ? 2 : 1,
                _:new Date
            })
            .then(res => res.json())
            .then(json => json.body.diffVersions)
            .catch(ex => console.log(ex.stack));

        console.log('RNFS.DocumentDirectoryPath:  ', RNFS.DocumentDirectoryPath);
        console.log(Array.isArray(arVersions) && arVersions.length);
        if (Array.isArray(arVersions) && arVersions.length) {
            for (let zipPath, versionPath, jsbundlePath, oUrl, i = 0, len = arVersions.length; i < len; i++) {
                const { version, url } = arVersions[i];
                versionPath = `${RNFS.DocumentDirectoryPath}/js/${version}/`;
                jsbundlePath = `${versionPath}patch.ios.jsbundle`;

                //复制图片资源start 
                if (Platform.OS == 'ios') {
                    console.log('currentVersion, baseVersion', currentVersion, baseVersion);
                    let isCurr = parseInt(await upgrade.versionDesc(currentVersion, baseVersion), 10),
                        assetsSourcePath, assetsTargetPath;
                    console.log('isCurr', isCurr, typeof (isCurr));
                    if (isCurr) {
                        assetsSourcePath = `${RNFS.DocumentDirectoryPath}/js/${currentVersion}/assets/`;
                    } else {
                        assetsSourcePath = `${RNFS.MainBundlePath}/assets/`;
                        await RNFS.unlink(`${RNFS.DocumentDirectoryPath}/js`);
                    }

                    assetsTargetPath = `${versionPath}assets/`;
                    currentVersion = version;

                    console.log('assetsSourcePath, assetsTargetPath', assetsSourcePath, assetsTargetPath);

                    await RNFS.mkdir(assetsTargetPath);

                    await RNFS.copyFile(assetsSourcePath, assetsTargetPath)
                        .then(n => {
                            // console.log('copy finished!  ', n);
                        });
                } else {
                    await copyFolder(currentVersion, versionPath, 'drawable-hdpi');
                    await copyFolder(currentVersion, versionPath, 'drawable-mdpi');
                    await copyFolder(currentVersion, versionPath, 'drawable-xhdpi');
                    await copyFolder(currentVersion, versionPath, 'drawable-xxhdpi');
                    await copyFolder(currentVersion, versionPath, 'drawable-xxxhdpi');

                }
                //复制图片资源end

                console.log('Updating to ', version);
                // oUrl = new URL(url);
                console.log('zipPath', zipPath);
                zipPath = `${RNFS.DocumentDirectoryPath}/${url.split('/').pop()}`;
                console.log('zipPath', zipPath);
                await RNFS.downloadFile({
                    fromUrl: `${url}?${Math.random()}`,
                    toFile: zipPath
                })
                    .then(() => ZipArchive.unzip(zipPath, versionPath))
                    .then(() => upgrade.combine(jsbundlePath, version))
                    .then(() => Promise.all([RNFS.unlink(zipPath), RNFS.unlink(jsbundlePath)]))
                    .catch(ex => console.error(ex.stack))
            }
            console.log('Upgrade success!');
        } else {
            console.log('Up to date!');
        }
    }


}


