const initialState = {
	userId: '',
	token: '',
};

const ReducerSession = (state = initialState, action) => {
	switch (action.type) {
		case 'ADD_SESSION':
			console.log('userId: ', action.data.userId);
			console.log('token: ', action.data.token);

			state = {
				userId: action.data.userId,
				token: action.data.token
			}
			return state;

		case 'DELETE_SESSION':
			console.log('userId: ', action.data);

			state = {
				userId: '',
				token: ''
			}
			return state;

		default:
			return state;
	}
};

export default ReducerSession;
