import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
	ClerkProvider,
	SignedIn,
	SignedOut,
	UserButton,
} from "@clerk/clerk-react";

import { ChatNavButton } from "../components/ChatNavButton/ChatNavButton";
import { AppShell, Burger, Group, UnstyledButton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { GrLanguage } from "react-icons/gr";

import "./RootLayout.css";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
	throw new Error("Missing Publishable Key");
}

export default function RootLayout() {
	const navigate = useNavigate();
	const [opened, { toggle }] = useDisclosure();
	const location = useLocation();

	const isAtLandingPage = location.pathname === "/";

	return (
		<ClerkProvider
			routerPush={(to) => navigate(to)}
			routerReplace={(to) => navigate(to, { replace: true })}
			publishableKey={PUBLISHABLE_KEY}
		>
			<AppShell
				header={{ height: { base: 48, sm: 60 } }}
				navbar={{
					width: 300,
					breakpoint: "sm",
					collapsed: { desktop: true, mobile: !opened },
				}}
				padding={0}
			>
				<AppShell.Header>
					<Group h="100%" px="md">
						<Burger
							opened={opened}
							onClick={toggle}
							hiddenFrom="sm"
							size="sm"
						/>
						<Group justify="space-between" style={{ flex: 1 }}>
							<Link className="app-home-link" to="/">
								<Group>
									<GrLanguage className="app-logo" />
									<h1 className="app-title">LinguaChat</h1>
								</Group>
							</Link>
							<Group ml="xl" gap={50} visibleFrom="sm">
								<UnstyledButton>Home</UnstyledButton>
								<UnstyledButton>About</UnstyledButton>
								<UnstyledButton>Support</UnstyledButton>
								{isAtLandingPage && <ChatNavButton />}
								<div>
									<SignedIn>
										<UserButton showName={true} />
									</SignedIn>
									<SignedOut>
										<Link className="app-sign-in" to="/sign-in">
											Sign In
										</Link>
									</SignedOut>
								</div>
							</Group>
						</Group>
					</Group>
				</AppShell.Header>

				<AppShell.Navbar py="md" px={4}>
					<UnstyledButton>Home</UnstyledButton>
					<UnstyledButton>About</UnstyledButton>
					<UnstyledButton>Support</UnstyledButton>
					{isAtLandingPage && <ChatNavButton />}
					<div>
						<SignedIn>
							<UserButton showName={true} />
						</SignedIn>
						<SignedOut>
							<Link className="app-sign-in" to="/sign-in">
								Sign In
							</Link>
						</SignedOut>
					</div>
				</AppShell.Navbar>

				<AppShell.Main>
					<Outlet />
				</AppShell.Main>
			</AppShell>
		</ClerkProvider>
	);
}
