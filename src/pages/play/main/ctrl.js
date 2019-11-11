yodasws.page('play/main').setRoute({
	template: 'pages/play/main/main.html',
	route: '/play/main/',
}).on('load', () => {
	game.startRound();
});

window.game = {
	round: 0,
	players: 3,
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
			text: 'Build Room or Build Stables',
		},
		{
			action: 'starting-player',
			text: 'Starting Player and/or 1 Minor Improvement',
		},
		{
			action: 'grain',
			text: 'Take 1 Grain',
		},
		{
			action: 'plow',
			text: 'Plow 1 Field',
		},
		{
			action: 'sow',
			text: 'Sow and/or Bake Bread',
			round: 1,
		},
		{
			action: 'plow-sow',
			text: 'Plow 1 Field and/or Sow',
			round: 5,
		},
		{
			action: 'occupation-1',
			text: '1 Occupation, first free, subsequent costs 1 Food',
		},
		{
			action: 'occupation-2',
			text: '1 Occupation, costs 2 Food',
			players: 3,
		},
		{
			action: 'occupation-1-2',
			text: '1 Occupation, first or second costs 1 Food, subsequent costs 2 Food',
			players: 4,
		},
		{
			action: 'laborer',
			text: 'Day Laborer',
		},
		{
			action: 'fishing',
			text: 'Fishing, 2 Food',
		},
		{
			action: 'renovation-improvement',
			text: 'After Renovation, also 1 Major or Minor Improvement',
			round: 2,
		},
		{
			action: 'renovation-fences',
			text: 'After Renovation, also Fences',
			round: 6,
		},
		{
			action: 'improvement',
			text: '1 Major or Minor Improvement',
			round: 1,
		},
		{
			action: 'growth-1',
			text: 'After Family Growth, also 1 Minor Improvement',
			round: 2,
		},
		{
			action: 'growth-2',
			text: 'Family Growth even without a room',
			round: 5,
		},
		{
			action: 'fences',
			text: 'Fences',
			round: 1,
		},
		{
			action: 'sheep',
			text: '<output></output> Sheep',
			round: 1,
		},
		{
			action: 'boar',
			text: '<output></output> Wild Boar',
			round: 3,
		},
		{
			action: 'cattle',
			text: '<output></output> Cattle',
			round: 4,
		},
		{
			action: 'horse',
			text: '<output></output> Horse',
			round: 5,
		},
		{
			action: 'animal',
			text: '1 Sheep and 1 Food, or 1 Wild Board, or pay 1 Food for 1 Cattle',
			round: 5,
		},
		{
			action: 'vegetable',
			text: 'Take 1 Vegetable',
			round: 3,
		},
		{
			action: 'wood',
			text: '<output></output> Wood',
		},
		{
			action: 'clay',
			text: '<output></output> Clay',
		},
		{
			action: 'reed',
			text: '<output></output> Reed',
		},
		{
			action: 'stone-1',
			text: '<output></output> Stone',
			round: 2,
		},
		{
			action: 'stone-2',
			text: '<output></output> Stone',
			round: 4,
		},
		{
			action: 'reed-stone-food',
			text: '<output></output> Reed, <output></output> Stone, and <output></output> Food',
			players: 4,
		},
		{
			action: 'reed-stone-wood',
			text: '<output></output> Reed, also 1 Stone and 1 Wood',
			players: 5,
		},
		{
			action: 'occupation-growth',
			text: '1 Occupation or (after Round 5) Family Growth',
			players: 5,
		},
		{
			action: 'room-traveling',
			text: 'Build 1 Room or Traveling Players',
			players: 5,
		},
	],
	takeAction(action) {
		switch (action) {
			case 'build':
				break;
			case 'room-traveling':
				break;
			case 'starting-player':
				break;
			case 'grain':
				break;
			case 'vegetable':
				break;
			case 'plow':
				break;
			case 'sow':
				break;
			case 'plow-sow':
				this.takeAction('plow');
				this.takeAction('sow');
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
			case 'sheep':
				break;
			case 'boar':
				break;
			case 'cattle':
				break;
			case 'horse':
				break;
			case 'animal':
				break;
			case 'wood':
				break;
			case 'clay':
				break;
			case 'reed':
				break;
			case 'reed-stone-food':
				break;
			case 'reed-stone-wood':
				break;
			case 'stone':
				break;
		}
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

		const actionsList = document.querySelector('#action-board ol');
		actionsList.innerHTML = '';
		this.actions.forEach((action) => {
			if (action.round && this.round < action.round) {
				return;
			}
			if (action.players && this.players !== action.players) {
				return;
			}

			const el = document.createElement('li');
			const btn = document.createElement('button');
			btn.innerHTML = action.text;
			el.appendChild(btn);

			const output = el.querySelector('output');
			if (output instanceof Element) {
				output.innerText = this.supplies[action.action];
			}
			actionsList.appendChild(el);
		});
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
