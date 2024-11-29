import {
	Button,
	Container,
	Group,
	Stack,
	Text,
	UnstyledButton,
} from "@mantine/core";
import { Chat, Chats } from "../../types/Chats";
import { useEffect } from "react";

import { FaCirclePlus } from "react-icons/fa6";

import "./ChatList.css";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

axios.defaults.baseURL = "http://localhost:8080";
axios.defaults.withCredentials = true;

interface ChatListProps {
	chats: Chats;
}

export const ChatList = ({ chats }: ChatListProps) => {
	const listOfChats = chats.map((chat) => (
		<ChatListItem key={chat.chatId} chat={chat} />
	));

	return (
		<>
			<ChatListHeader />
			<Stack gap={0}>{listOfChats}</Stack>
		</>
	);
};

interface ChatListItemProps {
	chat: Chat;
}

const ChatListItem = ({ chat }: ChatListItemProps) => {
	const convertLastMessageTime = (dataWithTimeZone: string) => {
		const date = new Date(dataWithTimeZone);

		//const hours = date.getHours();
		//const timeIdentifier = hours >= 12 ? "PM" : "AM";

		return `${date.getMonth()}/${date.getDate()}/${date.getFullYear()%100}`;
	};

	return (
		<>
			<UnstyledButton>
				<Container className="chat-item-box">
					<Group justify="space-between">
						<Text className="chat-participants">
							{chat.participants.join(",")}
						</Text>
						<Text className="chat-last-msg-time" c="dimmed">
							{chat.last_message_time &&
								convertLastMessageTime(chat.last_message_time)}
						</Text>
					</Group>

					<Text className="chat-last-msg" c="dimmed" size="sm">
						{chat.last_message}
					</Text>
				</Container>
			</UnstyledButton>
		</>
	);
};

const ChatListHeader = () => {
	const { getToken } = useAuth();

	useEffect(() => {}, []);

	const handleCreateChat = async () => {
		try {
			const token = await getToken();
			const response = await axios.post(
				"/api/users",
				{},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			console.log(response.status);
			console.log(response.data);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>
			<Container className="chat-list-header">
				<Text className="chat-list-header-title">Chats</Text>
				<Button
					onClick={handleCreateChat}
					h={30}
					radius="xl"
					rightSection={<FaCirclePlus size={15} />}
				>
					Invite
				</Button>
			</Container>
		</>
	);
};
