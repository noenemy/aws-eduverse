export const randomInt = (low, high) => {
	return Math.floor(Math.random() * (high - low) + low);
}

export const getTtlSeconds = (ss) => {
	const current = parseInt(new Date().getTime()/1000);
	return (current + ss);
}

export const LOBBY_SCALE = 2;

export const PLAYER_SCALE = 2;

export const START_POINT = {x: 470, y: 300};