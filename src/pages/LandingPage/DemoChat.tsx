import {
	ActionIcon,
	Button,
	Center,
	Group,
	Stack,
	TextInput,
	Text,
	Container,
} from "@mantine/core";
import { IoSend } from "react-icons/io5";
import { LuMessageCircle, LuSettings } from "react-icons/lu";

import "./DemoChat.css";
import { DemoMessage } from "./LandingPage";

interface DemoChatProps {
	langCode: string;
	messages: DemoMessage[];
	userId: number;
	typingText: string;
}

export const DemoChat = ({ langCode, messages, userId, typingText }: DemoChatProps) => {

	return (
		<>
			<div className="demo-chat-container">
				<div className="chat-window-header">
					<Group w={130} justify="left">
						<ActionIcon
							variant="light"
							size="lg"
							radius="md"
							aria-label="Settings"
							disabled
							className="demo-cursor"
						>
							<LuMessageCircle
								style={{ width: "70%", height: "70%" }}
								className="chat-menu-icons"
							/>
						</ActionIcon>
					</Group>
					<Group></Group>
					<Group w={130} justify="right">
						<div className="user-lang demo-cursor">{langCode}</div>
						<ActionIcon
							variant="light"
							size="lg"
							radius="md"
							aria-label="Settings"
							disabled
							className="demo-cursor"
						>
							<LuSettings
								style={{ width: "70%", height: "70%" }}
								className="chat-menu-icons"
							/>
						</ActionIcon>
					</Group>
				</div>
				<div className="chat-box-messages">
					<Stack className="chat-box-messages">
						{messages &&
							messages.map((message: DemoMessage, index: number) => (
								<DemoMessageBubble
									key={index}
									message={message}
									userId={userId}
								/>
							))}
					</Stack>
				</div>

				<Group
					className="chat-input-box demo-cursor"
					align="center"
					justify="center"
					p="sm"
					gap="xs"
				>
					<TextInput
						className=" demo-cursor demo-chat-input chat-input"
						placeholder="UniMessage"
						radius="sm"
						value={typingText}
						disabled
					/>

					<Button
						variant="light"
						color="blue"
						radius="sm"
						disabled
						className="demo-cursor demo-button"
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

export const DemoMessageBubble = ({
	message,
	userId,
}: {
	message: DemoMessage;
	userId: number;
}) => {
	const convertLastMessageTime = (dataWithTimeZone: string) => {
		const date = new Date(dataWithTimeZone);

		const hours = date.getHours();
		const minutes = date.getMinutes();
		const timeIdentifier = hours >= 12 ? "PM" : "AM";

		return `${hours}:${
			minutes.toString.length == 1 ? "0" : ""
		}${minutes} ${timeIdentifier} ${date.getMonth()}/${date.getDate()}/${
			date.getFullYear() % 100
		}`;
	};

	return (
		<>
			<div
				className={`message-bubble-outer demo-message-bubble demo-cursor ${
					message.user_id == userId ? "users-align" : "others-align"
				}`}
			>
				<Text
					className={`message-info ${
						message.user_id == userId
							? "message-info-user"
							: "message-info-other"
					}`}
				>
					{message.username}
				</Text>
				<div
					className={`msg-outer ${
						message.user_id == userId ? "users-msg-outer" : "others-msg-outer"
					}`}
				>
					<Container
						pt="4px"
						pb="4px"
						pl="10px"
						pr="10px"
						className={`message-bubble ${
							message.user_id == userId ? "users-message" : "others-message"
						}`}
					>
						<Text className="message-content" size="md">
							{userId == 1 ? message.lang1 : message.lang2}
						</Text>
					</Container>
				</div>
				<Text
					className={`message-info ${
						message.user_id == userId
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
