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
	if(!id) return {};
	const res = await API.graphql(graphqlOperation(updateTutee, {
		input: {
			id: id,
			lastVisit: place,
			ttl: getTtlSeconds(7200)
		}
	}))

	return res;
}

export const WALK_SPRITE_SPLIT = {
	"down": {start: 0, end: 7},
	"up": {start: 8, end: 15},
	"right": {start: 16, end: 23},
	"left": {start: 24, end: 31},
	"idle": {start: 0, end: 7},
}

export const DOOR_CONFIG = {
	"auditorium": { x: 140, y: 35, color: 'blue' },
	"classroom": { x: 670, y: 30, color: 'blue' },
	"vrlearning": { x: 175, y: 240, color: 'blue' },
	"lounge": { x: 550, y: 370, color: 'blue' },
}

export const ZOOM_SCALE = 2;

export const LOBBY_SCALE = 1;
export const PLAYER_SCALE = 1;

export const START_POINT = {x: 200, y: 100};

export const NPC_CONFIG = [
	{ name: 'carry', x: 380, y: 180, start: 0, end: 31, duration: 2000, displayName: '[로비지킴이]' },
	{ name: 'jump', x: 200, y: 50, start: 0, end: 19, duration: 2000, displayName: '[대강당 안내자]' },
	{ name: 'hoe', x: 210, y: 280, start: 0, end: 19, duration: 2000, displayName: '[VR 학습터장]' },
	{ name: 'witch', x: 490, y: 300, start: 0, end: 19, duration: 2000, displayName: '[라운지 요정]' },
	{ name: 'sword', x: 500, y: 60, start: 0, end: 15, duration: 2000, displayName: '[강의실 관리자]' },
];

export const BOTTOM_SPEECH_POSITION = {
	x: 400,
	y: 360,
	scale: 4
}

export const STUFF_TO_SAY = {
	carry: [	//초록머리 웰컴봇
		"안녕 {USERNAME}!!\n\n에듀버스에 온 것을 환영해. ",
		"난 공부가 취미인데 넌 어때?",
		"아.. 참. 너 신입생이지?\n\n곧 입학식이 시작되니까\n\n지금 바로 대강당으로 가보는게 좋겠다.",
		"대강당은 왼쪽에 위치하고 있어.\n\n화살표를 따라가면 쉽게 찾을 수 있을거야."
	],
	jump: [	//대강당 NPC
		"와우! 잘 찾아왔네요.\n\n바로 여기가 대강당입니다.",
		"에듀버스 입학식이 곧 시작됩니다.\n\n어서 와서 편한 자리에 앉으세요!"
	],
	hoe: [ //VR 학습터 NPC
		"외국어를 배우고 싶으신가요~~\n\n우리두 할 수 있어요.",
		"VR 학습터에선 언제든!\n\n여러 언어를 배울 수 있다구."
	],
	witch: [ //라운지 NPC
		"공부하느라 수고가 많아요.\n\n잠시 라운지에서 머리를 식히세요~~.",
		"AWS의 여러 AI/ML 서비스를 체험할 수 있는 데모들이 있어요~"
	],
	sword: [	// 강의실 NPC
		"이제 수업이 곧 시작됩니다.\n\n선생님들이 기다리고 계세요.",
		"강의실에 들어가면\n\n먼저 마이크와 웹캠이 동작하는지 확인해보세요."
	]
}

export const VISIT_AVAILABLE = [
	"auditorium",
	"classroom",
	"vrlearning",
	"lounge",
	"lobby"
];