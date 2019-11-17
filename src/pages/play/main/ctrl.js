yodasws.page('play/main').setRoute({
	template: 'pages/play/main/main.html',
	route: '/play/main/',
}).on('load', () => {
	console.log('Players:', game.players[0]);
	game.btnSkip = document.getElementById('btnSkip');
	game.btnSkip.addEventListener('click', (e) => {
		game.buildBoard();
		game.doAction();
	});
	game.boardActions = document.getElementById('action-board');
	game.boardMap = document.getElementById('map-board');
	game.info = {
		top: document.getElementById('top-info'),
	};
	game.buildBoard();
	game.startRound();
});

window.game = {
	round: 0,
	players: [],
	currentPlayer: 0,
	currentActions: [],

	board: new Array(5).fill(0).map(a => new Array(3).fill('').map(() => new Tile('grass'))),

	supplies: {
		'sheep': 0,
		'boar': 0,
		'cattle': 0,
		'horse': 0,
		'wood': 0,
		'clay': 0,
		'reed': 0,
		'stone-1': 0,
		'stone-2': 0,
		'reed-stone-food': 0,
		'reed-stone-wood': 0,
	},

	actions: [
		{
			action: 'build',
			text: '<b>Build Improvements</b>',
		},
		{
			action: 'starting-player',
			text: '<b>Starting Player</b>',
		},
		{
			action: 'grain',
			text: '<b>Take 1 Grain</b>',
		},
		{
			action: 'plow',
			text: '<b>Plow 1 Farmland</b>',
		},
		{
			action: 'sow',
			text: '<b>Sow</b><br/>and/or<br/><b>Bake Bread</b>',
			round: 1,
		},
		{
			action: 'plow-sow',
			text: '<b>Plow 1 Farmland</b><br/>and/or<br/><b>Sow</b>',
			round: 5,
		},
		{
			action: 'road',
			text: '<b>Build Road</b>',
		},
		{
			action: 'laborer',
			text: '<b>Day Laborer</b>',
		},
		{
			action: 'fishing',
			text: '<b>Fishing</b><br/>2 Food',
		},
		{
			action: 'hire',
			text: '<b>Hire Worker</b>',
			round: 2,
		},
		{
			action: 'hire-wo-room',
			text: '<b>Hire Worker</b> even without room',
			round: 5,
		},
		{
			action: 'fences',
			text: '<b>Fences</b>',
			round: 1,
		},
		{
			action: 'sheep',
			text: '<b><output></output> Sheep</b>',
			round: 1,
		},
		{
			action: 'boar',
			text: '<b><output></output> Wild Boar</b>',
			round: 3,
		},
		{
			action: 'cattle',
			text: '<b><output></output> Cattle</b>',
			round: 4,
		},
		{
			action: 'horse',
			text: '<b><output></output> Horse</b>',
			round: 5,
		},
		{
			action: 'animal',
			text: '<b>1 Sheep and 1 Food</b><br/>or <b>1 Wild Boar</b><br/>or pay 1 Food for <b>1 Cattle</b>',
			round: 5,
		},
		{
			action: 'vegetable',
			text: '<b>Take 1 Vegetable</b>',
			round: 3,
		},
		{
			action: 'wood',
			text: '<b><output></output> Wood</b>',
		},
		{
			action: 'clay',
			text: '<b><output></output> Clay</b>',
		},
		{
			action: 'reed',
			text: '<b><output></output> Reed</b>',
		},
		{
			action: 'stone-1',
			text: '<b><output></output> Stone</b>',
			round: 2,
		},
		{
			action: 'stone-2',
			text: '<b><output></output> Stone</b>',
			round: 4,
		},
		{
			action: 'reed-stone-food',
			text: '<b><output></output> Reed</b>,<br/><b><output></output> Stone</b>,<br/>and <b><output></output> Food</b></b>',
			players: 4,
		},
		{
			action: 'reed-stone-wood',
			text: '<b><output></output> Reed</b><br/>also <b>1 Stone and 1 Wood</b>',
			players: 5,
		},
		{
			action: 'build-traveling',
			text: '<b>Build 1 Improvement</b><br/>or<br/><b>Traveling Players</b>',
			players: 5,
		},
	],

	startTurn() {
		game.boardActions.classList.remove('disabled');
		game.boardActions.scrollIntoView({
			behavior: 'smooth',
			block: 'center',
		});
		game.info.top.innerHTML = `Current Player: <b>${game.players[game.currentPlayer].name}</b>`;
	},

	takeAction: (e) => {
		if (game.currentActions.length || game.boardActions.classList.contains('disabled')) {
			return;
		}
		game.boardActions.classList.add('disabled');

		if (game.players[game.currentPlayer].availableWorkers <= 0) {
			return;
		}

		const action = e instanceof Event ? e.currentTarget.dataset.action : e;
		const actionTile = e instanceof Event ? e.currentTarget : document.querySelector(`button[data-action="${action}"]`);
		actionTile.setAttribute('disabled', '');
		game.players[game.currentPlayer].availableWorkers--;
		if (game.supplies[action]) {
			game.supplies[action] = 0;
			[...actionTile.querySelectorAll('output')].forEach((output) => {
				output.innerText = 0;
			});
		}

		// If action does multiple actions, build that list here
		switch (action) {
			case 'build-traveling':
				break;
			case 'starting-player':
				break;
			case 'plow-sow':
				game.currentActions = [
					'plow',
					'sow',
				];
				break;
			case 'fences':
				break;
			case 'animal':
				break;
			default:
				// Only one thing to do
				game.currentActions.push(action);
		}
		game.doAction();
	},

	doAction() {
		game.btnSkip.setAttribute('hidden', '');
		const action = game.currentActions.shift();
		if (!action) {
			game.endAction();
			return;
		}

		switch (action) {
			case 'build':
				break;
			case 'build-traveling':
				break;
			case 'starting-player':
				break;
			case 'vegetable':
			case 'grain':
				game.players[game.currentPlayer].supplies[action]++;
				break;
			case 'plow':
			case 'sow':
				game.buildBoard(action);
				// Wait for User action
				return;
			case 'laborer':
				break;
			case 'fishing':
				break;
			case 'fences':
				break;
			case 'hire':
				if (game.players[game.currentPlayer].workers < 5) {
					game.players[game.currentPlayer].workers++;
				}
				break;
			case 'hire-wo-room':
				if (game.players[game.currentPlayer].workers < 5) {
					game.players[game.currentPlayer].workers++;
				}
				break;
			case 'animal':
				break;
		}

		game.doAction();
	},

	endAction() {
		let nextTurn = false;
		for (let i=0; i<game.players.length; i++) {
			game.currentPlayer++;
			if (game.currentPlayer >= game.players.length) {
				game.currentPlayer = 0;
			}
			if (game.players[game.currentPlayer].availableWorkers !== 0) {
				nextTurn = true;
				break;
			}
		}

		if (nextTurn) game.startTurn();
		else game.endRound();
	},

	startRound() {
		this.round++;
		Object.entries(this.supplies).forEach(([key, num]) => {
			if ([
				'sheep',
				'boar',
				'cattle',
				'horse',
				'stone-1',
				'stone-2',
			].includes(key)) {
				if (this.round >= this.actions.filter(a => a.action === key)[0].round) this.supplies[key]++;
			} else if (key === 'wood') {
				this.supplies[key] += 3;
			} else {
				this.supplies[key]++;
			}
		});

		game.boardActions.classList.remove('end');
		game.boardActions.innerHTML = '';

		this.actions.forEach((action) => {
			if (action.round && this.round < action.round) {
				return;
			}
			if (action.players && action.players !== this.players.length) {
				return;
			}

			const btn = document.createElement('button');
			btn.innerHTML = action.text;
			btn.dataset.action = action.action;
			btn.addEventListener('click', this.takeAction);

			[...btn.querySelectorAll('output')].forEach((output) => {
				output.innerText = this.supplies[action.action];
			});

			game.boardActions.appendChild(btn);
		});

		[...game.boardActions.querySelectorAll('button')].forEach((btn) => {
			btn.removeAttribute('disabled');
		});

		this.players.forEach((player) => {
			player.availableWorkers = player.workers;
		});

		this.currentPlayer = 0;
		game.startTurn();
	},

	endRound() {
		[...game.boardActions.querySelectorAll('button')].forEach((btn) => {
			btn.setAttribute('disabled', '');
		});
		game.info.top.innerHTML = 'End of Round';
		game.info.top.scrollIntoView({
			behavior: 'smooth',
			block: 'center',
		})
		setTimeout(() => {
			game.startRound();
		}, 1000);
	},

	buildBoard(action) {
		// game.boardMap.innerHTML = '';
		const initialBuild = game.boardMap.innerHTML === '';
		game.board.forEach((r1, r2) => {
			const row = document.createElement('tr');
			r1.forEach((c1, c2) => {
				c1.html.innerHTML = '';
				c1.html.dataset.col = c2;
				c1.html.dataset.row = r2;
				c1.html.dataset.use = c1.improvements.join(' ');
				switch (action) {
					case 'plow': {
						if (c1.improvements.length > 0 || ![
							'plains',
							'grass',
						].includes(c1.terrain)) {
							break;
						}

						const btn = document.createElement('button');
						btn.innerHTML = 'Plow Farmland';
						btn.addEventListener('click', game.plow);
						c1.html.appendChild(btn);
						break;
					}
					case 'sow': {
						if (!c1.improvements.includes('farm')) {
							break;
						}

						let btn;
						[
							'grain',
							'vegetable',
						].forEach((plant, i, plants) => {
							// Can't sow over other plants
							if (c1.improvements.intersects(plants)) {
								return;
							}

							if (game.players[game.currentPlayer].supplies[plant] > 0) {
								btn = document.createElement('button');
								btn.innerHTML = `Sow ${plant}`;
								btn.addEventListener('click', (e) => game.sow(e, plant));
								c1.html.appendChild(btn);
							}
						});
						break;
					}
				}
				if (initialBuild) row.appendChild(c1.html);
			});
			if (initialBuild) game.boardMap.appendChild(row);
		});

		// Show Skip Action Button?
		switch (action) {
			case 'plow':
			case 'sow':
				game.btnSkip.removeAttribute('hidden');
				break;
		}

		game.boardMap.scrollIntoView({
			behavior: 'smooth',
		});
	},

	plow(e) {
		const farm = e.currentTarget.closest('td');
		const [col, row] = [farm.dataset.col, farm.dataset.row];
		game.board[row][col].improvements.push('farm');
		game.buildBoard();
		game.doAction();
	},

	sow(e, plant) {
		if (game.players[game.currentPlayer].supplies[plant] < 1) {
			return;
		}

		const farm = e.currentTarget.closest('td');
		const [col, row] = [farm.dataset.col, farm.dataset.row];
		game.players[game.currentPlayer].supplies[plant]--;
		game.board[row][col].improvements.push(plant);
		game.board[row][col].supplies = {
			[plant]: 1,
		};
		game.buildBoard('sow');
	},
};

// Sort Actions by Round
game.actions.sort((a, b) => {
	if (!a.round && !b.round) {
		return 0;
	}
	if (!a.round && b.round) {
		return -1;
	}
	if (a.round && !b.round) {
		return 1;
	}
	if (a.round === b.round) {
		return Math.random() - 0.5;
	}
	return a.round - b.round;
}).filter((a, i) => {
	a.i = i;
	return !!a.round;
}).forEach((a, round) => {
	game.actions[a.i].round = round + 1;
});

function Player(name) {
	this.workers = 2;
	this.availableWorkers = 2;
	this.supplies = {
		'wood': 0,
		'clay': 0,
		'reed': 0,
		'stone': 0,
		'grain': 0,
		'vegetable': 0,
	};
	this.name = name;
}

function Tile(terrain) {
	if (![
		'grass',
		'ocean',
		'plains',
	].includes(terrain)) {
		throw new Error('Unacceptable terrain type!');
	}

	this.terrain = terrain;
	this.improvements = [];
	this.html = document.createElement('td');
	this.html.dataset.terrain = terrain;
}

Array.prototype.intersects = function(arr) {
	return this.filter(e => arr.includes(e)).length > 0;
}

const names = [
	'Ashley',
	'Audrey',
	'Jiaxin',
	'Mathilde',
	'Jane',
	'Susan',
	'Tara',
	'Sally',
	'Stephanie',
];

game.board = [
	['plains', 'plains', 'ocean', 'plains', 'plains'],
	['plains', 'grass', 'ocean', 'grass', 'plains'],
	['plains', 'grass', 'ocean', 'grass', 'plains'],
	['plains', 'plains', 'ocean', 'plains', 'plains'],
].map((row) => {
	return row.map(cell => new Tile(cell));
});

const numPlayers = 4; // Math.round(Math.random() * (5 - 3) + 3);
for (let i=0; i<numPlayers; i++) {
	game.players.push(new Player(i === 0 ? 'You!' : names[i /* Math.floor(Math.random() * names.length) */]));
}
