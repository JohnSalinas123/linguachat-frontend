import { Container, Text } from "@mantine/core";

import { Message } from "../../types/Message";

import "./MessageBubble.css";

export const MessageBubble = ({ message }: { message: Message }) => {
	return (
		<>
			<Container
				className={`message-bubble-outer ${
					message.isUser ? "users-align" : "others-align"
				}`}
			>
				<Text
					className={`message-info ${
						message.isUser ? "message-info-user" : "message-info-other"
					}`}
				>
					{message.name}
				</Text>
				<Container
					pt="4px"
					pb="4px"
					pl="10px"
					pr="10px"
					className={`message-bubble ${
						message.isUser ? "users-message" : "others-message"
					}`}
				>
					<Text size="md">{message.text}</Text>
				</Container>
				<Text
					className={`message-info ${
						message.isUser ? "message-info-user" : "message-info-other"
					}`}
				>
					{message.timestamp}
				</Text>
			</Container>
		</>
	);
};
