export type Messages = Message[] | [];


export type Message = {
	id: string;
	text: string;
	language: string;
	isUser: boolean;
	name: string;
	timestamp: string;
	status: "sent" | "delivered";
};
