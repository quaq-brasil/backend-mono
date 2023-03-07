import { SetMetadata } from '@nestjs/common'
import { Action, defineAbilityProps } from './ability.factory'

export const CHECK_ABILITY = 'check_ability'

export interface RequiredRule {
	action: Action
	subject: string
	props?: defineAbilityProps
}

export const CheckAbilities = (...requirements: RequiredRule[]) =>
	SetMetadata(CHECK_ABILITY, requirements)
