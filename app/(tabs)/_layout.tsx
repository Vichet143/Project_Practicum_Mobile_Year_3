import { Tabs } from "expo-router"
import { TabBar } from "../../components/TabBar";
import Header from "../../components/headertop";

const TabLayout = () => {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      // Custom header for all tabs
      screenOptions={{
        header: (props) => <Header {...props} />,
        headerShown: true,
        headerStyle: { backgroundColor: "#FF6347" }
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="history" options={{ title: "History" }} />
      <Tabs.Screen name="chat" options={{ title: "Chat" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}

export default TabLayout;