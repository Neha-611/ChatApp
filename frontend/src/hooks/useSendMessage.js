import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";
import { useSocketContext } from "../context/SocketContext";

const useSendMessage = () => {
	const [loading, setLoading] = useState(false);
	const { messages, setMessages, selectedConversation } = useConversation();
	const { socket } = useSocketContext();

	const sendMessage = async (message) => {
		console.log("=== SENDING MESSAGE ===");
		console.log("Current messages before send:", messages);
		console.log("Is messages array?", Array.isArray(messages));
		
		setLoading(true);
		try {
			const res = await fetch(`/api/messages/send/${selectedConversation._id}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ message }),
			});
			const data = await res.json();
			if (data.error) throw new Error(data.error);

			console.log("Message saved to DB:", data);
			
			// Safety check before updating messages
			if (!Array.isArray(messages)) {
				console.error("Messages is not an array before updating!");
				setMessages([data]);
			} else {
				setMessages([...messages, data]);
			}

			// Emit via socket
			if (socket) {
				console.log("Emitting message via socket:", data);
				socket.emit("sendMessage", {
					receiverId: selectedConversation._id,
					message: message,
					senderId: data.senderId,
					messageData: data
				});
			}

		} catch (error) {
			console.error("Error in sendMessage:", error);
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return { sendMessage, loading };
};
export default useSendMessage;
