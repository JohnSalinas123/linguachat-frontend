import { Container, Flex } from "@mantine/core";
import { ChatWindow } from "../components/ChatWindow/ChatWindow";

import "./ChatPage.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { Chats } from "../types/Chats";
import { ChatList } from "../components/ChatList/ChatList";

export const ChatPage = () => {
	const { getToken, isLoaded } = useAuth();
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [chats, setChats] = useState<Chats>([]);

	useEffect(() => {
		if (isLoaded) {
			fetchUserChats();
		}
	}, [isLoaded]);

	const fetchUserChats = async () => {
		try {
			const token = await getToken();
			if (!token) {
				console.log("No token available");
				return;
			}
			console.log(token);
			const response = await axios.get("/api/chats", {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			console.log(response.data);
			setChats(response.data);
		} catch (error) {
			if (axios.isAxiosError(error)) {
				console.log(error.status);
				console.error(error.response);
			} else {
				console.log(error);
			}
		}
	};

	return (
		<>
			<div className="page">
				<Flex
					justify="center"
					gap={0}
					wrap="nowrap"
					className="chat-components-box"
				>
					<Container
						p={0}
						mx={0}
						className="chat-sp lg-border left-panel-border"
					>
						<ChatList chats={chats} />
					</Container>
					<ChatWindow />
					<Container
						mx={0}
						className="chat-sp lg-border right-panel-border"
					></Container>
				</Flex>
			</div>
		</>
	);
};
