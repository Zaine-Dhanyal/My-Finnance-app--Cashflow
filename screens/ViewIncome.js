import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, TextInput, StyleSheet } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import firebase from '../services/firebase'; // Axios instance

const ViewIncome = ({ navigation }) => {
  const [transactions, setTransactions] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [editedAmount, setEditedAmount] = useState('');
  const fetchTransactions = async () => {
    try {
      const res = await firebase.get('/incomes.json');
      if (res.data) {
        const loaded = Object.entries(res.data).map(([key, value]) => ({
          id: key,
          ...value,
        }));
        setTransactions(loaded); // no need to filter since it's already income
      } else {
        setTransactions([]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load income transactions.');
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleDelete = (id) => {
    Alert.alert('Delete Income', 'Are you sure you want to delete this income?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: async () => {
          try {
            await firebase.delete(`/incomes/${id}.json`);
            Alert.alert('Deleted', 'Income transaction deleted.');
            fetchTransactions();
          } catch (error) {
            Alert.alert('Error', 'Failed to delete income.');
          }
        },
      },
    ]);
  };

  const handleEdit = (item) => {
    setIsEditing(true);
    setCurrentTransaction(item);
    setEditedAmount(String(item.amount));
   
  };

  const saveEdit = async () => {
    try {
      await firebase.patch(`/incomes/${currentTransaction.id}.json`, {
        amount: editedAmount,
       
      });
      setIsEditing(false);
      setCurrentTransaction(null);
      setEditedAmount('');
     
      fetchTransactions();
    } catch (error) {
      Alert.alert('Error', 'Failed to update income.');
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setCurrentTransaction(null);
    setEditedAmount('');
  
  };

  const renderItem = ({ item }) => (
    <View style={styles.transactionCard}>
      <Text style={styles.transactionText}>
        Category: {item.category} | Amount: Rs. {item.amount}
      </Text>
    
      <View style={styles.actionButtons}>
        <TouchableOpacity onPress={() => handleEdit(item)}>
          <MaterialIcons name="edit" size={24} color="#0047ab" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <Ionicons name="trash" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
     <View style={styles.customHeader}>
       <Text style={styles.headerText}>All Income Transactions</Text>
       <View style={styles.divider} />
     </View>
     
      {isEditing && (
        <View style={styles.editContainer}>
          <Text style={styles.editTitle}>Edit Income</Text>
          <TextInput value={editedAmount}  onChangeText={setEditedAmount}  placeholder="Amount" keyboardType="numeric"
            style={styles.input}
          />
        
          <View style={styles.editButtons}>
            <TouchableOpacity style={styles.saveBtn} onPress={saveEdit}>
              <Text style={styles.btnText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={cancelEdit}>
              <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>No income added yet.</Text>}
      />
 <TouchableOpacity
        style={styles.goBackButton}
        onPress={() => navigation.navigate('Dashboard')}
      >
        <Text style={styles.goBackText}>Go to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
  flex: 1,
  paddingHorizontal: 20,
  paddingBottom: 20,
  paddingTop: 60, 
  backgroundColor: '#E3F2FD',
},

customHeader: {
  alignItems: 'center',
  marginBottom: 20,
},

headerText: {
  fontSize: 18,
  fontWeight: '500',
  color: '#0047ab',
},

divider: {
  height: 1,
  backgroundColor: '#ccc',
  width: '80%',
  marginTop: 5,
  borderRadius: 5,
},

  transactionCard: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
  },
  transactionText: {
    fontSize: 16,
    color: '#0047ab',
    fontWeight: 'bold',
  },
 
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    gap: 20,
  },
  editContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  editTitle: {
    fontSize: 18,
    color: '#0047ab',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveBtn: {
    backgroundColor: '#0047ab',
    padding: 10,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: '#aaa',
    padding: 10,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  empty: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
  goBackButton: {
  backgroundColor: '#0047ab',
  paddingVertical: 12,
  paddingHorizontal: 20,
  borderRadius: 10,
  alignItems: 'center',
  alignSelf: 'center',
  marginTop: 10,
   marginBottom: 60,
  width: '60%',
},
goBackText: {
  fontSize: 16,
  color: '#fff',
  fontWeight: 'bold',
},

});

export default ViewIncome;
