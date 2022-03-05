export const randomInt = (low, high) => {
	return Math.floor(Math.random() * (high - low) + low);
}

export const getTtlSeconds = (ss) => {
	const current = parseInt(new Date().getTime()/1000);
	return (current + ss);
}

export const ZOOM_SCALE = 2;

export const LOBBY_SCALE = 1;
export const PLAYER_SCALE = 1;

export const START_POINT = {x: 200, y: 100};

export const NPC_CONFIG = [
	{ name: 'carry', x: 380, y: 180, start: 0, end: 31, duration: 2000 },
	{ name: 'jump', x: 200, y: 50, start: 0, end: 19, duration: 2000 },
	{ name: 'hoe', x: 210, y: 280, start: 0, end: 19, duration: 2000 },
	{ name: 'witch', x: 490, y: 300, start: 0, end: 19, duration: 2000 },
	{ name: 'sword', x: 500, y: 60, start: 0, end: 15, duration: 2000 },
];


export const BOTTOM_SPEECH_POSITION = {
	x: 400,
	y: 360,
	scale: 4
}

export const STUFF_TO_SAY = {
	carry: [	//초록머리 웰컴봇
		"Lorem ipsum dolor sit amet, consectetur {adipiscing elit}, sed do eiusmod tempor incididunt ut {labore} et dolore magna aliqua. ",
		"Ut enim ad minim {veniam}, quis nostrud exercitation ullamco.",
	],
	jump: [	//대강당 NPC

	],
	hoe: [ //VR 학습터 NPC

	],
	witch: [ //라운지 NPC

	],
	sword: [	// 강의실 NPC

	]
}