import {
	Container,
	Drawer,
	Flex,
} from "@mantine/core";
import { ChatWindow } from "../components/ChatWindow/ChatWindow";

import "./ChatPage.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Chats } from "../types/Chats";
import { ChatList } from "../components/ChatList/ChatList";
import { Message } from "../types/Message";
import { useDisclosure } from "@mantine/hooks";
import { useOutletContext } from "react-router-dom";

export const ChatPage = () => {
	const { getToken, isLoaded, isSignedIn } = useAuth();
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [chats, setChats] = useState<Chats | null>(null);
	const [messages, setMessages] = useState<Message[] | null>(null);
	const [messagesLoading, setMessagesLoading] = useState<boolean>(false);
	const [selectedChat, setSelectedChat] = useState<string | null>(null);
	const [messagesPage, setMessagesPage] = useState<number>(0);

	const [toggleDisabled] = useOutletContext<[(value?: boolean) => void]>();

	// side panel states
	const [leftOpened, { open: openChatList, close: closeChatList }] =
		useDisclosure(false);
	const [rightOpened, { open: openRight, close: closeRight }] =
		useDisclosure(false);

	// TODO: change once implement user details/settings, incoporate into
	// fetchUserSettings

	const { user } = useUser();

	useEffect(() => {
		// fetch user chats and set initial message page to 0
		const loadUserChats = async () => {
			if (!isLoaded || !isSignedIn || !user?.publicMetadata.lang_code) return;

			// fetch user chats
			await fetchUserChats();
		};

		loadUserChats();
	}, [isLoaded, isSignedIn, user, user?.publicMetadata.lang_code]);

	useEffect(() => {
		if (chats && chats.length > 0 && !selectedChat) {
			const firstChatId = chats[0].chatId;
			setSelectedChat(firstChatId);
			loadChatMessages(firstChatId, 0);
		}
	}, [chats]);

	// fetchUserChats calls api for user chats
	const fetchUserChats = async () => {
		try {
			const token = await getToken();
			if (!token || token.length == 0) {
				return;
			}
			//console.log(`Token: ${token}`);

			const response = await axios.get("/api/chats", {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.status === 200) {
				setChats(response.data);
			}
		} catch (error) {
			if (axios.isAxiosError(error)) {
				console.log(error.status);
				console.error(error.response);
			} else {
				console.log(error);
			}
		}
	};

	// fetchChatMessages retrieves chat messages for the selected chat
	const loadChatMessages = async (chatId: string, page: number) => {
		try {
			const token = await getToken();
			if (!token || token.length === 0) {
				return;
			}

			setMessagesLoading(true);

			const response = await axios.get(
				`/api/chats/${chatId}/messages?pageNum=${page}&langCode=${user?.publicMetadata.lang_code}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (response?.status === 200) {
				setMessagesPage(0);
				setMessages(response.data);
				setMessagesLoading(false);
				return true;
			}
		} catch (error) {
			if (axios.isAxiosError(error)) {
				console.log(error.status);
				console.error(error.response);
			} else {
				console.log(error);
			}
		}

		return false;
	};

	// TODO:
	// handleSelectChat handles user selecting a chat
	const updateSelectChat = async (chatId: string) => {
		if (messagesLoading) return;

		if (chatId === selectedChat && leftOpened) {
			closeChatList();
			return;
		}

		if (chatId === selectedChat) return;

		const success = await loadChatMessages(chatId, 0);
		if (success) {
			setSelectedChat(chatId);
			if (leftOpened) {
				closeChatList();
			}
		}
	};

	// addMessage adds a message to the current chat
	const addMessage = (message: Message) => {
		setMessages((prevMessages) => {
			if (!prevMessages) return [message];
			return [...prevMessages, message];
		});
	};

	const updateLastMessage = (
		chatId: string,
		newLastMessage: string,
		newTimestamp: string
	) => {
		setChats((prevChats) => {
			if (!prevChats) return prevChats;
			return prevChats.map((chat) =>
				chat.chatId === chatId
					? {
							...chat,
							last_message: newLastMessage,
							last_message_time: newTimestamp,
					  }
					: chat
			);
		});
	};

	return (
		<>
			<Flex
				justify="center"
				gap={0}
				wrap="nowrap"
				className="chat-components-box"
			>
				<Drawer
					opened={leftOpened}
					onClose={closeChatList}
					position="left"
					offset={20}
					radius="md"
					withCloseButton={false}
				>
					<ChatList
						chats={chats}
						selectedChat={selectedChat}
						updateSelectedChat={updateSelectChat}
						close={closeChatList}
					/>
				</Drawer>
				<Drawer
					opened={rightOpened}
					onClose={closeRight}
					position="right"
					offset={20}
					radius="md"
					title="Settings"
					zIndex={"100"}
				>
					<div>Right drawer, wip</div>
				</Drawer>
				<div className="chat-list-panel">
					<ChatList
						chats={chats}
						selectedChat={selectedChat}
						updateSelectedChat={updateSelectChat}
						close={null}
					/>
				</div>

				<ChatWindow
					curChatID={selectedChat}
					messages={messages}
					messagesLoading={messagesLoading}
					addMessage={addMessage}
					openChatList={openChatList}
					openRight={openRight}
					disableNav={toggleDisabled}
					updateLastMessage={updateLastMessage}
				/>
				<Container mx={0} className="right-panel chat-sp"></Container>
			</Flex>
		</>
	);
};

