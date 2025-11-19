// eslint-disable-next-line n/no-missing-import
import { Player, type Root } from './game.js'
import * as fs from 'node:fs/promises'

const USE_CSV_HEADERS = true

export async function getGameData(eventId: string, eventHashCode: string): Promise<Root> {
	const data = (await fetch(
		`https://njcaastats.prestosports.com/action/sports/liveupdate?e=${eventId}&h=${eventHashCode}`,
	).then(async (res) => res.json())) as Root

	// console.log(data)

	return data
}

export function getVariables(data: Root): { [k: string]: string } {
	const v: { [k: string]: any } = {}
	const dataExports: { [k in 'V' | 'H']: { [l in 'on' | 'off' | 'all']: any[] } } = {
		V: {
			on: [],
			off: [],
			all: [],
		},
		H: {
			on: [],
			off: [],
			all: [],
		},
	}

	console.log(dataExports)

	if (data.error) {
		console.error(data.error)
		return v
	}

	v[`status_complete`] = data.status.complete === 'Y'
	v[`status_running`] = data.status.running
	v[`status_clock`] = data.status.clock
	v[`status_period`] = data.status.period?.[0]

	data.team.forEach((team) => {
		const variableName = `team_${team.vh}`

		v[`${variableName}_name`] = team.name
		v[`${variableName}_id`] = team.id

		const playerGroups: { [k: string]: Player[] } = {
			on: [],
			off: [],
		}

		team.player.forEach((player) => {
			if (player.oncourt?.[0] === 'Y') {
				playerGroups.on.push(player)
			} else {
				playerGroups.off.push(player)
			}
		})

		Object.entries(playerGroups).forEach(([groupName, players]) => {
			players.forEach((player, i) => {
				const p: { [k: string]: any } = {}

				p[`name`] = player.name
				p[`lastname`] = player.checkname?.split(',').shift()
				p[`uniform`] = player.uni
				p[`team`] = team.id

				p[`fgm`] = player.stats?.fgm || 0
				p[`fga`] = player.stats?.fga?.[0] || 0

				p[`fgm3`] = player.stats?.fgm3 || 0
				p[`fga3`] = player.stats?.fga3 || 0

				p[`ftm`] = player.stats?.ftm || 0
				p[`fta`] = player.stats?.fta || 0

				p[`r`] = player.stats?.treb || 0
				p[`a`] = player.stats?.ast || 0
				p[`f`] = player.stats?.pf || 0

				// json export
				v[`${variableName}_${groupName}_p${i + 1}_data`] = p
				Object.entries(p).forEach(([key, val]) => {
					v[`${variableName}_${groupName}_p${i + 1}_${key}`] = val
				})

				if (groupName === 'on' || groupName === 'off') {
					dataExports[team.vh][groupName].push(p)
					dataExports[team.vh]['all'].push(p)
				}
				//
				// if (v[`export_data_csv`].length === 0) {
				// 	v[`export_data_csv`].push(
				// 		Object.entries(p)
				// 			.map(([key]) => key)
				// 			.join(','),
				// 	)
				// }
				// v[`export_data_csv`].push(
				// 	Object.entries(p)
				// 		.map(([, val]) => val)
				// 		.join(','),
				// )
			})
		})
	})

	Object.entries(dataExports).forEach(([vh, groups]) => {
		Object.entries(groups).forEach(([groupKey, group]) => {
			v[`export_${vh}_${groupKey}_json`] = group
			v[`export_${vh}_${groupKey}_csv`] = [
				...(USE_CSV_HEADERS ? [Object.keys(group[0]).join(',')] : []),
				...group.map((x) => Object.values(x).join(',')),
			].join('\n')
		})
	})

	return v
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function checkDataFolderExists(directory: string) {
	await fs
		.stat(directory)
		.then(() => {
			return true
		})
		.catch(async (error: any) => {
			if (error?.code === 'ENOENT') {
				await fs.mkdir(directory, { recursive: true })
				return true
			}
			throw error
		})
}
