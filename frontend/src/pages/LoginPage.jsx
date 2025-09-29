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

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const { login, loading, isAuthenticated, emailVerificationRequired } = useAuthStore();

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Show email verification page if email verification is required
  if (showEmailVerification || emailVerificationRequired) {
    return <EmailVerificationPage email={userEmail} />;
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

    if (!formData.username || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    const result = await login(formData);
    if (!result.success) {
      if (result.emailVerificationRequired) {
        // Try to get user email - we'll need to make an API call or store it during registration
        setUserEmail(""); // We'll need to handle this better - maybe from the error response
        setShowEmailVerification(true);
      } else {
        setError(result.message);
      }
    }
  };

  return (
    <Container maxW="md" py={12}>
      <VStack spacing={8}>
        <Heading textAlign="center" size="lg">
          Sign In
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
                  placeholder="Enter your username"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                />
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                w="100%"
                isLoading={loading}
                loadingText="Signing in..."
              >
                Sign In
              </Button>
            </VStack>
          </form>
        </Box>

        <VStack spacing={2}>
          <Text textAlign="center">
            Don't have an account?{" "}
            <Link as={RouterLink} to="/register" color="blue.500">
              Sign up
            </Link>
          </Text>
          <Text textAlign="center" fontSize="sm" color="gray.600">
            Need to verify your email?{" "}
            <Link as={RouterLink} to="/email-verification" color="blue.500">
              Resend verification email
            </Link>
          </Text>
        </VStack>
      </VStack>
    </Container>
  );
};

export default LoginPage;