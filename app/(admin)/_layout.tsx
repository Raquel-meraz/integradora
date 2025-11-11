// app/(admin)/_layout.tsx
import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function AdminTabs() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#5443EA",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "inicio",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="ganancias"
        options={{
          title: "ganancias",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="trending-up-outline" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="perfil"
        options={{
          title: "perfil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
