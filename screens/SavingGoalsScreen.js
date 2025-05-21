import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet,ScrollView, Alert, ImageBackground, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import firebase from '../services/firebase';

const categories = [
  { label: 'Vacation', image: require('../assets/vacation.jpg') },
  { label: 'New Home', image: require('../assets/home.jpg') },
  { label: 'Education', image: require('../assets/education.jpg') },
  { label: 'Wedding', image: require('../assets/wedding.jpg') },
  { label: 'Car', image: require('../assets/car.jpg') },
  { label: 'Travel', image: require('../assets/travel.jpg') },
];

const SavingGoalsScreen = () => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [goals, setGoals] = useState([]);
  const [editingGoalId, setEditingGoalId] = useState(null);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const res = await firebase.get('/goals.json');
      if (res.data) {
        const loadedGoals = Object.entries(res.data).map(([id, goal]) => ({ id, ...goal }));
        setGoals(loadedGoals.reverse());
      }
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const resetForm = () => {
    setTitle('');
    setAmount('');
    setDate('');
    setSelectedCategory('');
    setEditingGoalId(null);
  };

  const addGoal = async () => {
    if (!title || !amount || !date || !selectedCategory) {
      Alert.alert('Missing Fields', 'Please fill all fields and select a category.');
      return;
    }

    const newGoal = {title,amount, date,category: selectedCategory,completed: false,
    };

    try {
      if (editingGoalId) {
        await firebase.patch(`/goals/${editingGoalId}.json`, newGoal);
      } else {
        await firebase.post('/goals.json', newGoal);
      }
      fetchGoals();
      resetForm();
    } catch (err) {
      console.error('Add error:', err);
    }
  };

  const markComplete = async (id) => {
    try {
      await firebase.patch(`/goals/${id}.json`, { completed: true });
      fetchGoals();
    } catch (err) {
      console.error('Complete error:', err);
    }
  };

  const handleEditGoal = (goal) => {
    setTitle(goal.title);
    setAmount(goal.amount);
    setDate(goal.date);
    setSelectedCategory(goal.category);
    setEditingGoalId(goal.id);
  };

  const handleDeleteGoal = (id) => {
    Alert.alert('Delete Goal', 'Are you sure?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        onPress: async () => {
          try {
            await firebase.delete(`/goals/${id}.json`);
            fetchGoals();
          } catch (err) {
            console.error('Delete error:', err);
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <ImageBackground source={require('../assets/goal1.jpeg')}style={styles.topBarBackground}
        imageStyle={{ borderRadius: 20 }}
      />
 <Text style={styles.stepText}>Pick a category</Text>
 <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
 {categories.map((cat, index) => (
  <TouchableOpacity  key={index}
 style={[
 styles.categoryCard,
 selectedCategory === cat.label && { borderColor: '#0047ab', borderWidth: 2 },
            ]}
            onPress={() => setSelectedCategory(cat.label)}
          >
            <ImageBackground source={cat.image} style={styles.categoryImageBackground}
              imageStyle={{ borderRadius: 12 }} >
              <View style={styles.overlay}>
                <Text style={styles.categoryText}>{cat.label}</Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        ))}
      </ScrollView>
 <Text style={styles.stepText}>Please add Goal details</Text>
<View style={styles.inputCard}>
       <TextInput placeholder="Goal Title" style={styles.input} value={title} onChangeText={setTitle} />
<TextInput placeholder="Target Amount" style={styles.input} keyboardType="numeric" value={amount} onChangeText={setAmount} />
<TextInput placeholder="Target Date (YYYY-MM-DD)" style={styles.input} value={date} onChangeText={setDate} />

 <TouchableOpacity style={styles.addButton} onPress={addGoal}>
<Ionicons name="add-circle-outline" size={20} color="#fff" style={{ marginRight: 6 }} />
          <Text style={styles.addButtonText}>{editingGoalId ? 'Update Goal' : 'Add Goal'}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.stepText}>Your Saving Goals</Text>
      <FlatList
        data={goals}
        keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
  <View style={[styles.goalCard, item.completed && styles.completedCard]}>
    <View style={{ flex: 1, alignItems: 'center' }}>
      <Text style={styles.goalTitle}>{item.title}</Text>
      <Text style={styles.goalDetails}>Amount: {item.amount}</Text>
      <Text style={styles.goalDetails}>Date: {item.date}</Text>
      <Text style={styles.goalDetails}>Category: {item.category}</Text>
    </View>
<View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
  <TouchableOpacity onPress={() => handleEditGoal(item)} style={styles.editBtn}>
    <Text style={styles.editText}>Edit goal</Text>
  </TouchableOpacity>
  <TouchableOpacity onPress={() => handleDeleteGoal(item.id)} style={styles.deleteBtn}>
    <Text style={styles.deleteText}>Delete goal</Text>
  </TouchableOpacity>
</View>

 {!item.completed && (
      <TouchableOpacity onPress={() => markComplete(item.id)} style={styles.completeBtnFull}>
        <Text style={{ color: '#fff', textAlign: 'center' }}>Mark Complete</Text>
      </TouchableOpacity>
    )}
    {item.completed && <Text style={styles.completedLabel}> Completed</Text>}
  </View>
)}
  />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e6f0ff',
    flex: 1,
  },
  topBarBackground: {
    width: '100%',
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
    marginBottom: 20,
  },
  stepText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#0047ab',
    marginLeft: 10,
  },
  categoryScroll: {
    marginLeft: 5,
  },
  categoryCard: {
    marginRight: 10,
  },
  categoryImageBackground: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  overlay: {
    backgroundColor: '#000000',
    width: '100%',
    height: '100%',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  inputCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    marginHorizontal: 10,
   
  },
  input: {
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0047ab',
    padding: 12,
    borderRadius: 10,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  goalCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 10,
    marginBottom: 12,
    width: '90%',        
  alignSelf: 'center',  
  },
  completedCard: {
    backgroundColor: '#d0f0c0',
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0047ab',
  },
  goalDetails: {
    fontSize: 14,
    color: '#555',
  },
  completeBtn: {
    backgroundColor: '#0047ab',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  completedLabel: {
    color: 'green',
    fontWeight: 'bold',
    marginTop: 8,
     textAlign: 'center',     
  alignSelf: 'center', 
  },
  actionsContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  editBtn: {
    backgroundColor: '#ffa500',
    padding: 6,
    borderRadius: 8,
    marginRight: 8,
  },
  editText: {
    color: '#fff',
  },
  deleteBtn: {
    backgroundColor: '#ff6347',
    padding: 6,
    borderRadius: 8,
  },
  deleteText: {
    color: '#fff',
  },
  completeBtnFull: {
  backgroundColor: '#0047ab',
  padding: 8,
  borderRadius: 8,
  marginTop: 10,
  alignSelf: 'center',
  width: '60%',
  alignItems: 'center',
},

});

export default SavingGoalsScreen;
