import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./layouts/RootLayout.tsx";
import LandingPage from "./pages/LandingPage.tsx";
import SignInPage from "./pages/SignInPage.tsx";
import SignUpPage from "./pages/SignUpPage.tsx";
import ChatLayout from "./layouts/ChatLayout.tsx";
import { ChatPage } from "./pages/ChatPage.tsx";
import { MantineProvider } from "@mantine/core";

import "@mantine/core/styles.css";

const router = createBrowserRouter([
	{
		element: <RootLayout />,
		children: [
			{ path: "/", element: <LandingPage /> },
			{ path: "/sign-in/*", element: <SignInPage /> },
			{ path: "/sign-up/*", element: <SignUpPage /> },
			{
				element: <ChatLayout />,
				path: "chat",
				children: [{ path: "/chat", element: <ChatPage /> }],
			},
		],
	},
]);

createRoot(document.getElementById("root")!).render(
	<MantineProvider>
		<RouterProvider router={router} />
	</MantineProvider>
);
