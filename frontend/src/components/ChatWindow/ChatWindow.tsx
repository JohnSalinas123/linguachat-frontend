import { Container, Stack } from "@mantine/core";
import { ChatBox } from "../ChatBox/ChatBox";
import { ChatInput } from "../ChatInput/ChatInput";
import "./ChatWindow.css";
import { Messages } from "../../types/Message";

const messages: Messages = {
	messages: [
		{
			text: "Saturday around 6 or 7 works for me.",
			isUser: false,
		},
		{
			text: "I think that friday,sat, or sun around 6 or 7 would be good for me.",
			isUser: true,
		},
		{
			text: "Alright great, what would be a good time for you?",
			isUser: false,
		},
		{
			text: "Yeah sure thats a legendary project, looking forward to it!",
			isUser: true,
		},
		{
			text: "Hey man, wanna work on that kaggle competition about classifying hotdog types?",
			isUser: false,
		},
		{
			text: "Hi its me john, from earlier today during the club meeting",
			isUser: true,
		},
	],
};

export const ChatWindow = () => {
	return (
		<>
			<Container p={2} fluid className="chat-container">
				<Stack justify="flex-end" style={{ height: "100%" }}>
					<ChatBox messages={messages} />
					<ChatInput />
				</Stack>
			</Container>
		</>
	);
};
