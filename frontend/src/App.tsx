import "@mantine/core/styles.css";

import { AppShell, Burger, Group, MantineProvider } from "@mantine/core";

import { ChatPage } from "./pages/ChatPage";
import { GrLanguage } from "react-icons/gr";

import "./App.css";
import { useDisclosure } from "@mantine/hooks";

export default function App() {
	const [opened, { toggle }] = useDisclosure();

	return (
		<MantineProvider>
			<AppShell
				header={{ height: 60 }}
				footer={{ height: 60 }}
				navbar={{
					width: 300,
					breakpoint: "sm",
					collapsed: { mobile: !opened },
				}}
				aside={{
					width: 300,
					breakpoint: "md",
					collapsed: { desktop: false, mobile: true },
				}}
				padding="md"
			>
				<AppShell.Header>
					<Group h="100%" px="md">
						<Burger
							opened={opened}
							onClick={toggle}
							hiddenFrom="sm"
							size="sm"
						/>
						<GrLanguage className="app-logo" />{" "}
						<h1 className="app-title">LinguaChat</h1>
					</Group>
				</AppShell.Header>
				<AppShell.Navbar p="md">People</AppShell.Navbar>
				<AppShell.Main>
					<ChatPage />
				</AppShell.Main>
				<AppShell.Aside p="md">
					<p>Planned features</p>
					<p>(Under construction)</p>
					<ul>
						<li>Profile of person whom user is chatting with</li>
						<li>Cultural tips for person who user is chatting to</li>
						<li>Translation Customization (tone of translation) </li>
						<li>
							Ability to provide feedback on translation (accuracy/helpful)
						</li>
					</ul>
				</AppShell.Aside>
				<AppShell.Footer p="md">Footer</AppShell.Footer>
			</AppShell>
		</MantineProvider>
	);
}
