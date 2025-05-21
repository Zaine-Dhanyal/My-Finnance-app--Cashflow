import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import SplashScreen from './screens/splash';
import Login from './screens/loginScreen';
import SignUp from './screens/signupScreen';
import DashboardScreen from './screens/DashboardScreen';
import ManageTransaction from './screens/ManageTransactions';
import IncomeScreen from './screens/incomescreen';
import SavingGoalsScreen from './screens/SavingGoalsScreen';
import ViewExpense from './screens/ViewExpense';
import ViewIncome from './screens/ViewIncome';
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function DrawerNavigator() {
  return (
    <Drawer.Navigator initialRouteName="Dashboard">
      <Drawer.Screen name="Dashboard" component={DashboardScreen} />
      <Drawer.Screen name="Manage Transaction" component={ManageTransaction} />
      <Drawer.Screen name="Income Screen" component={IncomeScreen} />
      <Drawer.Screen name="Saving Goals" component={SavingGoalsScreen} />
    
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="ViewExpense" component={ViewExpense} />
        <Stack.Screen name="ViewIncome" component={ViewIncome} />
        <Stack.Screen name="Income Screen" component={IncomeScreen} />

        {/* Main navigation starts from here after login or splash screen */}
        <Stack.Screen name="Dashboard" component={DrawerNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
