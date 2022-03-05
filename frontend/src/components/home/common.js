import { API, graphqlOperation } from "aws-amplify";
import { updateTutee } from "../../graphql/mutations";

export const randomInt = (low, high) => {
	return Math.floor(Math.random() * (high - low) + low);
}

export const getTtlSeconds = (ss) => {
	const current = parseInt(new Date().getTime()/1000);
	return (current + ss);
}

export const updateTuteeLastVisit = async (id, place) => {
	const res = await API.graphql(graphqlOperation(updateTutee, {
		input: {
			id: id,
			lastVisit: place,
			ttl: getTtlSeconds(7200)
		}
	}))
	return res;
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
		"안녕?나는 초록머리 웰컴봇이다!!\ntempor incididunt ut {labore} et dolore magna aliqua. ",
		"Ut enim ad minim {veniam}, quis nostrud exercitation ullamco.",
	],
	jump: [	//대강당 NPC
		"자자 입학식이 곧 시작됩니다.\n학생들 어서 이리 오세요~~!"
	],
	hoe: [ //VR 학습터 NPC
		"외국어를 배우고 싶으신가요~~ VR학습터에선 언제든! 공부가 가능하지요."
	],
	witch: [ //라운지 NPC
		"라운지에서 쉬어가세요~~ 재밌는 데모들이 있어요~"
	],
	sword: [	// 강의실 NPC
		"이제 수업이 곧 시작됩니다. 어서 강의실로 들어오세요!"
	]
}