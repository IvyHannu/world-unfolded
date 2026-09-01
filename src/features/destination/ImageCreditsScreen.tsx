import { StyleSheet, View } from 'react-native';

import { AppText, ContentImage, ErrorState, ScreenContainer, Tappable } from '@/components/ui';
import type { ImageAsset } from '@/types';
import { colors, radius, spacing } from '@/tokens';
import { openHttpsUrl } from '@/utils/externalLinks';

interface ImageCreditsScreenProps { image?: ImageAsset; onBack: () => void }

export function ImageCreditsScreen({ image, onBack }: ImageCreditsScreenProps) {
  if (!image) return <ScreenContainer><ErrorState actionLabel="Go back" message="This image record could not be found." onAction={onBack} title="Credits unavailable" /></ScreenContainer>;
  return (
    <ScreenContainer>
      <AppText accessibilityRole="header" typographyRole="display">Image Credits</AppText>
      <ContentImage height={340} image={image} style={styles.image} />
      <View style={styles.details}>
        <Credit label="Represented subject" value={image.altText} />
        <Credit label="Creator" value={image.creatorName} />
        <Credit label="Required attribution" value={image.creatorAttribution} />
        <Credit label="Source" value={image.source === 'wikimedia_commons' ? 'Wikimedia Commons' : image.source} />
        <Credit label="License" value={image.licenseOrTerms} />
        <Credit label="Change notice" value={image.changeNoticeRequired ? 'Required when changes are made.' : 'Not required by the recorded terms.'} />
        <Credit label="Share alike" value={image.shareAlikeRequired ? 'Adaptations must use the same or a compatible license.' : 'Not required by the recorded terms.'} />
        <Tappable accessibilityLabel="Open full license" accessibilityRole="link" onPress={() => void openHttpsUrl(image.licenseUrl)} style={styles.link}><AppText typographyRole="label">Open full license →</AppText></Tappable>
        <Tappable accessibilityLabel="Open original image source" accessibilityRole="link" onPress={() => void openHttpsUrl(image.sourceUrl)} style={styles.link}><AppText typographyRole="label">Open original source →</AppText></Tappable>
      </View>
    </ScreenContainer>
  );
}

function Credit({ label, value }: { label: string; value: string }) { return <View style={styles.credit}><AppText typographyRole="label">{label}</AppText><AppText>{value}</AppText></View>; }

const styles = StyleSheet.create({
  image: { marginBottom: spacing.lg, marginTop: spacing.lg },
  details: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.lg, borderWidth: 1, gap: spacing.lg, maxWidth: 760, padding: spacing.lg },
  credit: { gap: spacing.xs },
  link: { alignItems: 'center', alignSelf: 'flex-start', justifyContent: 'center', paddingHorizontal: spacing.sm },
});
