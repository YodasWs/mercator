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
	game.boardPlayers = document.getElementById('player-farm');
	game.buildBoard();
	game.startRound();
});

window.game = {
	round: 0,
	players: [],
	currentPlayer: 0,
	currentActions: [],

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
			text: '<b>Build Rooms</b><br/>or<br/><b>Build Stables</b>',
		},
		{
			action: 'starting-player',
			text: '<b>Starting Player</b><br/>and/or<br/><b>1 Minor Improvement</b>',
		},
		{
			action: 'grain',
			text: '<b>Take 1 Grain</b>',
		},
		{
			action: 'plow',
			text: '<b>Plow 1 Field</b>',
		},
		{
			action: 'sow',
			text: '<b>Sow</b><br/>and/or<br/><b>Bake Bread</b>',
			round: 1,
		},
		{
			action: 'plow-sow',
			text: '<b>Plow 1 Field</b><br/>and/or<br/><b>Sow</b>',
			round: 5,
		},
		{
			action: 'occupation-1',
			text: '<b>1 Occupation</b><br/>first free,<br/>subsequent<br/>costs 1 Food',
		},
		{
			action: 'occupation-2',
			text: '<b>1 Occupation</b><br/>costs 2 Food',
			players: 3,
		},
		{
			action: 'occupation-1-2',
			text: '<b>1 Occupation</b><br/>first or second<br/>costs 1 Food,<br/>subsequent<br/>costs 2 Food',
			players: 4,
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
			action: 'renovation-improvement',
			text: 'After <b>Renovation</b><br/>also <b>1 Major or Minor Improvement</b>',
			round: 2,
		},
		{
			action: 'renovation-fences',
			text: 'After <b>Renovation</b><br/>also <b>Fences</b>',
			round: 6,
		},
		{
			action: 'improvement',
			text: '<b>1 Major or Minor Improvement</b>',
			round: 1,
		},
		{
			action: 'growth-1',
			text: 'After <b>Family Growth</b><br/>also <b>1 Minor Improvement</b>',
			round: 2,
		},
		{
			action: 'growth-2',
			text: '<b>Family Growth</b> even without a room',
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
			text: '<b>1 Sheep and 1 Food</b><br/>or <b>1 Wild Board</b><br/>or pay 1 Food for <b>1 Cattle</b>',
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
			action: 'occupation-growth',
			text: '<b>1 Occupation</b><br/>or<br/>(after Round 5) <b>Family Growth</b>',
			players: 5,
		},
		{
			action: 'room-traveling',
			text: '<b>Build 1 Room</b><br/>or<br/><b>Traveling Players</b>',
			players: 5,
		},
	],

	startTurn() {
		game.boardActions.classList.remove('disabled');
		game.boardActions.scrollIntoView({
			behavior: 'smooth',
			block: 'center',
		});
	},

	takeAction: (e) => {
		if (game.currentActions.length || game.boardActions.classList.contains('disabled')) {
			return;
		}
		game.boardActions.classList.add('disabled');

		const action = e instanceof Event ? e.currentTarget.dataset.action : e;
		const actionTile = e instanceof Event ? e.currentTarget : document.querySelector(`button[data-action="${action}"]`);
		actionTile.setAttribute('disabled', '');
		game.players[game.currentPlayer].availableFamily--;
		if (game.supplies[action]) {
			game.supplies[action] = 0;
			[...actionTile.querySelectorAll('output')].forEach((output) => {
				output.innerText = 0;
			});
		}

		switch (action) {
			case 'room-traveling':
				break;
			case 'starting-player':
				break;
			case 'plow-sow':
				game.currentActions = [
					'plow',
					'sow',
				];
				break;
			case 'occupation-1':
				break;
			case 'occupation-2':
				break;
			case 'occupation-1-2':
				break;
			case 'occupation-growth':
				break;
			case 'renovation-improvement':
				break;
			case 'renovation-fences':
				break;
			case 'fences':
				break;
			case 'animal':
				break;
			default:
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
			case 'room-traveling':
				break;
			case 'starting-player':
				break;
			case 'vegetable':
			case 'grain':
				game.players[0].supplies[action]++;
				game.doAction();
				break;
			case 'plow':
			case 'sow':
				game.buildBoard(action);
				break;
			case 'occupation-1':
				break;
			case 'occupation-2':
				break;
			case 'occupation-1-2':
				break;
			case 'occupation-growth':
				break;
			case 'laborer':
				break;
			case 'fishing':
				break;
			case 'improvement':
				break;
			case 'renovation-improvement':
				break;
			case 'renovation-fences':
				break;
			case 'fences':
				break;
			case 'growth-1':
				break;
			case 'growth-2':
				break;
			case 'animal':
				break;
		}
	},

	endAction() {
		if (++game.currentPlayer >= game.players.length) {
			game.endRound();
			return;
		}
		game.startTurn();
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
			} else {
				this.supplies[key]++;
			}
		});

		const actionsList = document.querySelector('#action-board');
		actionsList.classList.remove('end');
		actionsList.innerHTML = '';

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

			actionsList.appendChild(btn);
		});

		this.currentPlayer = 0;
		game.startTurn();
	},

	endRound() {
		[...document.querySelectorAll('#action-board button')].forEach((btn) => {
			btn.setAttribute('disabled', '');
		});
		setTimeout(() => {
			game.startRound();
		}, 5000);
	},

	buildBoard(action) {
		game.boardPlayers.innerHTML = '';
		game.players[0].board.forEach((r1, r2) => {
			const row = document.createElement('tr');
			r1.forEach((c1, c2) => {
				const cell = document.createElement('td');
				cell.dataset.col = c2;
				cell.dataset.row = r2;
				cell.dataset.use = c1;
				switch (action) {
					case 'plow': {
						if (c1 !== '') break;
						const btn = document.createElement('button');
						btn.innerHTML = 'Plow Field';
						btn.addEventListener('click', game.plow);
						cell.appendChild(btn);
						break;
					}
					case 'sow': {
						if (c1 !== 'field') break;
						let btn;
						[
							'grain',
							'vegetable',
						].forEach((plant) => {
							if (game.players[0].supplies[plant] > 0) {
								btn = document.createElement('button');
								btn.innerHTML = `Sow ${plant}`;
								btn.addEventListener('click', (e) => game.sow(e, plant));
								cell.appendChild(btn);
							}
						});
						break;
					}
				}
				row.appendChild(cell);
			});
			game.boardPlayers.appendChild(row);
		});

		// Show Skip Action Button?
		switch (action) {
			case 'plow':
			case 'sow':
				game.btnSkip.removeAttribute('hidden');
				break;
		}

		game.boardPlayers.scrollIntoView({
			behavior: 'smooth',
		});
	},

	plow(e) {
		const field = e.currentTarget.closest('td');
		const [col, row] = [field.dataset.col, field.dataset.row];
		// game.players[game.currentPlayer].board[row][col] = 'field';
		game.players[0].board[row][col] = 'field';
		game.buildBoard();
		game.doAction();
	},

	sow(e, plant) {
		if (game.players[0].supplies[plant] < 1) {
			return;
		}

		const field = e.currentTarget.closest('td');
		const [col, row] = [field.dataset.col, field.dataset.row];
		game.players[0].supplies[plant]--;
		game.players[0].board[row][col] = `${plant}:1`;
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

function Player() {
	this.family = 2;
	this.availableFamily = 2;
	this.board = new Array(5).fill(0).map(a => new Array(3).fill(''));
	this.supplies = {
		'wood': 0,
		'clay': 0,
		'reed': 0,
		'stone': 0,
		'grain': 0,
		'vegetable': 0,
	};
}

const numPlayers = Math.round(Math.random() * (5 - 3) + 3);
for (let i=0; i<numPlayers; i++) {
	game.players.push(new Player());
}
