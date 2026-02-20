import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
} from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";

const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_MAPS_API_KEY;

interface LocationData {
  address: string;
  latitude: number;
  longitude: number;
}

interface Props {
  label: string;
  value?: LocationData;
  onChange: (location: LocationData) => void;
}

const requestPermission = async (): Promise<boolean> => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    Alert.alert(
      "Permission Required",
      "Please allow location access in your phone settings.",
    );
    return false;
  }
  return true;
};

export default function LocationPicker({ label, value, onChange }: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [region, setRegion] = useState<Region>({
    latitude: 11.5564,
    longitude: 104.9282,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [marker, setMarker] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [address, setAddress] = useState("");
  const mapRef = useRef<MapView>(null);

  const reverseGeocode = async (
    latitude: number,
    longitude: number,
  ): Promise<string> => {
    try {
      const geocoded = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      const place = geocoded[0];
      return `${place.street ?? ""} ${place.district ?? ""} ${place.city ?? ""}`.trim();
    } catch {
      return `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
    }
  };

  const getCurrentLocation = async () => {
    const allowed = await requestPermission();
    if (!allowed) return;

    try {
      const loc = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = loc.coords;
      const addr = await reverseGeocode(latitude, longitude);

      const newRegion = {
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setRegion(newRegion);
      setMarker({ latitude, longitude });
      setAddress(addr);
      mapRef.current?.animateToRegion(newRegion);
    } catch (err) {
      Alert.alert("Error", "Could not get your current location.");
    }
  };

  const handleMapPress = async (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;

    const allowed = await requestPermission();
    if (!allowed) return;

    try {
      setMarker({ latitude, longitude });
      const addr = await reverseGeocode(latitude, longitude);
      setAddress(addr);
    } catch (err) {
      Alert.alert("Error", "Could not get address for this location.");
    }
  };

  const handleConfirm = () => {
    if (!marker) {
      Alert.alert("Please select a location");
      return;
    }
    onChange({
      address,
      latitude: marker.latitude,
      longitude: marker.longitude,
    });
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.trigger}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="location-outline" size={20} color="#FF6347" />
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text style={styles.triggerLabel}>{label}</Text>
          <Text style={styles.triggerValue} numberOfLines={1}>
            {value?.address || "Tap to select location"}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#ccc" />
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide">
        <View style={{ flex: 1 }}>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.backBtn}
            >
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <GooglePlacesAutocomplete
              placeholder={`Search ${label}`}
              onPress={(data, details) => {
                if (!details) return;
                const { lat, lng } = details.geometry.location;
                const newRegion = {
                  latitude: lat,
                  longitude: lng,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                };
                setRegion(newRegion);
                setMarker({ latitude: lat, longitude: lng });
                setAddress(data.description);
                mapRef.current?.animateToRegion(newRegion);
              }}
              query={{ key: GOOGLE_API_KEY, language: "en" }}
              fetchDetails={true}
              styles={{
                container: { flex: 1 },
                textInput: styles.searchInput,
                listView: {
                  position: "absolute",
                  top: 50,
                  zIndex: 99,
                  width: "100%",
                },
              }}
            />
          </View>

          {/* Map */}
          <MapView
            ref={mapRef}
            style={{ flex: 1 }}
            region={region}
            onPress={handleMapPress}
            provider="google"
          >
            {marker && <Marker coordinate={marker} pinColor="#FF6347" />}
          </MapView>

          {/* GPS Button */}
          <TouchableOpacity style={styles.gpsBtn} onPress={getCurrentLocation}>
            <Ionicons name="navigate" size={22} color="#FF6347" />
          </TouchableOpacity>

          {/* Confirm Bar */}
          <View style={styles.confirmBar}>
            <View style={{ flex: 1, marginRight: 12 }}>
              <Text style={styles.confirmLabel}>Selected Location</Text>
              <Text style={styles.confirmAddress} numberOfLines={2}>
                {address || "Tap on map to select"}
              </Text>
            </View>
            <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
              <Text style={styles.confirmBtnText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  triggerLabel: { fontSize: 11, color: "#999", marginBottom: 2 },
  triggerValue: { fontSize: 14, color: "#333", fontWeight: "500" },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: 50,
    paddingBottom: 8,
    backgroundColor: "#fff",
    zIndex: 10,
    elevation: 4,
  },
  backBtn: { marginRight: 8 },
  searchInput: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    fontSize: 14,
    height: 44,
  },
  gpsBtn: {
    position: "absolute",
    bottom: 110,
    right: 16,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 50,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  confirmBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  confirmLabel: { fontSize: 11, color: "#999" },
  confirmAddress: {
    fontSize: 13,
    color: "#333",
    fontWeight: "500",
    marginTop: 2,
  },
  confirmBtn: {
    backgroundColor: "#FF6347",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  confirmBtnText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
});
