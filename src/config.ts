import { type SomeCompanionConfigField } from '@companion-module/base'

export interface ModuleConfig {
	event: string
	hash: string
	url: string
}

export function GetConfigFields(): SomeCompanionConfigField[] {
	return [
		{
			type: 'textinput',
			id: 'event',
			label: 'Event ID',
			width: 8,
		},
		{
			type: 'textinput',
			id: 'hash',
			label: 'Event Hash Code',
			width: 12,
		},
		{
			type: 'textinput',
			id: 'url',
			label: 'Match page URL',
			width: 12,
		},
	]
}
