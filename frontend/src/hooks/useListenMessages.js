import { useEffect } from "react";

import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";

import notificationSound from "../assets/sounds/notification.mp3";

const useListenMessages = () => {
	const { socket } = useSocketContext();
	const { messages, setMessages } = useConversation();

	useEffect(() => {
		socket?.on("newMessage", (newMessage) => {
			console.log("=== NEW MESSAGE RECEIVED ===");
			console.log("New message:", newMessage);
			console.log("Current messages:", messages);
			console.log("Current messages type:", typeof messages);
			console.log("Is current messages array?", Array.isArray(messages));
			
			// Safety check before processing
			if (!Array.isArray(messages)) {
				console.error("Current messages is not an array! Resetting to empty array.");
				setMessages([newMessage]);
				return;
			}
			newMessage.shouldShake = true;
			const sound = new Audio(notificationSound);
			sound.play();
			setMessages((prevMessages) =>{
				console.log("Previous messages in setter:", prevMessages);
				console.log("Is prevMessages array?", Array.isArray(prevMessages));
				
				// Double safety check
				const safeMessages = Array.isArray(prevMessages) ? prevMessages : [];
				const newMessagesArray = [...safeMessages, newMessage];
				
				console.log("New messages array:", newMessagesArray);
				return newMessagesArray;
			});
		});

		return () => socket?.off("newMessage");
	}, [socket, setMessages, messages]);
};
export default useListenMessages;
