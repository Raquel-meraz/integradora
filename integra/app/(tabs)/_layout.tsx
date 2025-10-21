// // // app/(tabs)/_layout.tsx
// // import { Tabs } from "expo-router";
// // import { Ionicons } from "@expo/vector-icons";

// // export default function TabsLayout() {
// //   return (
// //     <Tabs
// //       screenOptions={{
// //         headerShown: false,
// //         tabBarShowLabel: true,
// //         tabBarLabelStyle: { textTransform: "lowercase" },
// //       }}
// //     >
// //       <Tabs.Screen
// //         name="index"
// //         options={{
// //           title: "inicio",
// //           tabBarIcon: ({ color, size }) => (
// //             <Ionicons name="home-outline" size={size} color={color} />
// //           ),
// //         }}
// //       />
// //       <Tabs.Screen
// //         name="agendar"
// //         options={{
// //           title: "agendar",
// //           tabBarIcon: ({ color, size }) => (
// //             <Ionicons name="calendar-outline" size={size} color={color} />
// //           ),
// //         }}
// //       />
// //       <Tabs.Screen
// //         name="citas"
// //         options={{
// //           title: "citas",
// //           tabBarIcon: ({ color, size }) => (
// //             <Ionicons name="list-outline" size={size} color={color} />
// //           ),
// //         }}
// //       />
// //     </Tabs>
// //   );
// // }

// // app/(tabs)/_layout.tsx
// import { Tabs } from "expo-router";
// import { Ionicons } from "@expo/vector-icons";

// export default function TabsLayout() {
//   return (
//     <Tabs screenOptions={{ headerShown: false, tabBarShowLabel: true, tabBarLabelStyle: { textTransform: "lowercase" } }}>
//       <Tabs.Screen name="index" options={{ title: "inicio", tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" color={color} size={size} /> }} />
//       <Tabs.Screen name="agendar" options={{ title: "agendar", tabBarIcon: ({ color, size }) => <Ionicons name="calendar-outline" color={color} size={size} /> }} />
//       <Tabs.Screen name="citas" options={{ title: "citas", tabBarIcon: ({ color, size }) => <Ionicons name="list-outline" color={color} size={size} /> }} />
//     </Tabs>
//   );
// }
// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#111827",
        tabBarInactiveTintColor: "#6b7280",
      }}
    >
      {/* Tus tabs existentes */}
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
        name="agendar"
        options={{
          title: "agendar",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="calendar-clock" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="citas"
        options={{
          title: "citas",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="clipboard-text-outline" color={color} size={size} />
          ),
        }}
      />

      {/* NUEVA pestaña Perfil */}
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

