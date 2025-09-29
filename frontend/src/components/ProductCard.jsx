import React from "react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
	Box,
	Button,
	Heading,
	HStack,
	IconButton,
	Image,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
	useColorModeValue,
	useDisclosure,
	useToast,
	VStack,
} from "@chakra-ui/react";
import { useProductStore } from "../store/product";
import { useState } from "react";

const ProductCard = ({ product }) => {
	const [updatedProduct, setUpdatedProduct] = useState(product);
	const [imageError, setImageError] = useState(false);

	const textColor = useColorModeValue("gray.600", "gray.200");
	const bg = useColorModeValue("white", "gray.800");

	const { deleteProduct, updateProduct } = useProductStore();
	const toast = useToast();
	const { isOpen, onOpen, onClose } = useDisclosure();

	// Generate a color based on product name for consistent placeholders
	const generateColor = (name) => {
		const colors = [
			'#FF6B6B', '#4ECDC4', '#45B7D1', '#F9CA24', 
			'#F0932B', '#6C5CE7', '#A29BFE', '#26DE81',
			'#FD79A8', '#FDCB6E', '#E17055', '#74B9FF'
		];
		let hash = 0;
		for (let i = 0; i < name.length; i++) {
			hash = name.charCodeAt(i) + ((hash << 5) - hash);
		}
		return colors[Math.abs(hash) % colors.length];
	};

	// Handle image source with fallback
	const getImageSrc = () => {
		if (imageError || !product.image || product.image.trim() === '' || product.image.includes('via.placeholder.com')) {
			// Create a colorful SVG placeholder
			const color = generateColor(product.name);
			const textColor = '#FFFFFF';
			const productName = product.name || 'Product';
			
			return 'data:image/svg+xml;base64,' + btoa(`
				<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
					<defs>
						<linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
							<stop offset="0%" style="stop-color:${color};stop-opacity:1" />
							<stop offset="100%" style="stop-color:${color}AA;stop-opacity:1" />
						</linearGradient>
					</defs>
					<rect width="100%" height="100%" fill="url(#grad)"/>
					<text x="50%" y="45%" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="${textColor}" text-anchor="middle" dominant-baseline="middle">
						${productName}
					</text>
					<text x="50%" y="65%" font-family="Arial, sans-serif" font-size="14" fill="${textColor}" text-anchor="middle" dominant-baseline="middle" opacity="0.8">
						$${product.price}
					</text>
				</svg>
			`);
		}
		return product.image;
	};

	const handleImageError = () => {
		setImageError(true);
	};

	const handleDeleteProduct = async (pid) => {
		try {
			const { success, message } = await deleteProduct(pid);
			if (!success) {
				toast({
					title: "Error",
					description: message,
					status: "error",
					duration: 3000,
					isClosable: true,
				});
			} else {
				toast({
					title: "Success",
					description: message,
					status: "success",
					duration: 3000,
					isClosable: true,
				});
			}
		} catch (error) {
			console.error("Delete product error:", error);
			toast({
				title: "Error",
				description: "An unexpected error occurred while deleting the product",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		}
	};

	const handleUpdateProduct = async (pid, updatedProduct) => {
		const { success, message } = await updateProduct(pid, updatedProduct);
		onClose();
		if (!success) {
			toast({
				title: "Error",
				description: message,
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		} else {
			toast({
				title: "Success",
				description: "Product updated successfully",
				status: "success",
				duration: 3000,
				isClosable: true,
			});
		}
	};

	return (
		<Box
			shadow='lg'
			rounded='lg'
			overflow='hidden'
			transition='all 0.3s'
			_hover={{ transform: "translateY(-5px)", shadow: "xl" }}
			bg={bg}
		>
			<Image 
				src={getImageSrc()} 
				alt={product.name} 
				h={48} 
				w='full' 
				objectFit='cover'
				onError={handleImageError}
				fallback={
					<Box 
						h={48} 
						w="full" 
						bg={generateColor(product.name)}
						display="flex"
						alignItems="center"
						justifyContent="center"
						color="white"
						fontSize="sm"
						fontWeight="bold"
						textAlign="center"
					>
						{product.name}
					</Box>
				}
			/>

			<Box p={4}>
				<Heading as='h3' size='md' mb={2}>
					{product.name}
				</Heading>

				<Text fontWeight='bold' fontSize='xl' color={textColor} mb={4}>
					${product.price}
				</Text>

				<HStack spacing={2}>
					<IconButton icon={<EditIcon />} onClick={onOpen} colorScheme='blue' />
					<IconButton
						icon={<DeleteIcon />}
						onClick={() => handleDeleteProduct(product.id)}
						colorScheme='red'
					/>
				</HStack>
			</Box>

			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />

				<ModalContent>
					<ModalHeader>Update Product</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<VStack spacing={4}>
							<Input
								placeholder='Product Name'
								name='name'
								value={updatedProduct.name}
								onChange={(e) => setUpdatedProduct({ ...updatedProduct, name: e.target.value })}
							/>
							<Input
								placeholder='Price'
								name='price'
								type='number'
								value={updatedProduct.price}
								onChange={(e) => setUpdatedProduct({ ...updatedProduct, price: e.target.value })}
							/>
							<Input
								placeholder='Image URL'
								name='image'
								value={updatedProduct.image}
								onChange={(e) => setUpdatedProduct({ ...updatedProduct, image: e.target.value })}
							/>
						</VStack>
					</ModalBody>

					<ModalFooter>
						<Button
							colorScheme='blue'
							mr={3}
							onClick={() => handleUpdateProduct(product.id, updatedProduct)}
						>
							Update
						</Button>
						<Button variant='ghost' onClick={onClose}>
							Cancel
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Box>
	);
};
export default ProductCard;
