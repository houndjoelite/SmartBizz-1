import React from 'react';
import { View, Image, Platform } from 'react-native';

const BackgroundImage = ({ children, imageSource, style }) => {
  // Sur mobile, on n'affiche pas l'image pour éviter l'encombrement
  if (Platform.OS !== 'web') {
    return <View style={style}>{children}</View>;
  }

  // Sur web, on affiche l'image de fond
  return (
    <View style={[style, { position: 'relative', overflow: 'hidden' }]}>
      <Image
        source={{ uri: imageSource }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
        }}
        resizeMode="cover"
      />
      {/* Overlay pour améliorer la lisibilité */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(139, 92, 246, 0.7)',
        }}
      />
      {children}
    </View>
  );
};

export default BackgroundImage;
