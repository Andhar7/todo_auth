import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image
} from 'react-native';
import {
  TextInput,
  Button,
  Card,
  Title,
  HelperText,
  Text,
} from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';

import useTodoStore from '../store/todoStore';

export default function CreateTodoScreen({ navigation, route }) {
  const { todo, isEditing } = route.params || {};
  
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(false);

  const { createTodo, updateTodo, loading } = useTodoStore();

  useEffect(() => {
    if (isEditing && todo) {
      setName(todo.name);
      setPrice(todo.price.toString());
      setImage(todo.image || '');
      setImagePreview(todo.image && todo.image !== 'https://via.placeholder.com/150');
    }
  }, [isEditing, todo]);

  // Reset form when navigating to create new todo (not editing)
  useFocusEffect(
    React.useCallback(() => {
      if (!isEditing) {
        resetForm();
      }
    }, [isEditing])
  );

  const handleImageChange = (text) => {
    setImage(text);
    if (errors.image) {
      setErrors({ ...errors, image: null });
    }
    // Check if it's a valid URL and show preview
    if (text.trim() && isValidUrl(text.trim())) {
      setImagePreview(true);
    } else {
      setImagePreview(false);
    }
  };

  const resetForm = () => {
    setName('');
    setPrice('');
    setImage('');
    setErrors({});
    setImagePreview(false);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Todo name is required';
    }

    if (!price.trim()) {
      newErrors.price = 'Price is required';
    } else if (isNaN(parseFloat(price)) || parseFloat(price) < 0) {
      newErrors.price = 'Please enter a valid price';
    }

    if (image.trim() && !isValidUrl(image.trim())) {
      newErrors.image = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const todoData = {
      name: name.trim(),
      price: parseFloat(price),
      image: image.trim() || 'https://via.placeholder.com/150',
    };

    let result;
    if (isEditing) {
      result = await updateTodo(todo.id, todoData);
    } else {
      result = await createTodo(todoData);
    }

    if (result.success) {
      if (isEditing) {
        Alert.alert(
          'Success',
          'Todo updated successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.goBack();
              }
            }
          ]
        );
      } else {
        Alert.alert(
          'Success',
          'Todo created successfully!',
          [
            {
              text: 'Create Another',
              onPress: () => {
                resetForm();
              }
            },
            {
              text: 'View Todos',
              onPress: () => {
                navigation.goBack();
              }
            }
          ]
        );
      }
    } else {
      Alert.alert('Error', result.message);
    }
  };

  const handleCancel = () => {
    if (name.trim() || price.trim() || image.trim()) {
      Alert.alert(
        'Discard Changes',
        'Are you sure you want to discard your changes?',
        [
          { text: 'Keep Editing', style: 'cancel' },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>
              {isEditing ? 'Edit Todo' : 'Create New Todo'}
            </Title>

            <TextInput
              label="Todo Name *"
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (errors.name) {
                  setErrors({ ...errors, name: null });
                }
              }}
              style={styles.input}
              mode="outlined"
              error={!!errors.name}
              left={<TextInput.Icon icon="clipboard-text" />}
            />
            <HelperText type="error" visible={!!errors.name}>
              {errors.name}
            </HelperText>

            <TextInput
              label="Price *"
              value={price}
              onChangeText={(text) => {
                setPrice(text);
                if (errors.price) {
                  setErrors({ ...errors, price: null });
                }
              }}
              style={styles.input}
              mode="outlined"
              keyboardType="numeric"
              error={!!errors.price}
              left={<TextInput.Icon icon="currency-usd" />}
            />
            <HelperText type="error" visible={!!errors.price}>
              {errors.price}
            </HelperText>

            <TextInput
              label="Image URL (optional)"
              value={image}
              onChangeText={handleImageChange}
              style={styles.input}
              mode="outlined"
              autoCapitalize="none"
              autoCorrect={false}
              error={!!errors.image}
              left={<TextInput.Icon icon="image" />}
              placeholder="https://example.com/image.jpg"
            />
            <HelperText type="error" visible={!!errors.image}>
              {errors.image}
            </HelperText>

            {/* Image Preview */}
            {imagePreview && image && (
              <View style={styles.imagePreviewContainer}>
                <Text style={styles.previewLabel}>Preview:</Text>
                <Image 
                  source={{ uri: image }}
                  style={styles.imagePreview}
                  resizeMode="cover"
                  onError={() => {
                    setImagePreview(false);
                    console.log('Failed to load preview image:', image);
                  }}
                />
              </View>
            )}

            <View style={styles.buttonContainer}>
              <Button
                mode="outlined"
                onPress={handleCancel}
                style={[styles.button, styles.cancelButton]}
                disabled={loading}
              >
                Cancel
              </Button>

              {!isEditing && (name.trim() || price.trim() || image.trim()) && (
                <Button
                  mode="outlined"
                  onPress={resetForm}
                  style={[styles.button, styles.clearButton]}
                  disabled={loading}
                >
                  Clear
                </Button>
              )}

              <Button
                mode="contained"
                onPress={handleSubmit}
                style={[styles.button, styles.submitButton]}
                loading={loading}
                disabled={loading}
              >
                {loading 
                  ? (isEditing ? 'Updating...' : 'Creating...') 
                  : (isEditing ? 'Update Todo' : 'Create Todo')
                }
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
  },
  card: {
    elevation: 4,
    borderRadius: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#1e293b',
  },
  input: {
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
  },
  cancelButton: {
    marginRight: 4,
  },
  clearButton: {
    marginHorizontal: 4,
    borderColor: '#f59e0b',
  },
  submitButton: {
    marginLeft: 4,
  },
  imagePreviewContainer: {
    marginBottom: 16,
  },
  previewLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
    fontWeight: '500',
  },
  imagePreview: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
});