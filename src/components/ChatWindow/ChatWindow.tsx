import { Center, Container, Stack } from "@mantine/core";
import { ChatInput } from "../ChatInput/ChatInput";
import "./ChatWindow.css";
import { Messages, Message } from "../../types/Message";
import { MessageBubble } from "../MessageBubble/MessageBubble";
import { useUser } from "@clerk/clerk-react";

export const ChatWindow = ({ messages }: { messages: Messages }) => {
	const { user } = useUser();
	console.log(messages);

	return (
		<>
			<Container mx={0} p={2} className="chat-container lg-border">
				<div className="chat-window">
					<div className="fill-space chat-box-frame">
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
					</div>
					<ChatInput />
				</div>
			</Container>
		</>
	);
};

const ChatBoxEmpty = () => {
	return (
		<Center className="fill-space">
			<p className="lg-text">No messages</p>
		</Center>
	);
};