import { useAuthStore } from "@/store/authStore";
import React from "react";
import TabLayouttransporter from "../navigation/transporter/_layout";
import TabLayoutuser from "../navigation/user/_layout";

export default function TabsLayout() {
  const { user } = useAuthStore();
  const role = user?.role?.toLowerCase?.() || "user";

  if (role === "transporter") {
    return <TabLayouttransporter />;
  }

  return <TabLayoutuser />;
}
