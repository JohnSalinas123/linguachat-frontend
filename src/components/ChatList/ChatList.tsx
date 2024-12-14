import {
	ActionIcon,
	Button,
	Center,
	Container,
	Group,
	Stack,
	Text,
	UnstyledButton,
} from "@mantine/core";
import { Chats } from "../../types/Chats";

import "./ChatList.css";
import axios from "axios";
import { AiOutlineClose } from "react-icons/ai";
import { LuPlus } from "react-icons/lu";

axios.defaults.baseURL = "http://localhost:8080";
axios.defaults.withCredentials = true;

interface ChatListProps {
	chats: Chats | null;
	selectedChat: string | null;
	updateSelectedChat: (chatID: string) => void;
	close: (() => void) | null;
}

export const ChatList = ({
	chats,
	selectedChat,
	updateSelectedChat,
	close,
}: ChatListProps) => {
	//let listOfChats = null

	const convertLastMessageTime = (dataWithTimeZone: string) => {
		const date = new Date(dataWithTimeZone);

		//const hours = date.getHours();
		//const timeIdentifier = hours >= 12 ? "PM" : "AM";

		return `${date.getMonth()}/${date.getDate()}/${date.getFullYear() % 100}`;
	};

	const renderChats = () => {
		if (chats && chats.length > 0) {
			return (
				<Stack gap={0} className="chat-item-stack">
					{chats &&
						chats.map((chat) => (
							<UnstyledButton
								key={chat.chatId}
								onClick={() => updateSelectedChat(chat.chatId)}
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
			<div className="chat-list-header">
				<Group>
					<Text className="chat-list-header-title">Chats</Text>
					<Button h={30} radius="lg" rightSection={<LuPlus size={16} />}>
						Invite
					</Button>
				</Group>

				{close && (
					<ActionIcon
						onClick={close}
						color="black"
						variant="transparent"
						aria-label="Close chat list"
					>
						<AiOutlineClose
							color="#495057"
							style={{ width: "70%", height: "70%" }}
						/>
					</ActionIcon>
				)}
			</div>
			{renderChats()}
		</>
	);
};
