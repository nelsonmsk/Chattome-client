
export const loggingMiddleware = (store) => (next) => (action) => {
	
	// Our middleware
	console.log(`Working App Log:`, action)
	
	// call the next function
	next(action);
}

export default loggingMiddleware;