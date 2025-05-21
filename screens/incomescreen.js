import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import firebase from '../services/firebase';  
const incomeCategories = [
  { label: 'Commission', icon: <MaterialIcons name="work-outline" size={24} color="white" />, color: '#7B68EE' },
  { label: 'Deposit', icon: <FontAwesome5 name="piggy-bank" size={24} color="white" />, color: '#20B2AA' },
  { label: 'Rent', icon: <FontAwesome5 name="home" size={24} color="white" />, color: '#32CD32' },
  { label: 'Salary', icon: <FontAwesome5 name="money-bill-wave" size={24} color="white" />, color: '#FF69B4' },
  { label: 'Savings', icon: <FontAwesome5 name="wallet" size={24} color="white" />, color: '#FFD700' },
];

const AddIncomeScreen = ({ navigation }) => {
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleAdd = async () => {
    if (!amount || !selectedCategory) {
      Alert.alert('Error', 'Please enter amount and select a category.');
      return;
    }

    try {
      await firebase.post('/incomes.json', {
        amount: parseFloat(amount),
        category: selectedCategory,
        date: new Date().toISOString(),
      });

      Alert.alert('Success', 'Income Added!');
      setAmount('');
      setSelectedCategory(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to add income. Please try again.');
      console.error(error);
    }
  };

  return (
      <ScrollView>
    <View style={styles.container}>
     <View style={styles.header}>
            <Text style={styles.headerText}>Add Income</Text>
          </View>
    
      
      <Text style={styles.selectCategoryLabel}>Select Income Category</Text>

      <View style={styles.selectedCategoryBox}>
        <Text style={styles.selectedCategoryText}>
          {selectedCategory ? selectedCategory : 'Select Category'}
        </Text>
      </View>

      <View style={styles.categoryGrid}>
        {incomeCategories.map((cat, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.categoryBlock, { backgroundColor: cat.color }]}
            onPress={() => setSelectedCategory(cat.label)}
          >
            {cat.icon}
            <Text style={styles.categoryText}>{cat.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput placeholder="Enter Amount" value={amount} onChangeText={setAmount}
        keyboardType="numeric" style={styles.input} placeholderTextColor="#666"
      />
 <View style={styles.actionButtonsContainer}>
        <View style={styles.centeredButtonWrapper}>
          <TouchableOpacity style={styles.actionButton} onPress={handleAdd}>
            <Text style={styles.actionButtonText}>Add income</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.centeredButtonWrapper}>
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('ViewIncome')}>
            <Text style={styles.actionButtonText}>View income</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD',
    padding: 20,
  },
  header: {
    backgroundColor: '#0047ab',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  headerText: {
  fontSize: 20, // was 24
  fontWeight: 'bold',
  color: '#fff',
  textAlign: 'center',
},
  selectCategoryLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0047ab',
    marginBottom: 10,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 15,
    marginBottom: 10,
  },
  categoryBlock: {
    width: 100,
    height: 100,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryText: {
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 5,
    fontSize: 14,
  },
  selectedCategoryBox: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  selectedCategoryText: {
    fontSize: 16,
    color: '#333',
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 5,
    fontSize: 16,
  },
 actionButtonsContainer: {
    marginTop: 10,
  },
  centeredButtonWrapper: {
    alignItems: 'center',
    marginBottom: 15,
  },
  actionButton: {
  backgroundColor: '#0047ab',
  paddingVertical: 10, // restored to normal
  paddingHorizontal: 25, // more comfortable
  borderRadius: 12,
  alignItems: 'center',
  width: '50%', // better size for visibility
  alignSelf: 'center', // centers the button
},
actionButtonText: {
  color: '#fff',
  fontSize: 14, // slightly larger for clarity
  fontWeight: 'bold',
},

});

export default AddIncomeScreen;