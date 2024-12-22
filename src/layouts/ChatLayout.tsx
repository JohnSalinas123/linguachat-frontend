import { useAuth, useUser } from "@clerk/clerk-react";
import { Outlet, useNavigate, useOutletContext } from "react-router-dom";
import { useEffect } from "react";
import { LanguageSetWindow } from "../components/LangSetWindow/LangSetWindow";

export default function ChatLayout() {
	const { userId, isLoaded } = useAuth();
	const { user } = useUser();
	const navigate = useNavigate();

	const [disabled, toggleDisabled] =
		useOutletContext<[boolean, (value?: boolean) => void]>();

	useEffect(() => {
		if (isLoaded && !userId) {
			// fix redirect to invite
			const currentUrl = window.location.pathname + window.location.search;
			navigate(`/sign-in?redirect_url=${encodeURIComponent(currentUrl)}`);
		}
	}, [isLoaded, navigate, userId]);

	if (!isLoaded) return "Loading...";

	// render modal welcoming user, asking for them to choose a language before
	// starting to use chat
	if (!user?.publicMetadata.lang_code) return <LanguageSetWindow />;

	return userId ? (
		<div className={`page ${disabled ? "page-full" : "page-nav"}`}>
			<Outlet context={[toggleDisabled]} />
		</div>
	) : null;
}
