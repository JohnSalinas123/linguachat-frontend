import {
	Button,
	CloseButton,
	Container,
	Drawer,
	Flex,
	Group,
	Radio,
	SimpleGrid,
	Stack,
	Text,
} from "@mantine/core";
import { ChatWindow } from "../components/ChatWindow/ChatWindow";

import "./ChatPage.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Chats } from "../types/Chats";
import { ChatList } from "../components/ChatList/ChatList";
import { FaArrowRight } from "react-icons/fa6";
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

	// render modal welcoming user, asking for them to choose a language before
	// starting to use chat
	if (!user?.publicMetadata.lang_code) return <LanguageSetWindow />;

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
					overlayProps={{}}
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
				/>
				<Container mx={0} className="right-panel chat-sp"></Container>
			</Flex>
		</>
	);
};

interface LangOptions {
	lang_name: string;
	lang_code: string;
}

const LanguageSetWindow = () => {
	const { getToken, isLoaded, isSignedIn } = useAuth();
	const [value, setValue] = useState<string | null>(null);
	const [langOptions, setLangOptions] = useState<LangOptions[]>();
	const { user } = useUser();

	//const detectedLanguage = navigator.language.split("-")[0] || "en";

	useEffect(() => {
		if (!isLoaded && !isSignedIn) {
			return;
		}

		const langOptionsData = [
			{
				lang_name: "English",
				lang_code: "eng",
			},
			{
				lang_name: "Spanish",
				lang_code: "spa",
			},
			{
				lang_name: "French",
				lang_code: "fre",
			},
			{
				lang_name: "Japanese",
				lang_code: "jpn",
			},
			{
				lang_name: "Italian",
				lang_code: "ita",
			},
		];

		setLangOptions(langOptionsData);
	}, [isLoaded, isSignedIn]);

	const langSetHandler = async () => {
		try {
			const token = await getToken();
			if (!token) {
				return;
			}

			const response = await axios.post(
				"/api/user/language",
				{
					lang_code: value,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			console.log(response.status);
			console.log(response.data);
			console.log(user);
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
			<div className="lang-set-window">
				<Stack className="lang-modal-header">
					<Group wrap="nowrap" justify="space-between">
						<Group>
							<Text className="lang-modal-title">Welcome!</Text>
							<div className="lang-modal-emoji">👋</div>
						</Group>
						<CloseButton size="xl" className="lang-modal-exit" />
					</Group>
					<Text>
						To get started, please set your preferred language so we can tailor
						your experience.
					</Text>
				</Stack>
				<Radio.Group
					value={value}
					onChange={setValue}
					label="Languages supported:"
					description="Messages you receive will be translated to this language."
				>
					<SimpleGrid
						cols={{ base: 2, sm: 3, lg: 3 }}
						className="lang-options-grid"
					>
						{langOptions &&
							langOptions.map((langOption) => (
								<Radio.Card
									className="lang-radio-item"
									radius="md"
									value={langOption.lang_code}
									key={langOption.lang_code}
								>
									<Group wrap="nowrap">
										<Radio.Indicator />
										<Text className="lang-radio-text">
											{langOption.lang_name}
										</Text>
									</Group>
								</Radio.Card>
							))}
					</SimpleGrid>
				</Radio.Group>
				<Group>
					<Button
						fullWidth
						rightSection={<FaArrowRight size={15} />}
						onClick={langSetHandler}
						disabled={!value ? true : false}
						className="lang-set-submit"
					>
						Start Chatting!
					</Button>
				</Group>
			</div>
		</>
	);
};
