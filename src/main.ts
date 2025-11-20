import { InstanceBase, runEntrypoint, InstanceStatus, SomeCompanionConfigField } from '@companion-module/base'
import { GetConfigFields, type ModuleConfig } from './config.js'
import { UpdateVariableDefinitions } from './variables.js'
import { UpgradeScripts } from './upgrades.js'
import { UpdateActions } from './actions.js'
import { UpdateFeedbacks } from './feedbacks.js'
import { checkDataFolderExists, getGameData, getVariables } from './api.js'
import * as fs from 'node:fs/promises'
import * as path from 'node:path'

import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const hardcodedDirectory = 'C:\\Users\\colin\\basketball stats'

export class ModuleInstance extends InstanceBase<ModuleConfig> {
	config!: ModuleConfig // Setup in init()
	loadInterval: any

	constructor(internal: unknown) {
		super(internal)
	}

	async init(config: ModuleConfig): Promise<void> {
		this.log('debug', JSON.stringify(config))
		if ((!config.hash || !config.event) && config.url) {
			const manualCheck = await this.getSiteMetadata(config.url)
			this.log('debug', JSON.stringify(config.url))
			this.log('debug', JSON.stringify(manualCheck))
			if (manualCheck.eventId) config.event = manualCheck.eventId
			if (manualCheck.eventIdHashCode) config.hash = manualCheck.eventIdHashCode

			if (manualCheck.eventId || manualCheck.eventIdHashCode) {
				this.saveConfig(config)
			}
		}
		this.config = config

		this.updateStatus(InstanceStatus.Ok)

		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions

		return this.startLoading(this.config.event, this.config.hash)
	}
	// When module gets deleted
	async destroy(): Promise<void> {
		this.log('debug', 'destroy')
	}

	async configUpdated(config: ModuleConfig): Promise<void> {
		if ((!config.hash || !config.event) && config.url) {
			const manualCheck = await this.getSiteMetadata(config.url)
			if (manualCheck.eventId) config.event = manualCheck.eventId
			if (manualCheck.eventIdHashCode) config.hash = manualCheck.eventIdHashCode

			if (manualCheck.eventId || manualCheck.eventIdHashCode) {
				this.saveConfig(config)
			}
		}

		this.config = config
		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions
		return this.startLoading(this.config.event, this.config.hash)
	}

	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	async getSiteMetadata(url: string) {
		const page = await fetch(url).then(async (res) => res.text())
		this.log('debug', page)
		return {
			eventId: page.match(/eventId = '([^']*)'/)?.[1],
			eventIdHashCode: page.match(/eventIdHashCode = '([^']*)'/)?.[1],
		}
	}

	// Return config fields for web config
	getConfigFields(): SomeCompanionConfigField[] {
		return GetConfigFields()
	}

	updateActions(): void {
		UpdateActions(this)
	}

	updateFeedbacks(): void {
		UpdateFeedbacks(this)
	}

	updateVariableDefinitions(): void {
		UpdateVariableDefinitions(this)
	}

	async startLoading(eventId: string, eventHashCode: string): Promise<void> {
		this.log('debug', `Loading e=${eventId}, h=${eventHashCode}`)
		if (this.loadInterval) clearInterval(this.loadInterval)

		await this.processData(eventId, eventHashCode)
		// eslint-disable-next-line @typescript-eslint/no-misused-promises
		this.loadInterval = setInterval(async () => {
			return this.processData(eventId, eventHashCode)
		}, 10_000)
	}

	async processData(eventId: string, eventHashCode: string): Promise<void> {
		const data = await getGameData(eventId, eventHashCode)
		const variableData = getVariables(data)

		await checkDataFolderExists(path.join(hardcodedDirectory || __dirname, 'data'))

		await Promise.all(
			Object.entries(variableData)
				.filter(([key]) => key.startsWith('export_'))
				.map(async ([key, data]) => {
					// this.log('debug', `Checking variable value ${key} -> (old = ${this.getVariableValue(key)}; new = ${data})`)
					if (JSON.stringify(this.getVariableValue(key)) !== JSON.stringify(data)) {
						// write to file

						const keyName = key.split('_')
						const fileType = keyName.pop()
						let filename = `${keyName.join('_')}.${fileType}`

						this.log('debug', `Writing ${key} to ${filename}`)

						if (fileType === 'json') {
							// this.log('debug', `JSON data: ${JSON.stringify(data)}`)
							filename += `.txt`
							// return
						}

						try {
							await fs.writeFile(
								path.join(hardcodedDirectory || __dirname, 'data', filename),
								fileType === 'json' ? JSON.stringify(data) : data,
								{
									encoding: 'utf-8',
								},
							)
						} catch (e: any) {
							this.log('error', JSON.stringify(e))
						}
					}
				}),
		)

		this.setVariableValues(variableData)
	}
}

runEntrypoint(ModuleInstance, UpgradeScripts)
