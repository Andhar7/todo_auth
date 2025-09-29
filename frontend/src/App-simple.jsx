import React from "react";
import { Box, useColorModeValue, Text, Button } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";

const SimplePage = () => (
  <Box p={8}>
    <Text fontSize="2xl" mb={4}>Welcome to Todo Auth!</Text>
    <Text>This is a simple page to test if React is working.</Text>
  </Box>
);

const SimpleLogin = () => (
  <Box p={8}>
    <Text fontSize="2xl" mb={4}>Login Page</Text>
    <Button colorScheme="blue">Test Button</Button>
  </Box>
);

function App() {
  return (
    <Box minH={"100vh"} bg={useColorModeValue("gray.100", "gray.900")}>
      <Routes>
        <Route path='/login' element={<SimpleLogin />} />
        <Route path='/' element={<SimplePage />} />
      </Routes>
    </Box>
  );
}

export default App;