import {
	ActionIcon,
	Button,
	Center,
	Group,
	Stack,
	TextInput,
	Transition,
} from "@mantine/core";
import "./ChatWindow.css";
import { Message } from "../../types/Message";
import { MessageBubble } from "../MessageBubble/MessageBubble";
import { useAuth, useUser } from "@clerk/clerk-react";

import { LuMessageCircle } from "react-icons/lu";
import { LuSettings } from "react-icons/lu";
import { useEffect, useRef, useState } from "react";
import { IoSend } from "react-icons/io5";
import { useField } from "@mantine/form";

import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

interface ChatWindowProps {
	curChatID: string | null;
	messagesLoading: boolean;
	messages: Message[] | null;
	addMessage: (message: Message) => void;
	openChatList: () => void;
	openRight: () => void;
	disableNav: () => void;
	updateLastMessage: (
		chatId: string,
		message: string,
		timestamp: string
	) => void;
}

export const ChatWindow = ({
	curChatID,
	messagesLoading,
	messages,
	addMessage,
	openChatList,
	openRight,
	disableNav,
	updateLastMessage,
}: ChatWindowProps) => {
	const [navDisabled, setNavDisabled] = useState<boolean>(false);

	const { getToken, isLoaded, isSignedIn } = useAuth();
	const { user } = useUser();

	const messagesEndRef = useRef<null | HTMLDivElement>(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	const field = useField({
		initialValue: "",
	});

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const [socket, setSocket] = useState<WebSocket | null>(null);
	//const currentSocketRef = useRef<WebSocket | null>(null);

	useEffect(() => {
		if (!isLoaded || !isSignedIn || !curChatID) return;

		//let isCancelled = false;

		const setupWebSocket = async () => {
			const token = await getToken();
			if (!token) {
				return;
			}

			// Establish WebSocket connection
			const ws = new WebSocket(
				`ws://localhost:8080/ws/${curChatID}?token=${token}`
			);

			setSocket(ws);

			ws.onopen = () => {
				//console.log("WebSocket connected");
			};

			ws.onmessage = (event) => {
				const messageJSON = event.data;
				const message = JSON.parse(messageJSON);

				// new message of type Message
				const newMessage: Message = {
					id: message.id,
					chat_id: message.chat_id,
					sender_username: message.sender_username,
					sender_id: message.sender_id,
					content: message.content,
					created_at: message.created_at,
					lang_code: message.lang_code,
				};

				console.log(newMessage);

				addMessage(newMessage);
				updateLastMessage(
					newMessage.chat_id,
					newMessage.content,
					newMessage.created_at
				);
			};

			ws.onclose = () => {
				//console.log("WebSocket connection closed");
			};
		};

		setupWebSocket();

		return () => {
			socket?.close();
			//isCancelled = true;
			/*
			if (
				currentSocketRef.current &&
				currentSocketRef.current.readyState === WebSocket.OPEN
			) {
				currentSocketRef.current.close();
			}
				*/
		};
	}, [curChatID, isLoaded, isSignedIn]);

	const handleSendMessage = () => {
		//console.log("ATTEMPTING TO SEND SOCKET");
		if (socket && socket.readyState === WebSocket.OPEN) {
			//console.log("SENDING SOCKET");
			const content = field.getValue();

			const messageJSON = {
				sender_username: user?.username,
				sender_id: user?.id,
				content: content,
				lang_code: `{${user?.publicMetadata.lang_code}}`,
			};

			// Send the message over the WebSocket connection
			socket.send(JSON.stringify(messageJSON));

			// Clear the input after sending
			field.setValue("");
		} else {
			console.error("WebSocket is not connected");
		}
	};

	const renderChat = () => {
		if (messages != null && messages.length != 0) {
			return (
				<Stack className="chat-box-messages">
					{messages &&
						messages.map((message: Message, index: number) => (
							<MessageBubble key={index} message={message} userId={user?.id} />
						))}
					<div ref={messagesEndRef} />
				</Stack>
			);
		}

		if (messages != null && messages.length == 0) {
			return <ChatBoxEmpty />;
		}
	};

	const toggleDisableNav = () => {
		disableNav();
		setNavDisabled(!navDisabled);
	};

	return (
		<>
			<div className="chat-container">
				<div className="chat-window-header">
					<Group w={130} justify="left">
						<ActionIcon
							variant="light"
							size="lg"
							radius="md"
							aria-label="Settings"
							onClick={openChatList}
							className="msg-open"
						>
							<LuMessageCircle
								style={{ width: "70%", height: "70%" }}
								className="chat-menu-icons"
							/>
						</ActionIcon>
					</Group>
					<Group>
						<ActionIcon
							variant="light"
							size="lg"
							radius="md"
							aria-label="Settings"
							onClick={toggleDisableNav}
						>
							{navDisabled ? (
								<IoIosArrowDown
									style={{ width: "70%", height: "70%" }}
									className="chat-menu-icons"
								/>
							) : (
								<IoIosArrowUp
									style={{ width: "70%", height: "70%" }}
									className="chat-menu-icons"
								/>
							)}
						</ActionIcon>
					</Group>
					<Group w={130} justify="right">
						<div className="user-lang">{`${(user?.publicMetadata.lang_code as string)?.toUpperCase()}`}</div>
						<ActionIcon
							variant="light"
							size="lg"
							radius="md"
							aria-label="Settings"
							onClick={openRight}
							disabled
						>
							<LuSettings
								style={{ width: "70%", height: "70%" }}
								className="chat-menu-icons"
							/>
						</ActionIcon>
					</Group>
				</div>
				<div className="chat-box-messages">
					<Transition
						mounted={!messagesLoading}
						transition="fade"
						duration={400}
						timingFunction="ease"
					>
						{(styles) => <div style={styles}>{renderChat()}</div>}
					</Transition>
				</div>

				<Group
					className="chat-input-box"
					align="center"
					justify="center"
					p="sm"
					gap="xs"
				>
					<TextInput
						className="chat-input"
						{...field.getInputProps()}
						placeholder="UniMessage"
						radius="sm"
					/>

					<Button
						variant="light"
						color="blue"
						radius="sm"
						onClick={handleSendMessage}
					>
						<Center>
							<IoSend />
						</Center>
					</Button>
				</Group>
			</div>
		</>
	);
};

const ChatBoxEmpty = () => {
	return (
		<Center className="no-messages">
			<p className="lg-text">No messages</p>
		</Center>
	);
};
