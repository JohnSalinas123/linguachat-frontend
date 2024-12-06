import { Button, Center, Group, TextInput } from "@mantine/core";
import { useField } from "@mantine/form";
import { IoSend } from "react-icons/io5";

import "./ChatInput.css";

export const ChatInput = () => {
	const field = useField({
		initialValue: "",
	});

	return (
		<>
			<Group
				className="chat-input-box"
				align="center"
				justify="center"
				p="sm"
				gap="xs"
			>
				<TextInput
					className="chat-input"
					{...field.getInputProps()}
					placeholder="UniMessage"
					radius="sm"
				/>

				<Button variant="light" color="blue" radius="sm">
					<Center>
						<IoSend />
					</Center>
				</Button>
			</Group>
		</>
	);
};
