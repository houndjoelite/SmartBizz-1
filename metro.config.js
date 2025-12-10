const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Récupère la configuration par défaut
const config = getDefaultConfig(__dirname);

// Configuration des extensions de fichiers statiques
config.resolver = {
  ...config.resolver,
  assetExts: [...config.resolver.assetExts, 'jpeg', 'jpg', 'png', 'gif', 'webp', 'jpeg'],
  sourceExts: [...config.resolver.sourceExts, 'js', 'jsx', 'json', 'ts', 'tsx'],
};

// Configuration des dossiers à surveiller
config.watchFolders = [
  __dirname,
  path.join(__dirname, 'assets'),
  path.join(__dirname, 'src')
];

// Désactiver le hachage des noms de modules pour faciliter le débogage
config.transformer.minifierConfig.compress.drop_console = true;

module.exports = config;
