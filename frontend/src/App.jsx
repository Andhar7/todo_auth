import React from "react";
import { Box, useColorModeValue } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";

import CreatePage from "./pages/CreatePage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import useAuthStore from "./store/auth-localStorage";

function App() {
	const initializeAuth = useAuthStore((state) => state.initializeAuth);

	useEffect(() => {
		// Initialize auth on app startup
		initializeAuth();
	}, [initializeAuth]);

	return (
		<Box minH={"100vh"} bg={useColorModeValue("gray.100", "gray.900")}>
			<Navbar />
			<Routes>
				<Route path='/login' element={<LoginPage />} />
				<Route path='/register' element={<RegisterPage />} />
				<Route path='/email-verification' element={<EmailVerificationPage showResendOnly={true} />} />
				<Route path='/verify-email/:token' element={<VerifyEmailPage />} />
				<Route 
					path='/' 
					element={
						<ProtectedRoute>
							<HomePage />
						</ProtectedRoute>
					} 
				/>
				<Route 
					path='/create' 
					element={
						<ProtectedRoute>
							<CreatePage />
						</ProtectedRoute>
					} 
				/>
			</Routes>
		</Box>
	);
}

export default App;
