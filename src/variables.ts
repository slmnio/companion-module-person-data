import type { ModuleInstance } from './main.js'

export function UpdateVariableDefinitions(self: ModuleInstance): void {
	const varDescriptions: { [k: string]: any } = {}

	// varDescriptions[`export_data_json`] = `Raw JSON data`
	// varDescriptions[`export_data_csv`] = `Raw CSV data`
	varDescriptions[`status_complete`] = `Status: game complete`
	varDescriptions[`status_running`] = `Status: game running`
	varDescriptions[`status_clock`] = `Status: game clock`
	varDescriptions[`status_period`] = `Status: game period`
	;['V', 'H'].forEach((vh) => {
		varDescriptions[`team_${vh}_name`] = `Team name for ${vh} team`
		varDescriptions[`team_${vh}_id`] = `Team ID for ${vh} team`

		varDescriptions[`export_${vh}_on_json`] = `JSON export of ${vh} on-court players`
		varDescriptions[`export_${vh}_off_json`] = `JSON export of ${vh} off-court players`
		varDescriptions[`export_${vh}_all_json`] = `JSON export of ${vh} all-court players`
		varDescriptions[`export_${vh}_on_csv`] = `CSV export of ${vh} on-court players`
		varDescriptions[`export_${vh}_off_csv`] = `CSV export of ${vh} off-court players`
		varDescriptions[`export_${vh}_all_csv`] = `CSV export of ${vh} all-court players`
		;[1, 2, 3, 4, 5].forEach((num) => {
			varDescriptions[`team_${vh}_on_p${num}_name`] = `Player name for ${vh} team player ${num} on-court`
			varDescriptions[`team_${vh}_on_p${num}_uniform`] = `Player uniform number for ${vh} team player ${num} on-court`
			varDescriptions[`team_${vh}_on_p${num}_lastname`] = `Player lastname for ${vh} team player ${num} on-court`
			varDescriptions[`team_${vh}_on_p${num}_data`] = `Player data for ${vh} team player ${num} on-court`
			;[`_fgm`, `_fga`, `_fgm3`, `_fga3`, `_ftm`, `_fta`, `_r`, `_a`, `_f`].forEach((stat) => {
				varDescriptions[`team_${vh}_on_p${num}${stat}`] =
					`Player stat "${stat.slice(1)}" for ${vh} team player ${num} on-court`
			})
		})
		;[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach((num) => {
			varDescriptions[`team_${vh}_off_p${num}_name`] = `Player name for ${vh} team player ${num} off-court`
			varDescriptions[`team_${vh}_off_p${num}_lastname`] = `Player lastname for ${vh} team player ${num} off-court`
			varDescriptions[`team_${vh}_off_p${num}_data`] = `Player data for ${vh} team player ${num} off-court`
			varDescriptions[`team_${vh}_off_p${num}_uniform`] = `Player uniform number for ${vh} team player ${num} off-court`
			;[`_fgm`, `_fga`, `_fgm3`, `_fga3`, `_ftm`, `_fta`, `_r`, `_a`, `_f`].forEach((stat) => {
				varDescriptions[`team_${vh}_off_p${num}${stat}`] =
					`Player stat "${stat.slice(1)}" for ${vh} team player ${num} off-court`
			})
		})
	})

	self.setVariableDefinitions(Object.entries(varDescriptions).map(([variableId, name]) => ({ variableId, name })))
}
