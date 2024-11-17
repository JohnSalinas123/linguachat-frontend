import { SignUp } from "@clerk/clerk-react";
import { Center } from "@mantine/core";

export default function SignUpPage() {
	return (
		<>
			<Center className="page">
				<SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
			</Center>
		</>
	);
}
