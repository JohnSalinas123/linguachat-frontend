import { Center, Stack } from "@mantine/core";
import { MessageBubble } from "../MessageBubble/MessageBubble";

import { Messages, Message } from "../../types/Message";

import "./ChatBox.css";

export const ChatBox = ({ messages }: { messages: Messages }) => {
	return (
		<>
			<div className="fill-space chat-box-frame">
				{messages.length != 0 ? (
					<Stack className="chat-box-messages">
						{messages &&
							messages.map((message: Message, index: number) => (
								<MessageBubble key={index} message={message} />
							))}
					</Stack>
				) : (
					<ChatBoxEmpty />
				)}
			</div>
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
