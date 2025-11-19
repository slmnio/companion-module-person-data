export interface Root {
	source: string
	version: string
	generated: string
	venue: Venue
	status: Status
	team: Team[]
	plays: Plays
	primetime: Primetime
	network: Network

	error: string
}

export interface Venue {
	gameid: string
	visid: string
	visname: string
	homeid: string
	homename: string
	date: string
	location: string
	time: string
	start: string
	end: string
	duration: string
	delay: string
	attend: string
	schednote: string
	leaguegame: string
	neutralgame: string
	postseason: string
	officials: Officials
	notes: any
	rules: Rules
}

export interface Officials {
	text: string
}

export interface Rules {
	prds: string
	minutes: string
	minutesot: string
	fouls: string
	qh: string
	overtimeType: string
}

export interface Status {
	complete: 'Y' | 'N'
	running: string
	period: string[]
	clock: string
}

export interface Team {
	vh: 'V' | 'H'
	id: string
	name: string
	code: string
	record: string
	teamId: string
	rpi: string
	linescore: Linescore
	totals: Totals
	player: Player[]
}

export interface Linescore {
	line: string[]
	score: string[]
	lineprd: Lineprd[]
}

export interface Lineprd {
	prd: string
	score: string[]
}

export interface Totals {
	stats: StatsTotals
	special: Special[]
}

export interface StatsTotals {
	fgm: string
	fga: string[]
	fgm3: string
	fga3: string
	ftm: string
	fta: string
	tp: string
	blk: string
	stl: string
	ast: string
	min: string
	oreb: string
	dreb: string
	treb: string
	pf: string
	tf: string
	to: string
	dq: string
	deadball: string
	fgpct: string
	fg3pct: string
	ftpct: string
}

export interface Special {
	vh: 'V' | 'H'
	pts_to: string
	pts_ch2: string
	pts_paint: string
	pts_fastb: string
	pts_bench: string
	ties: string
	leads: string
	poss_count: string
	poss_time: string
	score_count: string
	score_time: string
	large_lead: string
	large_lead_t: string
}

export interface Player {
	uni: string
	code: string
	name: string
	checkname: string
	gp: string
	playerId: string
	stats?: PlayerStats
	statsbyprd?: Statsbyprd[]
	oncourt?: string[]
	gs?: string
	pos?: string
}

export interface PlayerStats {
	oreb: string
	dreb: string
	treb: string
	pf: string
	tf: string
	to: string
	tp: string
	fgm?: string
	fga?: string[]
	fgm3?: string
	fga3?: string
	ftm?: string
	fta?: string
	blk?: string
	stl?: string
	ast?: string
	min?: string
}

export interface Statsbyprd {
	prd: string
	fgm?: string
	fga?: string[]
	fgm3?: string
	fga3?: string
	ftm?: string
	fta?: string
	tp: string
	blk?: string
	stl?: string
	ast?: string
	min?: string
	oreb: string
	dreb: string
	treb: string
	pf: string
	tf: string
	to: string
	dq: string
}

export interface Plays {
	format: string
	period: Period[]
}

export interface Period {
	number: string
	time: string
	special: Special2[]
	summary: Summary[]
	play: Play[]
	clock: Clock
}

export interface Special2 {
	vh: 'V' | 'H'
	pts_to: string
	pts_ch2: string
	pts_paint: string
	pts_fastb: string
	pts_bench: string
	ties: string
	leads: string
	poss_count: string
	poss_time: string
	score_count: string
	score_time: string
	large_lead: string
	large_lead_t: string
}

export interface Summary {
	vh: 'V' | 'H'
	fgm: string
	fga: string[]
	fgm3: string
	fga3: string
	ftm: string
	fta: string
	blk: string
	stl: string
	ast: string
	oreb: string
	dreb: string
	treb: string
	pf: string
	tf: string
	to: string
}

export interface Play {
	vh: 'V' | 'H'
	time: string
	uni: string
	team: string[]
	checkname: string
	action: string
	type?: string
	paint?: string
	vscore?: string
	hscore?: string
}

export interface Clock {
	time: string
}

export interface Primetime {
	show: string
	videoProvider: string
	fg3mkmin: string
	bb_period_rules: string
	fgatmin: string
	fgmkmin: string
	fg3atmin: string
	ftacoef: string
	bbgpmin: string
	ftmkmin: string
	ftatmin: string
	tournament_labels: string
	tournament_events: string
}

export interface Network {
	startTime: string
	lastUpdated: string
	statusCode: string
	tba: string
	localTime: string
	localDate: string
	location: string
	eventId: string
	sportCode: string
	sportPath: string
}
