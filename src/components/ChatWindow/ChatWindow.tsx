import { ActionIcon, Button, Center, Container, Group, Stack, TextInput } from "@mantine/core";
import "./ChatWindow.css";
import { Messages, Message } from "../../types/Message";
import { MessageBubble } from "../MessageBubble/MessageBubble";
import { useUser } from "@clerk/clerk-react";

import { LuMessageCircle } from "react-icons/lu";
import { LuSettings } from "react-icons/lu";
import { useEffect, useRef } from "react";
import { IoSend } from "react-icons/io5";
import { useField } from "@mantine/form";

interface ChatWindowProps {
	messages: Messages;
	openChatList: () => void;
	openRight: () => void;
}

export const ChatWindow = ({
	messages,
	openChatList,
	openRight,
}: ChatWindowProps) => {
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

	return (
		<>
			<Container mx={0} p={0} className="chat-container lg-border">
				<div className="chat-window-header">
					<ActionIcon
						variant="light"
						size="lg"
						radius="md"
						aria-label="Settings"
						onClick={openChatList}
					>
						<LuMessageCircle
							style={{ width: "70%", height: "70%" }}
							className="chat-menu-icons"
						/>
					</ActionIcon>
					<ActionIcon
						variant="light"
						size="lg"
						radius="md"
						aria-label="Settings"
						onClick={openRight}
					>
						<LuSettings
							style={{ width: "70%", height: "70%" }}
							className="chat-menu-icons"
						/>
					</ActionIcon>
				</div>
				{messages && messages.length != 0 ? (
					<Stack className="chat-box-messages">
						{messages &&
							messages.map((message: Message, index: number) => (
								<MessageBubble
									key={index}
									message={message}
									userId={user?.id}
								/>
							))}
						<div ref={messagesEndRef} />
					</Stack>
				) : (
					<ChatBoxEmpty />
				)}
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

					<Button variant="light" color="blue" radius="sm">
						<Center>
							<IoSend />
						</Center>
					</Button>
				</Group>
			</Container>
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
