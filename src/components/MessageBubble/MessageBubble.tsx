import { Container, Text } from "@mantine/core";

import { Message } from "../../types/Message";

import "./MessageBubble.css";

export const MessageBubble = ({
	message,
	userId,
}: {
	message: Message;
	userId: string | undefined;
}) => {
	return (
		<>
			<Container
				className={`message-bubble-outer ${
					message.sender_id == userId ? "users-align" : "others-align"
				}`}
			>
				<Text
					className={`message-info ${
						message.sender_id == userId
							? "message-info-user"
							: "message-info-other"
					}`}
				>
					{"Name"}
				</Text>
				<Container
					pt="4px"
					pb="4px"
					pl="10px"
					pr="10px"
					className={`message-bubble ${
						message.sender_id == userId ? "users-message" : "others-message"
					}`}
				>
					<Text size="md">{message.content}</Text>
				</Container>
				<Text
					className={`message-info ${
						message.sender_id == userId
							? "message-info-user"
							: "message-info-other"
					}`}
				>
					{message.created_at}
				</Text>
			</Container>
		</>
	);
};
