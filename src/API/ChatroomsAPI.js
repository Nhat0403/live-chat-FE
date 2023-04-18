import axiosClient from './axiosClient';

const ChatroomsAPI = {
	getMessageByRoomId: (roomId) => {
		const url = `/chatrooms/getById?roomId=${roomId}`;
		return axiosClient.get(url);
	},

	createNewRoom: (query) => {
		const url = `/chatrooms/createNewRoom${query}`;
		return axiosClient.post(url);
	},

	addMessage: (query) => {
		const url = `/chatrooms/addMessage${query}`;
		return axiosClient.put(url);
	},

	searchMessage: (query) => {
		const url = `/chatrooms/searchMessage${query}`;
		return axiosClient.post(url);
	},

	getAllChatrooms: () => {
		const url = `/chatrooms/getAllChatrooms`;
		return axiosClient.get(url);
	},

	getChatroomById: (query) => {
		const url = `/chatrooms/getChatroomById${query}`;
		return axiosClient.get(url);
	}
};

export default ChatroomsAPI;
