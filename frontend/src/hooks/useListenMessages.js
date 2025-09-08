import { useEffect } from "react";

import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";

import notificationSound from "../assets/sounds/notification.mp3";

const useListenMessages = () => {
	const { socket } = useSocketContext();
	const { setMessages } = useConversation(); // Remove messages from destructuring

	useEffect(() => {
		const handleNewMessage = (newMessage) => {
			console.log("New message received:", newMessage);
			newMessage.shouldShake = true;
			
			const sound = new Audio(notificationSound);
			sound.play();
			
			// Use functional update - this gets the latest messages automatically
			setMessages((prevMessages) => {
				console.log("PrevMessages in functional update:", prevMessages);
				console.log("Is prevMessages array?", Array.isArray(prevMessages));
				
				// Ensure it's always an array
				const safeMessages = Array.isArray(prevMessages) ? prevMessages : [];
				return [...safeMessages, newMessage];
			});
		};

		socket?.on("newMessage", handleNewMessage);

		return () => socket?.off("newMessage", handleNewMessage);
	}, [socket, setMessages]); // REMOVED 'messages' from dependencies - this was causing the issue
};

export default useListenMessages;
