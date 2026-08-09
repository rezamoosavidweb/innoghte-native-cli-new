const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * SVG files are compiled at bundle time via react-native-svg-transformer (SVGR).
 * Each `import Icon from '@/assets/icons/foo.svg'` becomes its own module — only
 * icons referenced from reachable JS are included in the bundle (no runtime SVG parsing).
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const defaultConfig = getDefaultConfig(__dirname);
const { assetExts, sourceExts } = defaultConfig.resolver;

module.exports = mergeConfig(defaultConfig, {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    // Watchman on Windows can stall indefinitely while registering this large
    // dependency tree. Metro's Node watcher is reliable once native outputs are
    // excluded by the block list below.
    useWatchman: false,
    assetExts: assetExts.filter((ext) => ext !== 'svg'),
    sourceExts: [...sourceExts, 'svg'],
    // Native build outputs are large, generated trees and are never imported by
    // the JS bundle. Excluding them keeps Metro/Watchman startup reliable on
    // Windows after an Android build has populated these directories.
    blockList: [
      defaultConfig.resolver.blockList,
      /[/\\]android[/\\]app[/\\](?:build|\.cxx)(?:[/\\].*)?$/,
      /[/\\]android[/\\](?:build|\.gradle)(?:[/\\].*)?$/,
      /[/\\]ios[/\\]build(?:[/\\].*)?$/,
    ],
  },
});
