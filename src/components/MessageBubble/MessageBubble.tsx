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
	const convertLastMessageTime = (dataWithTimeZone: string) => {
		const date = new Date(dataWithTimeZone);

		const hours = date.getHours();
		const minutes = date.getMinutes();
		const timeIdentifier = hours >= 12 ? "PM" : "AM";

		return `${hours}:${minutes} ${timeIdentifier} ${date.getMonth()}/${date.getDate()}/${
			date.getFullYear() % 100
		}`;
	};

	return (
		<>
			<div
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
					{message.sender_username}
				</Text>
				<div
					className={`msg-outer ${
						message.sender_id == userId ? "users-msg-outer" : "others-msg-outer"
					}`}
				>
					<Container
						pt="4px"
						pb="4px"
						pl="10px"
						pr="10px"
						className={`message-bubble ${
							message.sender_id == userId ? "users-message" : "others-message"
						}`}
					>
						<Text className="message-content" size="md">
							{message.content}
						</Text>
					</Container>
				</div>
				<Text
					className={`message-info ${
						message.sender_id == userId
							? "message-info-user"
							: "message-info-other"
					}`}
				>
					{convertLastMessageTime(message.created_at)}
				</Text>
			</div>
		</>
	);
};
