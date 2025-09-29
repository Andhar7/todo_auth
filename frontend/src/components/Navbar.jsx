import React from "react";
import { Button, Container, Flex, HStack, Text, useColorMode, Menu, MenuButton, MenuList, MenuItem, Avatar } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";

import { PlusSquareIcon } from "@chakra-ui/icons";
import { IoMoon } from "react-icons/io5";
import { LuSun } from "react-icons/lu";
import { FiUser, FiLogOut } from "react-icons/fi";
import useAuthStore from "../store/auth-localStorage";

const Navbar = () => {
	const { colorMode, toggleColorMode } = useColorMode();
	const { isAuthenticated, user, logout } = useAuthStore();
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate('/login');
	};

	return (
		<Container maxW={"1140px"} px={4}>
			<Flex
				h={16}
				alignItems={"center"}
				justifyContent={"space-between"}
				flexDir={{
					base: "column",
					sm: "row",
				}}
			>
				<Text
					fontSize={{ base: "22", sm: "28" }}
					fontWeight={"bold"}
					textTransform={"uppercase"}
					textAlign={"center"}
					bgGradient={"linear(to-r, cyan.400, blue.500)"}
					bgClip={"text"}
				>
					<Link to={"/"}>Product Store 🛒</Link>
				</Text>

				<HStack spacing={2} alignItems={"center"}>
					{isAuthenticated ? (
						<>
							<Link to={"/create"}>
								<Button>
									<PlusSquareIcon fontSize={20} />
								</Button>
							</Link>
							<Button onClick={toggleColorMode}>
								{colorMode === "light" ? <IoMoon /> : <LuSun size='20' />}
							</Button>
							<Menu>
								<MenuButton as={Button} variant="ghost" p={2}>
									<HStack spacing={2}>
										<Avatar size="sm" name={user?.username} />
										<Text fontSize="sm">{user?.username}</Text>
									</HStack>
								</MenuButton>
								<MenuList>
									<MenuItem icon={<FiUser />}>
										Profile
									</MenuItem>
									<MenuItem icon={<FiLogOut />} onClick={handleLogout}>
										Logout
									</MenuItem>
								</MenuList>
							</Menu>
						</>
					) : (
						<>
							<Button onClick={toggleColorMode}>
								{colorMode === "light" ? <IoMoon /> : <LuSun size='20' />}
							</Button>
							<Link to={"/login"}>
								<Button variant="outline">
									Login
								</Button>
							</Link>
							<Link to={"/register"}>
								<Button colorScheme="blue">
									Register
								</Button>
							</Link>
						</>
					)}
				</HStack>
			</Flex>
		</Container>
	);
};
export default Navbar;
