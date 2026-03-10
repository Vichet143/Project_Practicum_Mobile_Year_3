import { useAuthStore } from "@/store/authStore";
import { Tabs } from "expo-router";
import { TabBar } from "../../../components/TabBar";
import Header from "../../../components/headertop";

const TabLayouttransporter = () => {
  const { user } = useAuthStore();
  const role: "user" | "transporter" =
    user?.role?.toLowerCase?.() === "transporter" ? "transporter" : "user";

  return (
    <Tabs
      tabBar={(props) => (
        <TabBar {...props} accentColor="#FF6347" role={role} />
      )}
      // Custom header for all tabs
      screenOptions={{
        header: (props) => <Header {...props} />,
        headerShown: true,
        headerStyle: { backgroundColor: "#FF6347" },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="tracking" options={{ title: "Tracking" }} />
      <Tabs.Screen name="search" options={{ title: "Search" }} />
      <Tabs.Screen name="chat" options={{ title: "Chat" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
};

export default TabLayouttransporter;
