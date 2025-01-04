import { DemoChat } from "./DemoChat";

import { Group } from "@mantine/core";

import "./LandingPage.css";
import { useEffect, useRef, useState } from "react";

export type DemoMessage = {
	username: string;
	user_id: number;
	lang1: string;
	lang2: string;
	created_at: string;
};

const messages = [
	{
		username: "Alice",
		user_id: 1,
		lang1: "Hello!",
		lang2: "¡Hola!",
		created_at: "2024-12-10T12:00:00.000000-08:00",
	},
	{
		username: "Bob",
		user_id: 2,
		lang1: "Hi! How are you?",
		lang2: "¡Hola! ¿Cómo estás?",
		created_at: "2024-12-10T12:02:00.000000-08:00",
	},
	{
		username: "Alice",
		user_id: 1,
		lang1: "I'm good, thanks! You?",
		lang2: "¡Estoy bien, gracias! ¿Tú?",
		created_at: "2024-12-22T10:04:00Z",
	},
	{
		username: "Bob",
		user_id: 2,
		lang1: "Doing great, thank you!",
		lang2: "Me va muy bien, ¡gracias!",
		created_at: "2024-12-22T10:06:00Z",
	},
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function LandingPage() {
	const [user1Messages, setUser1Messages] = useState<DemoMessage[]>([]);
	const [user2Messages, setUser2Messages] = useState<DemoMessage[]>([]);

	const [user1Typing, setUser1Typing] = useState("");
	const [user2Typing, setUser2Typing] = useState("");

	const [demoReset, setDemoReset] = useState<boolean>(false);

	useEffect(() => {
		const startDemoChat = async () => {
			setUser1Messages([]);
			setUser2Messages([]);
			setUser1Typing("");
			setUser2Typing("");

			let messageIndex = 0;

			while (messageIndex < messages.length) {
				const message = messages[messageIndex];
				const messageContent =
					message.user_id === 1 ? message.lang1 : message.lang2;

				let charIndex = 0;

				// Simulate typing by adding one character at a time
				while (charIndex < messageContent.length) {
					const currentChar = messageContent[charIndex];

					// Update the typing text based on the user
					if (message.user_id === 1) {
						setUser1Typing((prev) => prev + currentChar);
					} else {
						setUser2Typing((prev) => prev + currentChar);
					}

					charIndex++;
					await delay(150); // Simulate typing delay
				}

				// Add the full message to chat after typing is done
				if (message.user_id === 1) {
					setUser1Messages((prev) => [...prev, message]);
					setUser2Messages((prev) => [...prev, message]);
					setUser1Typing(""); // Clear typing text
				} else {
					setUser2Messages((prev) => [...prev, message]);
					setUser1Messages((prev) => [...prev, message]);
					setUser2Typing(""); // Clear typing text
				}

				messageIndex++;

				// Delay between messages
				await delay(1000); // Delay before next message
			}

			// After all messages are displayed, reset the demo
			setDemoReset(true);
		};

		if (demoReset === false) {
			startDemoChat();
		}

		return () => {
			setDemoReset(false);
			setUser1Messages([]);
			setUser2Messages([]);
			setUser1Typing("");
			setUser2Typing("");
		};
	}, [demoReset]);

	return (
		<>
			<div className="landing-page">
				<div className="headline">
					Connecting and communicating across languages with ease
				</div>
				<div className="sub-headline">
					Simple, fast, and reliable translation to help you connect
				</div>
				<Group gap={50}>
					<DemoChat
						langCode={"ENG"}
						messages={user1Messages}
						userId={1}
						typingText={user1Typing}
					/>
					<DemoChat
						langCode={"SPA"}
						messages={user2Messages}
						userId={2}
						typingText={user2Typing}
					/>
				</Group>
			</div>
		</>
	);
}
