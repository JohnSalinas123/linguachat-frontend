import { useAuth } from "@clerk/clerk-react";
import { Button } from "@mantine/core";
import { Link } from "react-router-dom";

import { IoChatboxEllipsesOutline } from "react-icons/io5";

import "./ChatNavButton.css";

export const ChatNavButton = () => {
	const { userId, isLoaded } = useAuth();

	return (
		<Link to="/chat">
			<Button
				className="chat-nav-button"
				variant="light"
				radius="lg"
				rightSection={<IoChatboxEllipsesOutline />}
				disabled={!isLoaded || !userId}
			>
				Chat
			</Button>
		</Link>
	);
};
