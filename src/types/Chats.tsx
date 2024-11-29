export type Chats = Chat[];

export type Chat = {
	chatId: string;
	participants: string[];
	last_message: string | null;
	last_message_time: string | null;
};
