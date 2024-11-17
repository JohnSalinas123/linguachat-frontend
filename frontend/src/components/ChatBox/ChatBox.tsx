import { Stack } from "@mantine/core";
import { MessageBubble } from "../MessageBubble/MessageBubble";

import { Messages, Message } from "../../types/Message";

import "./ChatBox.css";

export const ChatBox = ({ messages }: { messages: Messages }) => {
	return (
		<>
			<Stack className="chat-box-messages">
				{messages &&
					messages.messages.map((message: Message, index: number) => (
						<MessageBubble key={index} message={message} />
					))}
			</Stack>
		</>
	);
};
