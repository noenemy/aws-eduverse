import { atom } from 'recoil';

export const userState = atom({
	key: 'userState',
	default: {
		id: '',
		nickname: '',
		x: '',
		y: '',
		to: '',
		state: '',
		character: '',
	}
})