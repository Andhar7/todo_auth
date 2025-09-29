import { Box, Text } from "@chakra-ui/react";

function App() {
  return (
    <Box minH="100vh" bg="gray.100" p={8}>
      <Text fontSize="2xl" color="blue.500">
        Hello! Frontend is working! 🎉
      </Text>
      <Text mt={4}>
        Authentication system loaded successfully.
      </Text>
    </Box>
  );
}

export default App;