import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import ProfileHeader from "@/app/components/ProfileHeader";
import LikesSection from "@/app/components/LikesSection";
import PlaylistsSection from "@/app/components/PlaylistsSection";
import ArtistsSection from "@/app/components/ArtistsSection";

export default function Profile() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader />
        <LikesSection />
        <PlaylistsSection />
        <ArtistsSection />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  scrollView: {
    flex: 1,
  },
});
