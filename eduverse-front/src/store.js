import { createStore } from 'redux';
import axios from 'axios';

const initState = { players: [], score: 0};

const GET_PLAYERS = 'GET_PLAYERS';
const ADD_PLAYERS = 'ADD_PLAYERS';
export const UPDATE_SCORE = 'UPDATE_SCORE';

//GET_PLAYERS 및 receivedPlayers는 현재 데이터베이스에있는 모든 플레이어로 구성 요소의 로컬 상태를 채우는 데 사용됩니다.
const receivedPlayers = (players) => ({
	type: GET_PLAYERS,
	players,
})
//ADD_PLAYER 및 playerAdded는 데이터베이스 및 리더 보드에 새 플레이어를 추가하기 위해 점수 제출 양식에서 사용됩니다.
const playerAdded = (player) => ({
	type: ADD_PLAYERS,
	player,
})

export const updateScore = (score) => ({
	type: UPDATE_SCORE,
	score
})