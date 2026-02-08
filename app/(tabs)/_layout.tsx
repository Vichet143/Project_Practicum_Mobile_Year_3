import { Tabs } from "expo-router"
import { TabBar } from "../../components/TabBar";

const TabLayout = () => {
  return (
    <Tabs tabBar={props => <TabBar {...props}/>}>
      <Tabs.Screen name="index" options={{title: "Home"}}/>
      <Tabs.Screen name="tracking" options={{title: "Track"}}/>
      <Tabs.Screen name="createdelivery" options={{title: "Create"}}/>
      <Tabs.Screen name="chat" options={{title: "Chat"}}/>
      <Tabs.Screen name="profile" options={{title: "Profile"}}/>
    </Tabs>
  )
}

export default TabLayout;