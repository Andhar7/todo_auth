import React from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Text,
  VStack,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useState } from "react";
import { Link as RouterLink, Navigate } from "react-router-dom";
import useAuthStore from "../store/auth-localStorage";
import EmailVerificationPage from "./EmailVerificationPage";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [registeredUser, setRegisteredUser] = useState(null);

  const { register, loading, isAuthenticated } = useAuthStore();

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Show email verification page if registration succeeded but email verification is required
  if (showEmailVerification) {
    return <EmailVerificationPage email={registeredUser?.email} />;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(""); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    // Register user
    const result = await register({
      username: formData.username,
      email: formData.email,
      password: formData.password,
    });

    if (result.success) {
      if (result.emailVerificationRequired) {
        // Show email verification page
        setRegisteredUser(result.user);
        setShowEmailVerification(true);
      }
      // If no email verification required, user will be automatically authenticated
    } else {
      setError(Array.isArray(result.message) ? result.message.join(", ") : result.message);
    }
  };

  return (
    <Container maxW="md" py={12}>
      <VStack spacing={8}>
        <Heading textAlign="center" size="lg">
          Create Account
        </Heading>

        <Box
          rounded="lg"
          boxShadow="lg"
          p={8}
          w="100%"
          bg="white"
          _dark={{ bg: "gray.800" }}
        >
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              {error && (
                <Alert status="error">
                  <AlertIcon />
                  {error}
                </Alert>
              )}

              <FormControl isRequired>
                <FormLabel>Username</FormLabel>
                <Input
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <Input
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                />
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                w="100%"
                isLoading={loading}
                loadingText="Creating account..."
              >
                Create Account
              </Button>
            </VStack>
          </form>
        </Box>

        <Text textAlign="center">
          Already have an account?{" "}
          <Link as={RouterLink} to="/login" color="blue.500">
            Sign in
          </Link>
        </Text>
      </VStack>
    </Container>
  );
};

export default RegisterPage;