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
import { Messages } from "../types/Message";
import { useDisclosure } from "@mantine/hooks";

export const ChatPage = () => {
	const { getToken, isLoaded, isSignedIn } = useAuth();
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [chats, setChats] = useState<Chats | null>(null);
	const [messages, setMessages] = useState<Messages | null>(null);
	const [selectedChat, setSelectedChat] = useState<string | null>(null);
	const [messagesPage, setMessagesPage] = useState<number>(0);

	// side panel states
	const [leftOpened, { open: openChatList, close: closeChatList }] =
		useDisclosure(false);
	const [rightOpened, { open: openRight, close: closeRight }] =
		useDisclosure(false);

	// TODO: change once implement user details/settings, incoporate into
	// fetchUserSettings

	const { user } = useUser();

	useEffect(() => {
		if (!isLoaded && !isSignedIn) {
			return;
		}

		if (user?.publicMetadata.lang_code) {
			// fetch user chats
			fetchUserChats();
			setMessagesPage(0);
		}
	}, [isLoaded, isSignedIn, user, user?.publicMetadata.lang_code]);

	useEffect(() => {
		if (selectedChat) {
			fetchChatMessages();
		}
	}, [selectedChat, messagesPage]);

	// fetchUserChats calls api for user chats
	const fetchUserChats = async () => {
		try {
			const token = await getToken({ leewayInSeconds: 55 });
			if (!token) {
				return;
			}
			const response = await axios.get("/api/chats", {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setChats(response.data);
			console.log(response);
			console.log(response.data);
		} catch (error) {
			if (axios.isAxiosError(error)) {
				console.log(error.status);
				console.error(error.response);
			} else {
				console.log(error);
			}
		}
	};

	const fetchChatMessages = async () => {
		try {
			const token = await getToken({ leewayInSeconds: 55 });
			if (!token) {
				return;
			}
			const response = await axios.get(
				`/api/chats/${selectedChat}/messages?pageNum=${messagesPage}&langCode=${user?.publicMetadata.lang_code}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			setMessages(response.data);
			console.log(response);
			console.log(response.data);
		} catch (error) {
			if (axios.isAxiosError(error)) {
				console.log(error.status);
				console.error(error.response);
			} else {
				console.log(error);
			}
		}
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
					title="Chats"
					offset={20}
					radius="md"
				>
					<ChatList
						chats={chats}
						selectedChat={selectedChat}
						setSelectedChat={setSelectedChat}
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
				<div className="chat-list chat-sp lg-border left-panel-border">
					<ChatList
						chats={chats}
						selectedChat={selectedChat}
						setSelectedChat={setSelectedChat}
					/>
				</div>
				<ChatWindow
					messages={messages}
					openChatList={openChatList}
					openRight={openRight}
				/>
				<Container
					mx={0}
					className="right-panel chat-sp lg-border right-panel-border"
				></Container>
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
			const token = await getToken({ leewayInSeconds: 55 });
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
