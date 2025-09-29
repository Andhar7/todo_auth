import { create } from "zustand";
import axios from "axios";

export const useProductStore = create((set) => ({
	products: [],
	setProducts: (products) => set({ products }),
	createProduct: async (newProduct) => {
		// Validate required fields
		if (!newProduct.name || !newProduct.name.trim() || !newProduct.price || !newProduct.price.toString().trim()) {
			return { success: false, message: "Please fill in name and price fields." };
		}
		
		// Validate field lengths
		if (newProduct.name.trim().length > 100) {
			return { success: false, message: "Product name cannot exceed 100 characters." };
		}
		
		if (newProduct.image && newProduct.image.trim().length > 200) {
			return { success: false, message: "Image URL cannot exceed 200 characters." };
		}
		
		try {
			// Clean up the data before sending
			const productData = {
				name: newProduct.name.trim(),
				price: newProduct.price.toString().trim(),
			};
			
			// Only include image if it has a value, otherwise create a local SVG placeholder
			if (newProduct.image && newProduct.image.trim()) {
				productData.image = newProduct.image.trim();
			} else {
				// Generate a colorful SVG placeholder based on product name
				const colors = [
					'#FF6B6B', '#4ECDC4', '#45B7D1', '#F9CA24', 
					'#F0932B', '#6C5CE7', '#A29BFE', '#26DE81',
					'#FD79A8', '#FDCB6E', '#E17055', '#74B9FF'
				];
				let hash = 0;
				const name = newProduct.name.trim();
				for (let i = 0; i < name.length; i++) {
					hash = name.charCodeAt(i) + ((hash << 5) - hash);
				}
				const color = colors[Math.abs(hash) % colors.length];
				
				productData.image = 'data:image/svg+xml;base64,' + btoa(`
					<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
						<defs>
							<linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
								<stop offset="0%" style="stop-color:${color};stop-opacity:1" />
								<stop offset="100%" style="stop-color:${color}AA;stop-opacity:1" />
							</linearGradient>
						</defs>
						<rect width="100%" height="100%" fill="url(#grad)"/>
						<text x="50%" y="45%" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#FFFFFF" text-anchor="middle" dominant-baseline="middle">
							${name}
						</text>
						<text x="50%" y="65%" font-family="Arial, sans-serif" font-size="14" fill="#FFFFFF" text-anchor="middle" dominant-baseline="middle" opacity="0.8">
							$${productData.price}
						</text>
					</svg>
				`);
			}
			
			const res = await axios.post("/api/products/", productData);
			const data = res.data;
			
			set((state) => ({ products: [...state.products, data] }));
			return { success: true, message: "Product created successfully" };
		} catch (error) {
			console.error("Error creating product:", error);
			
			// Handle different error responses
			if (error.response?.status === 401) {
				return { success: false, message: "Authentication required. Please log in." };
			}
			
			// Extract error messages from backend response
			const data = error.response?.data;
			if (data) {
				const errorMessages = [];
				if (data.name) errorMessages.push(`Name: ${Array.isArray(data.name) ? data.name.join(", ") : data.name}`);
				if (data.price) errorMessages.push(`Price: ${Array.isArray(data.price) ? data.price.join(", ") : data.price}`);
				if (data.image) errorMessages.push(`Image: ${Array.isArray(data.image) ? data.image.join(", ") : data.image}`);
				
				const message = errorMessages.length > 0 
					? errorMessages.join("; ") 
					: data.error || data.message || "Failed to create product";
				
				return { success: false, message };
			}
			
			return { success: false, message: "Network error. Please try again." };
		}
	},
	fetchProducts: async () => {
		try {
			const res = await axios.get("/api/products/");
			const data = res.data;
			
			set({ products: data });
		} catch (error) {
			console.error("Error fetching products:", error);
			
			if (error.response?.status === 401) {
				console.error("Authentication required for fetching products");
			}
		}
	},
	deleteProduct: async (pid) => {
		try {
			await axios.delete(`/api/products/${pid}/`);

			// update the ui immediately, without needing a refresh
			set((state) => ({ products: state.products.filter((product) => product.id !== pid) }));
			return { success: true, message: "Product deleted successfully" };
		} catch (error) {
			console.error("Error deleting product:", error);
			
			if (error.response?.status === 401) {
				return { success: false, message: "Authentication required. Please log in." };
			}
			
			let errorMessage = "Failed to delete product";
			if (error.response?.data) {
				errorMessage = error.response.data.error || error.response.data.message || errorMessage;
			}
			
			return { success: false, message: errorMessage };
		}
	},
	updateProduct: async (pid, updatedProduct) => {
		try {
			const res = await axios.put(`/api/products/${pid}/`, updatedProduct);
			const data = res.data;

			// update the ui immediately, without needing a refresh
			set((state) => ({
				products: state.products.map((product) => (product.id === pid ? data : product)),
			}));

			return { success: true, message: "Product updated successfully" };
		} catch (error) {
			console.error("Error updating product:", error);
			
			if (error.response?.status === 401) {
				return { success: false, message: "Authentication required. Please log in." };
			}
			
			const errorMessage = error.response?.data?.error || error.response?.data?.message || "Failed to update product";
			return { success: false, message: errorMessage };
		}
	},
}));
