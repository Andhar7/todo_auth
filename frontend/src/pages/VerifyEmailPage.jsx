import React, { useEffect, useState } from 'react';
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
  Spinner,
  Icon,
} from '@chakra-ui/react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useParams, useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/auth-localStorage';

const VerifyEmailPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { verifyEmail } = useAuthStore();
  const [verificationStatus, setVerificationStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');
  const [verifiedUser, setVerifiedUser] = useState(null);

  useEffect(() => {
    const handleEmailVerification = async () => {
      if (!token) {
        setVerificationStatus('error');
        setMessage('Invalid verification token');
        return;
      }

      try {
        const result = await verifyEmail(token);
        
        if (result.success) {
          setVerificationStatus('success');
          setMessage(result.message);
          setVerifiedUser(result.user);
        } else {
          setVerificationStatus('error');
          setMessage(result.message);
        }
      } catch (error) {
        setVerificationStatus('error');
        setMessage('An unexpected error occurred during verification');
      }
    };

    handleEmailVerification();
  }, [token, verifyEmail]);

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  if (verificationStatus === 'loading') {
    return (
      <Container maxW="md" py={12}>
        <VStack spacing={8} align="center">
          <Spinner size="xl" color="blue.500" thickness="4px" />
          <Heading size="lg" textAlign="center">
            Verifying Your Email
          </Heading>
          <Text color="gray.600" textAlign="center">
            Please wait while we verify your email address...
          </Text>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="md" py={12}>
      <VStack spacing={8} align="center">
        <VStack spacing={4} align="center">
          <Icon 
            as={verificationStatus === 'success' ? FaCheckCircle : FaTimesCircle} 
            w={16} 
            h={16} 
            color={verificationStatus === 'success' ? 'green.500' : 'red.500'} 
          />
          <Heading size="lg" textAlign="center">
            {verificationStatus === 'success' ? 'Email Verified!' : 'Verification Failed'}
          </Heading>
        </VStack>

        <Alert 
          status={verificationStatus === 'success' ? 'success' : 'error'} 
          borderRadius="md"
        >
          <AlertIcon />
          <Box>
            <AlertTitle>
              {verificationStatus === 'success' ? 'Success!' : 'Error'}
            </AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Box>
        </Alert>

        {verificationStatus === 'success' && verifiedUser && (
          <Box 
            w="full" 
            p={6} 
            borderWidth={1} 
            borderRadius="md" 
            bg="green.50" 
            _dark={{ bg: "green.900" }}
          >
            <VStack spacing={2}>
              <Text fontSize="sm" fontWeight="semibold" color="green.700" _dark={{ color: "green.300" }}>
                Account Details
              </Text>
              <Text fontSize="sm">Username: {verifiedUser.username}</Text>
              <Text fontSize="sm">Email: {verifiedUser.email}</Text>
            </VStack>
          </Box>
        )}

        {verificationStatus === 'success' ? (
          <VStack spacing={4}>
            <Text textAlign="center" color="gray.600" _dark={{ color: "gray.400" }}>
              Your email has been successfully verified! You can now log in to your account.
            </Text>
            <Button colorScheme="blue" onClick={handleLoginRedirect} size="lg">
              Log In to Your Account
            </Button>
          </VStack>
        ) : (
          <VStack spacing={4}>
            <Text textAlign="center" color="gray.600" _dark={{ color: "gray.400" }}>
              The verification link may be expired or invalid. You can request a new verification email.
            </Text>
            <VStack spacing={2}>
              <Button as={Link} to="/email-verification" colorScheme="blue" variant="outline">
                Resend Verification Email
              </Button>
              <Button as={Link} to="/register" variant="ghost">
                Create New Account
              </Button>
            </VStack>
          </VStack>
        )}

        <Box textAlign="center">
          <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
            Need help? <Link to="/login" style={{ color: 'var(--chakra-colors-blue-500)' }}>Contact support</Link>
          </Text>
        </Box>
      </VStack>
    </Container>
  );
};

export default VerifyEmailPage;