export const randomInt = (low, high) => {
	return Math.floor(Math.random() * (high - low) + low);
}

export const getTtlSeconds = (ss) => {
	const current = parseInt(new Date().getTime()/1000);
	return (current + ss);
}

export const LOBBY_SCALE = 1;
export const PLAYER_SCALE = 1;
// export const FONT_SCALE =


export const START_POINT = {x: 470, y: 300};

export const NPC_CONFIG = [
	{ name: 'carry', x: 380, y: 180, start: 0, end: 31, duration: 2000 },
	{ name: 'jump', x: 200, y: 50, start: 0, end: 19, duration: 2000 },
	{ name: 'hoe', x: 210, y: 280, start: 0, end: 19, duration: 2000 },
	{ name: 'witch', x: 490, y: 300, start: 0, end: 31, duration: 2000 },
	{ name: 'sword', x: 500, y: 60, start: 0, end: 15, duration: 2000 },
]