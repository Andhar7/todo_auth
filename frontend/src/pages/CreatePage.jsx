import React from "react";
import { Box, Button, Container, Heading, Input, useColorModeValue, useToast, VStack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProductStore } from "../store/product";

const CreatePage = () => {
	const [newProduct, setNewProduct] = useState({
		name: "",
		price: "",
		image: "",
	});
	const toast = useToast();
	const navigate = useNavigate();

	const { createProduct } = useProductStore();

	const handleAddProduct = async () => {
		const { success, message } = await createProduct(newProduct);
		if (!success) {
			toast({
				title: "Error",
				description: message,
				status: "error",
				isClosable: true,
			});
		} else {
			toast({
				title: "Success",
				description: message,
				status: "success",
				isClosable: true,
			});
			setNewProduct({ name: "", price: "", image: "" });
			// Navigate to home page to see the new product
			navigate("/");
		}
	};

	return (
		<Container maxW={"container.sm"}>
			<VStack spacing={8}>
				<Heading as={"h1"} size={"2xl"} textAlign={"center"} mb={8}>
					Create New Product
				</Heading>

				<Box w={"full"} bg={useColorModeValue("white", "gray.800")} p={6} rounded={"lg"} shadow={"md"}>
					<VStack spacing={4}>
						<Text fontSize="sm" color="gray.500" alignSelf="flex-start">
							Fields marked with * are required. If no image URL is provided, a colorful placeholder will be generated automatically.
						</Text>
						<Box w="full">
							<Input
								placeholder='Product Name *'
								name='name'
								maxLength={100}
								value={newProduct.name}
								onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
							/>
							<Text fontSize="xs" color="gray.400" mt={1} textAlign="right">
								{newProduct.name.length}/100 characters
							</Text>
						</Box>
						<Input
							placeholder='Price *'
							name='price'
							type='number'
							value={newProduct.price}
							onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
						/>
						<Box w="full">
							<Input
								placeholder='Image URL (optional)'
								name='image'
								maxLength={200}
								value={newProduct.image}
								onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
							/>
							<Text fontSize="xs" color="gray.400" mt={1} textAlign="right">
								{newProduct.image.length}/200 characters
							</Text>
						</Box>

						<Button colorScheme='blue' onClick={handleAddProduct} w='full'>
							Add Product
						</Button>
					</VStack>
				</Box>
			</VStack>
		</Container>
	);
};
export default CreatePage;
