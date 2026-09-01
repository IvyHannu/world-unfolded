import { Image } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import type { ImageAsset } from '@/types';
import { colors, radius } from '@/tokens';

import { AppText } from './app-text';
import { LoadingIndicator } from './loading-indicator';

interface ContentImageProps { image: ImageAsset; style?: StyleProp<ViewStyle>; height?: number }

export function ContentImage({ height = 240, image, style }: ContentImageProps) {
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  return (
    <View style={[styles.frame, { height }, style]}>
      {!failed ? (
        <Image
          accessibilityLabel={image.altText}
          accessible
          cachePolicy="memory-disk"
          contentFit="cover"
          onError={() => { setFailed(true); setLoading(false); }}
          onLoad={() => setLoading(false)}
          onLoadStart={() => setLoading(true)}
          source={{ uri: image.url }}
          style={StyleSheet.absoluteFill}
          transition={180}
        />
      ) : (
        <View accessibilityLabel={`Image unavailable: ${image.altText}`} accessibilityRole="image" style={styles.fallback}>
          <AppText typographyRole="label">Image unavailable</AppText>
          <AppText typographyRole="caption">Reconnect to load this photograph.</AppText>
        </View>
      )}
      {loading && !failed ? <View style={styles.loading}><LoadingIndicator label="Loading image" /></View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { backgroundColor: colors.surfaceSubtle, borderRadius: radius.lg, overflow: 'hidden', position: 'relative', width: '100%' },
  loading: { ...StyleSheet.absoluteFillObject, alignItems: 'center', backgroundColor: colors.surfaceSubtle, justifyContent: 'center' },
  fallback: { alignItems: 'center', flex: 1, justifyContent: 'center' },
});
