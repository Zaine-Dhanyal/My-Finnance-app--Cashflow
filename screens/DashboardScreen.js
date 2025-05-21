import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PieChart } from 'react-native-chart-kit';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import firebase from '../services/firebase'; 
const DashboardScreen = () => {
  const navigation = useNavigation();
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      const fetchTransactions = async () => {
        try {
          const transactionsRes = await firebase.get('/transactions.json');
          const transactionsData = transactionsRes.data || {};

          const incomeRes = await firebase.get('/incomes.json');
          const incomeData = incomeRes.data || {};

          let incomeSum = 0;
          let expenseSum = 0;
          let expenseCategories = {};

          Object.values(transactionsData).forEach((item) => {
            const amt = parseFloat(item.amount);
            if (item.type === 'expense') {
              expenseSum += amt;
              if (expenseCategories[item.category]) {
                expenseCategories[item.category] += amt;
              } else {
                expenseCategories[item.category] = amt;
              }
            }
          });
  Object.values(incomeData).forEach((item) => {
  const amt = parseFloat(item.amount);
  incomeSum += amt;
  });

  setTotalIncome(incomeSum);
  setTotalExpense(expenseSum);

  const formattedChartData = Object.entries(expenseCategories).map(([category, value], index) => {
  const colors = ['#ff6666', '#66b3ff', '#ffcc66', '#66ff66', '#a19dff', '#ff99cc'];
   return {
 name: category,
 population: value,
 color: colors[index % colors.length],
legendFontColor: '#7F7F7F',
 legendFontSize: 15,
  };
});

 setChartData(formattedChartData);
 setLoading(false);
  } catch (error) {
  console.error('Error fetching data:', error);
   setLoading(false);
        }
      };

      fetchTransactions();
    }, [])
  );

  const handleLogout = () => {
    navigation.navigate('Login');
  };

  return (
    <ScrollView style={styles.dashboardContainer}>
  <ImageBackground 
  source={require('../assets/dash11.jpeg')}  style={styles.topBarBackground}  imageStyle={{ borderRadius: 20 }}
>
</ImageBackground>
      <View style={styles.summaryContainer}>
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Ionicons name="cash-outline" size={24} style={styles.iconStyle} />
            <Text style={styles.cardText}>Total Income</Text>
          </View>
          <Text style={styles.amount}>Rs {totalIncome.toFixed(2)}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Ionicons name="card-outline" size={24} style={styles.iconStyle} />
            <Text style={styles.cardText}>Total Expense</Text>
          </View>
          <Text style={styles.amount}>Rs {totalExpense.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.chartContainer}>
      <View style={styles.expenseCard}>
  <Text style={styles.expenseTitle}>View Your Expenses Visually</Text>
  {loading ? (
    <ActivityIndicator size="large" color="#0047ab" />
  ) : (
    <PieChart
      data={chartData}
      width={320}
      height={220}
      chartConfig={{
        backgroundColor: '#fff',
        backgroundGradientFrom: '#f0f4ff',
        backgroundGradientTo: '#d9e2ff',
        color: (opacity = 1) => `rgba(52, 61, 99, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      }}
      accessor="population"
      backgroundColor="transparent"
      paddingLeft="15"
      absolute
    />
  )}
</View>

<TouchableOpacity onPress={handleLogout} style={styles.button}>
  <Text style={styles.buttonText}>Logout</Text>
  </TouchableOpacity>
  </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  dashboardContainer: {
    flex: 1,
    backgroundColor: '#eaf4ff',
   
  },
 topBarBackground: {
  width: '100%',
  height: 220,
  justifyContent: 'center',
  alignItems:'center',
  borderRadius: 10,
   paddingTop: 80,
  marginBottom: 20,
},

  summaryContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 10,
  padding: 20,
},
expenseCard: {
  backgroundColor: '#fff',
  borderRadius: 15,
  padding: 20,
  alignItems: 'center',
},
 card: {
    backgroundColor: '#fff',
    width: '48%',
    padding: 10,
    borderRadius: 10,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  
expenseTitle: {
  fontSize: 18,
  fontWeight: '700',
  color: '#0047ab',
  marginBottom: 15,
},
  iconStyle: {
    marginRight: 10,
    color: '#0047ab',
    width: 24,
    height: 24,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0047ab',
  },
  chartContainer: {
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0047ab',
    marginBottom: 2
  },
  button: {
    backgroundColor: '#0047ab',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 10,
    marginBottom:50,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DashboardScreen;
