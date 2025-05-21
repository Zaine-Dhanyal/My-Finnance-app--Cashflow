import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import firebase from '../services/firebase';  
const categories = [
  { label: 'Food', icon: <Ionicons name="fast-food" size={24} color="white" />, color: '#FF6347' },      // stays same
  { label: 'Clothes', icon: <FontAwesome5 name="tshirt" size={24} color="white" />, color: '#00BFFF' },
  { label: 'Travel', icon: <MaterialIcons name="commute" size={24} color="white" />, color: '#FFD700' },
  { label: 'Bills', icon: <Ionicons name="document-text" size={24} color="white" />, color: '#32CD32' },
  { label: 'Rent', icon: <FontAwesome5 name="home" size={24} color="white" />, color: '#FF8C00' },       // changed to orange
  { label: 'Other', icon: <Ionicons name="ellipsis-horizontal" size={24} color="white" />, color: '#8A2BE2' },
];
const ManageTransaction = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleAdd = async () => {
    if (!amount || !description || !selectedCategory) {
      Alert.alert('Error', 'Please fill all fields and select a category.');
      return;
    }

    const transaction = { amount,description, category: selectedCategory, type: activeTab, timestamp: new Date().toISOString(), };
    try {
      await firebase.post('/transactions.json', transaction);
      Alert.alert('Success', `${activeTab === 'expense' ? 'Expense' : 'Income'} Added!`);
      setAmount('');
      setDescription('');
      setSelectedCategory(null);
    } catch (error) {
      Alert.alert('Error', 'Something went wrong, please try again.');
      console.log('Firebase REST API error:', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.containerManageTransaction}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Manage Transaction</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButtonCard, activeTab === 'expense' && styles.activeTabCard]}
          onPress={() => setActiveTab('expense')}
        >
          <Text style={[styles.tabTextCard, activeTab === 'expense' && styles.activeTabTextCard]}>Expense</Text>
        </TouchableOpacity>
<TouchableOpacity
 style={[styles.tabButtonCard, activeTab === 'income' && styles.activeTabCard]}
 onPress={() => {
  setActiveTab('income');
  navigation.navigate('Income Screen');
  }}
 >
  <Text style={[styles.tabTextCard, activeTab === 'income' && styles.activeTabTextCard]}>Income</Text>
  </TouchableOpacity>
      </View>

      <Text style={styles.selectCategoryLabel}>Select Category</Text>
      <TouchableOpacity
        style={[styles.categoryField, { borderColor: selectedCategory ? '#0047ab' : '#ccc' }]}
        onPress={() => setSelectedCategory(null)}
      >
        <Text style={styles.categoryFieldText}>
          {selectedCategory ? selectedCategory : 'Choose Category'}
        </Text>
      </TouchableOpacity>

<View style={styles.categoryGrid}>
 {categories.map((cat, index) => (
   <TouchableOpacity key={index}
            style={[
              styles.categoryBlock,
              { backgroundColor: cat.color, borderWidth: selectedCategory === cat.label ? 2 : 0 },
            ]}
            onPress={() => setSelectedCategory(cat.label)}
          >
            {cat.icon}
            <Text style={styles.categoryText}>{cat.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput placeholder="Amount" value={amount} onChangeText={setAmount}
        keyboardType="numeric" style={styles.inputManageTransaction} placeholderTextColor="#666"
      />

      <TextInput placeholder="For what? e.g. Buy a jacket" value={description}onChangeText={setDescription}style={styles.inputManageTransaction}
        placeholderTextColor="#666"
      />

      <View style={styles.actionButtonsContainer}>
        <View style={styles.centeredButtonWrapper}>
          <TouchableOpacity style={styles.actionButton} onPress={handleAdd}>
            <Text style={styles.actionButtonText}>Add Expense</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.centeredButtonWrapper}>
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('ViewExpense')}>
            <Text style={styles.actionButtonText}>View Expense</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  containerManageTransaction: {
    flexGrow: 1,
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
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  tabButtonCard: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    alignItems: 'center',
  },
  activeTabCard: {
    backgroundColor: '#0047ab',
  },
  tabTextCard: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0047ab',
  },
  activeTabTextCard: {
    color: '#ffffff',
  },
  selectCategoryLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0047ab',
    marginBottom: 10,
  },
  categoryField: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
  },
  categoryFieldText: {
    fontSize: 16,
    color: '#0047ab',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  categoryBlock: {
    width: '30%',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  inputManageTransaction: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  actionButtonsContainer: {
    marginTop: 20,
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

export default ManageTransaction;
