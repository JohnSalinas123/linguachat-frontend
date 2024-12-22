import { useAuth, useUser } from "@clerk/clerk-react";
import { Button, CloseButton, Group, Radio, SimpleGrid, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";

interface LangOptions {
	lang_name: string;
	lang_code: string;
}

export const LanguageSetWindow = () => {
	const { getToken, isLoaded, isSignedIn } = useAuth();
	const [value, setValue] = useState<string | null>(null);
	const [langOptions, setLangOptions] = useState<LangOptions[]>();
	const { user } = useUser();

    // submit button state
    const [loading, { toggle }] = useDisclosure();

	//const detectedLanguage = navigator.language.split("-")[0] || "en";

	useEffect(() => {
		if (!isLoaded && !isSignedIn) {
			return;
		}

		const langOptionsData = [
			{
				lang_name: "English",
				lang_code: "eng",
			},
			{
				lang_name: "Spanish",
				lang_code: "spa",
			},
			{
				lang_name: "French",
				lang_code: "fre",
			},
		];

		setLangOptions(langOptionsData);
	}, [isLoaded, isSignedIn]);

    // langSetHandler handlers user click on submit button to set their language
	const langSetHandler = async () => {
        // toggle button to loading
        toggle()

		try {
			const token = await getToken();
			if (!token) {
				return;
			}

			const response = await axios.post(
				"/api/user/language",
				{
					lang_code: value,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			console.log(response.status);
			console.log(response.data);
			console.log(user);
		} catch (error) {
			if (axios.isAxiosError(error)) {
				console.log(error.status);
				console.error(error.response);
			} else {
				console.log(error);
			}
		}
	};

	return (
		<>
			<div className="lang-set-window">
				<Stack className="lang-modal-header">
					<Group wrap="nowrap" justify="space-between">
						<Group>
							<Text className="lang-modal-title">Welcome!</Text>
							<div className="lang-modal-emoji">👋</div>
						</Group>
						<CloseButton size="xl" className="lang-modal-exit" />
					</Group>
					<Text>
						To get started, please set your preferred language so we can tailor
						your experience.
					</Text>
				</Stack>
				<Radio.Group
					value={value}
					onChange={setValue}
					label="Languages supported:"
					description="Messages you receive will be translated to this language."
				>
					<SimpleGrid
						cols={{ base: 2, sm: 3, lg: 3 }}
						className="lang-options-grid"
					>
						{langOptions &&
							langOptions.map((langOption) => (
								<Radio.Card
									className="lang-radio-item"
									radius="md"
									value={langOption.lang_code}
									key={langOption.lang_code}
								>
									<Group wrap="nowrap">
										<Radio.Indicator />
										<Text className="lang-radio-text">
											{langOption.lang_name}
										</Text>
									</Group>
								</Radio.Card>
							))}
					</SimpleGrid>
				</Radio.Group>
				<Group>
					<Button
						fullWidth
						rightSection={<FaArrowRight size={15} />}
						onClick={langSetHandler}
                        loading={loading}
						disabled={!value ? true : false}
						className="lang-set-submit"
					>
						Start Chatting!
					</Button>
				</Group>
			</div>
		</>
	);
};