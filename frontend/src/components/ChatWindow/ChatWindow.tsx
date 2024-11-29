import { Container, Stack } from "@mantine/core";
import { ChatBox } from "../ChatBox/ChatBox";
import { ChatInput } from "../ChatInput/ChatInput";
import "./ChatWindow.css";
import { Messages } from "../../types/Message";

const messages: Messages = [];

export const ChatWindow = () => {
	return (
		<>
			<Container mx={0} p={2} className="chat-container lg-border">
				<Stack className="chat-window">
					<ChatBox messages={messages} />
					<ChatInput />
				</Stack>
			</Container>
		</>
	);
};
