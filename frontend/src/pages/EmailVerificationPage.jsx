import React, { useState } from 'react';
import {
  Container,
  VStack,
  Heading,
  Text,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
  Input,
  FormControl,
  FormLabel,
  useToast,
  HStack,
  Icon,
} from '@chakra-ui/react';
import { FaEnvelope, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/auth-localStorage';

const EmailVerificationPage = ({ email: propEmail, showResendOnly = false }) => {
  const [email, setEmail] = useState(propEmail || '');
  const [isResending, setIsResending] = useState(false);
  const { resendVerificationEmail, clearEmailVerificationState } = useAuthStore();
  const toast = useToast();
  const navigate = useNavigate();

  const handleResendEmail = async () => {
    if (!email) {
      toast({
        title: 'Email Required',
        description: 'Please enter your email address',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsResending(true);
    const result = await resendVerificationEmail(email);
    
    if (result.success) {
      toast({
        title: 'Email Sent',
        description: result.message,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Failed to Send Email',
        description: result.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
    setIsResending(false);
  };

  const handleBackToLogin = () => {
    clearEmailVerificationState();
    navigate('/login');
  };

  return (
    <Container maxW="md" py={12}>
      <VStack spacing={8} align="center">
        <VStack spacing={4} align="center">
          <Icon as={FaEnvelope} w={16} h={16} color="blue.500" />
          <Heading size="lg" textAlign="center">
            {showResendOnly ? 'Resend Verification Email' : 'Check Your Email'}
          </Heading>
        </VStack>

        {!showResendOnly && (
          <Alert status="info" borderRadius="md">
            <AlertIcon as={FaCheckCircle} />
            <Box>
              <AlertTitle>Email Verification Required</AlertTitle>
              <AlertDescription>
                We've sent a verification link to your email address. Please check your inbox 
                and click the link to verify your account.
              </AlertDescription>
            </Box>
          </Alert>
        )}

        <Box w="full" p={6} borderWidth={1} borderRadius="md" bg="gray.50" _dark={{ bg: "gray.700" }}>
          <VStack spacing={4}>
            <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }} textAlign="center">
              Didn't receive the email? Check your spam folder or resend the verification email.
            </Text>

            <FormControl>
              <FormLabel>Email Address</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                bg="white"
                _dark={{ bg: "gray.600" }}
              />
            </FormControl>

            <Button
              colorScheme="blue"
              onClick={handleResendEmail}
              isLoading={isResending}
              loadingText="Sending..."
              w="full"
            >
              Resend Verification Email
            </Button>
          </VStack>
        </Box>

        <Alert status="warning" borderRadius="md">
          <AlertIcon as={FaExclamationTriangle} />
          <Box>
            <AlertDescription fontSize="sm">
              <strong>Important:</strong> You must verify your email address before you can log in 
              to your account. The verification link will expire in 24 hours.
            </AlertDescription>
          </Box>
        </Alert>

        <HStack spacing={4}>
          <Button variant="ghost" onClick={handleBackToLogin}>
            Back to Login
          </Button>
          <Button as={Link} to="/register" variant="outline">
            Create New Account
          </Button>
        </HStack>

        <Box textAlign="center">
          <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
            Having trouble? Contact support for assistance.
          </Text>
        </Box>
      </VStack>
    </Container>
  );
};

export default EmailVerificationPage;