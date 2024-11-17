import { SignIn } from "@clerk/clerk-react";
import { Center } from "@mantine/core";

export default function SignInPage() {
	return (
		<>
			<Center className="page">
				<SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
			</Center>
		</>
	);
}
