import { Container, Stack } from "@mantine/core";
import { ChatBox } from "../ChatBox/ChatBox";
import { ChatInput } from "../ChatInput/ChatInput";
import "./ChatWindow.css";
import { Messages } from "../../types/Message";

const messages: Messages = {
	messages: [
		{
			text: "Hi its me john, from earlier today during the club meeting",
			isUser: true,
		},
		{
			text: "Hey man, wanna work on that kaggle competition about classifying hotdog types?",
			isUser: false,
		},
		{
			text: "Yeah sure thats a legendary project, looking forward to it!",
			isUser: true,
		},
		{
			text: "Alright great, what would be a good time for you?",
			isUser: false,
		},
		{
			text: "I think that friday,sat, or sun around 6 or 7 would be good for me.",
			isUser: true,
		},
		{
			text: "Saturday around 6 or 7 works for me.",
			isUser: false,
		},
		{
			text: "Great where do you want to meet?",
			isUser: true,
		},
		{
			text: "I think the library on Sepulveda would work well, what do you think?",
			isUser: false,
		},
	],
};

export const ChatWindow = () => {
	return (
		<>
			<Container p={2} fluid className="chat-container">
				<Stack className="chat-window">
					<ChatBox messages={messages} />
					<ChatInput />
				</Stack>
			</Container>
		</>
	);
};
