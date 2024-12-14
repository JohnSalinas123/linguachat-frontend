import * as React from "react";
import { useAuth } from "@clerk/clerk-react";
import { Outlet, useNavigate, useOutletContext } from "react-router-dom";

export default function ChatLayout() {
	const { userId, isLoaded } = useAuth();
	const navigate = useNavigate();

	const [disabled, toggleDisabled] =
		useOutletContext<[boolean, (value?: boolean) => void]>();

	React.useEffect(() => {
		if (isLoaded && !userId) {
			navigate("/sign-in");
		}
	}, [isLoaded, navigate, userId]);

	if (!isLoaded) return "Loading...";

	return userId ? (
		<div className={`page ${disabled ? "page-full" : "page-nav"}`}>
			<Outlet context={[toggleDisabled]} />
		</div>
	) : null;
}
