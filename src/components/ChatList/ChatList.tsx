import {
	ActionIcon,
	Button,
	Center,
	Container,
	Group,
	Modal,
	Stack,
	Text,
	TextInput,
	Tooltip,
	UnstyledButton,
} from "@mantine/core";
import { Chats } from "../../types/Chats";

import "./ChatList.css";
import axios from "axios";
import { AiOutlineClose } from "react-icons/ai";
import { LuPlus } from "react-icons/lu";
import { useAuth } from "@clerk/clerk-react";
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { RiFileCopyLine } from "react-icons/ri";
import { QRCodeSVG } from "qrcode.react";

axios.defaults.baseURL = "http://localhost:8080";
axios.defaults.withCredentials = true;

interface ChatListProps {
	chats: Chats | null;
	selectedChat: string | null;
	updateSelectedChat: (chatID: string) => void;
	close: (() => void) | null;
}

export const ChatList = ({
	chats,
	selectedChat,
	updateSelectedChat,
	close,
}: ChatListProps) => {
	const { getToken, isLoaded, isSignedIn } = useAuth();
	const [inviteURL, setInviteURL] = useState<string>("");
	const [inviteLoading, setInviteLoading] = useState<boolean>(false);

	// invite modal states
	const [inviteOpened, { open: openInvite, close: closeInvite }] =
		useDisclosure(false);

	const convertLastMessageTime = (dataWithTimeZone: string) => {
		const date = new Date(dataWithTimeZone);

		//const hours = date.getHours();
		//const timeIdentifier = hours >= 12 ? "PM" : "AM";

		return `${date.getMonth()}/${date.getDate()}/${date.getFullYear() % 100}`;
	};

	const renderChats = () => {
		if (chats && chats.length > 0) {
			return (
				<Stack gap={0} className="chat-item-stack">
					{chats &&
						chats.map((chat) => (
							<UnstyledButton
								key={chat.chatId}
								onClick={() => updateSelectedChat(chat.chatId)}
							>
								<Container
									className={`chat-item-box ${
										chat.chatId == selectedChat ? "selected-chat" : ""
									}`}
								>
									<Group justify="space-between">
										<Text className="chat-participants">
											{chat.participants.join(",")}
										</Text>
										<Text className="chat-last-msg-time" c="dimmed">
											{chat.last_message_time &&
												convertLastMessageTime(chat.last_message_time)}
										</Text>
									</Group>
									<Text className="chat-last-msg" c="dimmed" size="sm">
										{chat.last_message}
									</Text>
								</Container>
							</UnstyledButton>
						))}
				</Stack>
			);
		}

		if (chats && chats.length == 0) {
			console.log("No chats found");
			return (
				<Center className="fill-space">
					<p className="lg-text">No chats</p>
				</Center>
			);
		}
	};

	const fetchInviteURL = async () => {
		if (!isLoaded || !isSignedIn) return;

		try {
			const token = await getToken();
			if (!token || token.length === 0) {
				return;
			}

			const response = await axios.post(
				"api/chats/invites",
				{},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (response.status === 200 && response.data != "") {
				return response.data;
			}
		} catch (error) {
			if (axios.isAxiosError(error)) {
				console.log(error.status);
				console.error(error.response);
			} else {
				console.log(error);
			}
		}
	};

	// handleGenChatInvite retrives invite url and displays it as url and qr code
	const handleGenChatInvite = async () => {
		// if invite creation process active return
		if (inviteLoading) return;

		// initialize invite creation process
		setInviteLoading(true);

		const data = await fetchInviteURL();
		const inviteURL = data.invite_url;

		if (inviteURL) {
			setInviteURL(data.invite_url);
			openInvite();
		}
	};

	const timeout = (delay: number) => {
		return new Promise((res) => setTimeout(res, delay));
	};

	// handleInviteModalClose cleans up state and release invite creation process
	const handleInviteModalClose = async () => {
		// close invite modal
		closeInvite();

		await timeout(500);

		// clear inviteURL state
		setInviteURL("");

		// release inviteLoading by setting it to false again
		// allowing for the creation of other invites
		setInviteLoading(false);
	};

	return (
		<>
			<Modal.Root
				opened={inviteOpened}
				onClose={handleInviteModalClose}
				centered
				zIndex={300}
			>
				<Modal.Overlay backgroundOpacity={0.8} blur={5} color="#e9ebf0" />
				<Modal.Content className="invite-modal" radius={20}>
					<Modal.Header>
						<Modal.Title>
							<Text className="invite-title">
								Invite created <div className="invite-emoji">📫</div>
							</Text>
						</Modal.Title>
						<Modal.CloseButton />
					</Modal.Header>
					<Modal.Body>
						<div className="fill-space invite-box">
							<Text>
								Invite someone by copying the invite url or have them scan the
								QR code.
							</Text>
							<div className="invite-text-box">
								<TextInput
									disabled
									value={inviteURL}
									className="invite-text-field"
								/>
								<Tooltip
									label="Copy"
									events={{ hover: true, focus: true, touch: true }}
								>
									<ActionIcon
										className="invite-copy"
										variant="filled"
										aria-label="Settings"
										onClick={async () => {
											await navigator.clipboard.writeText(inviteURL);
										}}
									>
										<RiFileCopyLine style={{ width: "70%", height: "70%" }} />
									</ActionIcon>
								</Tooltip>
							</div>
							<div className="invite-qr-box">
								{inviteURL && <QRCodeSVG value={inviteURL} />}
							</div>
						</div>
					</Modal.Body>
				</Modal.Content>
			</Modal.Root>
			<div className="chat-list-header">
				<Group>
					<Text className="chat-list-header-title">Chats</Text>
					<Button
						onClick={handleGenChatInvite}
						h={30}
						radius="lg"
						rightSection={<LuPlus size={16} />}
					>
						Invite
					</Button>
				</Group>

				{close && (
					<ActionIcon
						onClick={close}
						color="black"
						variant="transparent"
						aria-label="Close chat list"
					>
						<AiOutlineClose
							color="#495057"
							style={{ width: "70%", height: "70%" }}
						/>
					</ActionIcon>
				)}
			</div>
			{renderChats()}
		</>
	);
};
