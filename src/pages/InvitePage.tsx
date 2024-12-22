import { Button, Group, Text, Modal } from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";
import { FaCheck } from "react-icons/fa6";
import { IoCloseOutline } from "react-icons/io5";

import "./InvitePage.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { useDisclosure } from "@mantine/hooks";

export const InvitePage = () => {
	const { getToken, isLoaded, isSignedIn } = useAuth();

	// invite detail states
	const [inviteValid, setInviteValid] = useState<boolean>();
	const [inviteCodeVal, setInviteCodeVal] = useState<string>("");
	const [inviteCreator, setInviteCreator] = useState<string>("");

	// button states
	const [acceptLoading, { toggle: toggleAcceptLoading }] = useDisclosure();

	// modal
	const [opened, { close }] = useDisclosure(true);

	const { inviteCode } = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		const checkInvite = async () => {
			console.log(inviteCode);
			if (!inviteCode) return;

			try {
				if (!isLoaded || !isSignedIn) return;

				const token = await getToken();
				if (!token || token.length == 0) {
					return;
				}

				const response = await axios.get(`/api/chats/invites/${inviteCode}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				console.log(response);

				if (response.status === 200) {
					const data = response.data;

					setInviteCodeVal(data.invite_code);
					setInviteCreator(data.username);
					setInviteValid(data.invite_exists);
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

		checkInvite();
	}, [inviteCode, getToken, isLoaded, isSignedIn]);

	// handleInviteAccept makes call to accept invite and create a new chat with invite creator
	// then returns user to the chat page
	const handleInviteAccept = async () => {
		if (acceptLoading) return;

		// start button loading
		toggleAcceptLoading();

		try {
			const token = await getToken();
			if (!token || token.length == 0) {
				return;
			}

			// handle call to accept invite
			const response = await axios.post(
				"/api/chats",
				{
					invite_code: inviteCodeVal,
					invite_creator: inviteCreator,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (response.status === 200) {
				console.log(response.data);

				// end button loading
				toggleAcceptLoading();
				navigate("/chat");
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

	// handle user exit from chat invitation process
	// returns the user back to the chat page
	const handleExit = () => {
		close();
		navigate("/chat", { replace: true });
	};

	const handleClose = () => {
		return;
	};

	return (
		<>
			{inviteCreator && inviteCodeVal && inviteValid ? (
				<>
					<Modal.Root opened={opened} onClose={handleClose} centered w={200}>
						<Modal.Overlay backgroundOpacity={0.8} blur={5} color="#b3b6bd" />
						<Modal.Content radius={20}>
							<Modal.Header>
								<Modal.Title>
									<Group justify="center">
										<Text className="inv-header">You're invited to chat! </Text>
										<div className="inv-header-emoji">📬</div>
									</Group>
								</Modal.Title>
							</Modal.Header>
							<Modal.Body>
								<div className="inv-accept-body">
									<Text className="inv-descrip">
										{`If accepted, a new chat will be created with `}{" "}
										<span className="invite-creator">{`${inviteCreator}`}</span>
									</Text>
									<Group>
										<Button
											w={100}
											rightSection={<FaCheck />}
											onClick={handleInviteAccept}
										>
											Accept
										</Button>
										<Button
											w={100}
											rightSection={<IoCloseOutline size={18} />}
											variant="outline"
											onClick={handleExit}
										>
											Exit
										</Button>
									</Group>
								</div>
							</Modal.Body>
						</Modal.Content>
					</Modal.Root>
				</>
			) : null}
		</>
	);
};
