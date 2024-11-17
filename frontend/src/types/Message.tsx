export type Messages = {
	messages: Message[];
	chatId: string;
	lastMessage: string;
};

export type Message = {
	id: string;
	text: string;
	language: string;
	isUser: boolean;
	name: string;
	timestamp: string;
	status: "sent" | "delivered";
};
