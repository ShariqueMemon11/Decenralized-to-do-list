import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

function CustomTabBar({ state, descriptors, navigation }: any) {
  return (
    <View style={styles.tabBarContainer}>
      <View style={styles.tabBar}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const label = options.title !== undefined ? options.title : route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              // Animate layout changes
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
              navigation.navigate(route.name);
            }
          };

          // Icon mapping
          let iconName: keyof typeof Ionicons.glyphMap = 'list';
          if (route.name === 'index') iconName = 'list';
          else if (route.name === 'add') iconName = 'add-circle';
          else if (route.name === 'completed') iconName = 'checkmark-done';
          else if (route.name === 'deleted') iconName = 'trash';

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={[
                styles.tabItem,
                isFocused && styles.tabItemFocused
              ]}
              activeOpacity={0.8}
            >
              <Ionicons 
                name={iconName} 
                size={26} 
                color={isFocused ? theme.colors.primary : "#D1C6E6"} 
              />
              {isFocused && (
                <Text style={styles.tabLabel} numberOfLines={1}>
                  {label}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.onPrimary,
        headerTitleStyle: {
          color: theme.colors.onPrimary,
          fontWeight: theme.fontWeight.bold,
        },
      }}
    >
      <Tabs.Screen 
        name="index" 
        options={{ title: 'Tasks' }} 
      />
      <Tabs.Screen 
        name="add" 
        options={{ title: 'Add' }} 
      />
      <Tabs.Screen 
        name="completed" 
        options={{ title: 'Done' }} 
      />
      <Tabs.Screen 
        name="deleted" 
        options={{ title: 'Bin' }} 
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'box-none', // Allow clicks to pass through empty space around the bar
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#1E1E1E', // Dark background
    borderRadius: 40,
    paddingVertical: 10,
    paddingHorizontal: 16,
    width: '94%',
    maxWidth: 760,
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  tabItem: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  tabItemFocused: {
    backgroundColor: '#FFFFFF',
    paddingRight: 24, // Extra padding for text
    paddingLeft: 20,
  },
  tabLabel: {
    color: theme.colors.primary,
    fontWeight: 'bold',
    marginLeft: 10,
    fontSize: 16,
  }
});
