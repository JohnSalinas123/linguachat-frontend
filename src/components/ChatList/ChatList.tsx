import {
	Button,
	Center,
	Container,
	Group,
	Skeleton,
	Stack,
	Text,
	UnstyledButton,
} from "@mantine/core";
import { Chats } from "../../types/Chats";
import { Dispatch, SetStateAction, useEffect } from "react";

import { FaCirclePlus } from "react-icons/fa6";

import "./ChatList.css";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:8080";
axios.defaults.withCredentials = true;

interface ChatListProps {
	chats: Chats | null;
	selectedChat: string | null;
	setSelectedChat: Dispatch<SetStateAction<string | null>>;
}

export const ChatList = ({
	chats,
	selectedChat,
	setSelectedChat,
}: ChatListProps) => {
	//let listOfChats = null

	const convertLastMessageTime = (dataWithTimeZone: string) => {
		const date = new Date(dataWithTimeZone);

		//const hours = date.getHours();
		//const timeIdentifier = hours >= 12 ? "PM" : "AM";

		return `${date.getMonth()}/${date.getDate()}/${date.getFullYear() % 100}`;
	};

	const handleChatSelected = (chatID: string) => {
		console.log(selectedChat);
		if (chatID == selectedChat) return;

		setSelectedChat(chatID);
	};

	const renderChats = () => {
		if (chats && chats.length > 0) {
			return (
				<Stack gap={0}>
					{chats &&
						chats.map((chat) => (
							<UnstyledButton
								key={chat.chatId}
								onClick={() => handleChatSelected(chat.chatId)}
							>
								<Container
									className={`chat-item-box ${
										chat.chatId == selectedChat ? "selected-chat" : ""
									}`}
								>
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
						))}
				</Stack>
			);
		}

		if (chats && chats.length == 0) {
			console.log("No chats found");
			return (
				<Center className="fill-space">
					<p className="lg-text">No chats</p>
				</Center>
			);
		}
	};

	return (
		<>
			<div className="chat-list chat-sp lg-border left-panel-border">
				<div className="chat-list-box">
					<ChatListHeader />
					<Skeleton radius={0} className="fill-space" visible={chats == null}>
						{renderChats()}
					</Skeleton>
				</div>
			</div>
		</>
	);
};

const ChatListHeader = () => {
	//const { getToken } = useAuth();

	useEffect(() => {}, []);

	const handleCreateChat = async () => {
		return;
	};

	return (
		<div className="chat-list-header">
			<Text className="chat-list-header-title">Chats</Text>
			<Button
				onClick={handleCreateChat}
				h={30}
				radius="xl"
				rightSection={<FaCirclePlus size={15} />}
			>
				Invite
			</Button>
		</div>
	);
};
