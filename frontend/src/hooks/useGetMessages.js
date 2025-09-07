import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useGetMessages = () => {
	const [loading, setLoading] = useState(false);
	const { messages, setMessages, selectedConversation } = useConversation();

	useEffect(() => {
		const getMessages = async () => {
			setLoading(true);
			try {
				const res = await fetch(`/api/messages/${selectedConversation._id}`);
				const data = await res.json();
				if (data.error) throw new Error(data.error);

				console.log("API response:", data);
				console.log("Is data an array?", Array.isArray(data));
				
					if (Array.isArray(data)) {
					setMessages(data); // If API returns array directly
				} else if (data.messages && Array.isArray(data.messages)) {
					setMessages(data.messages); // If API returns {messages: [...]}
				} else {
					console.error("API returned non-array data:", data);
					setMessages([]); // Fallback to empty array
				}
			} catch (error) {
				console.error("Error fetching messages:", error);
				setMessages([]);
				toast.error(error.message);
			} finally {
				setLoading(false);
			}
		};

		if (selectedConversation?._id) getMessages();
	}, [selectedConversation?._id, setMessages]);

	return { messages, loading };
};
export default useGetMessages;
