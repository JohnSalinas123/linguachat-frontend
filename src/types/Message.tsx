export type Messages = Message[] | null;

export type Message = {
	id: string;
	sender_id: string;
	content: string;
	created_at: string;
	lang_code: string;
};
