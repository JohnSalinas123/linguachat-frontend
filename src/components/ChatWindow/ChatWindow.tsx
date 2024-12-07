import { ActionIcon, Center, Container, Stack } from "@mantine/core";
import { ChatInput } from "../ChatInput/ChatInput";
import "./ChatWindow.css";
import { Messages, Message } from "../../types/Message";
import { MessageBubble } from "../MessageBubble/MessageBubble";
import { useUser } from "@clerk/clerk-react";

import { LuMessageCircle } from "react-icons/lu";
import { LuSettings } from "react-icons/lu";

export const ChatWindow = ({ messages }: { messages: Messages }) => {
	const { user } = useUser();
	console.log(messages);

	return (
		<>
			<Container mx={0} p={0} className="chat-container lg-border">
				<div className="chat-window-header">
					<ActionIcon
						variant="outline"
						size="lg"
						radius="md"
						aria-label="Settings"
					>
						<LuMessageCircle
							style={{ width: "70%", height: "70%" }}
							className="chat-menu-icons"
						/>
					</ActionIcon>
					<ActionIcon
						variant="outline"
						size="lg"
						radius="md"
						aria-label="Settings"
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
					</Stack>
				) : (
					<ChatBoxEmpty />
				)}

				<ChatInput />
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
