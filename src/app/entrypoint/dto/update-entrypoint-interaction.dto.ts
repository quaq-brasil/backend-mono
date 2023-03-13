import { PartialType } from "@nestjs/mapped-types"
import { CreateInteractionEntrypointDto } from "./create-entrypoint-interaction.dto"

export class UpdateInteractionEntrypointDto extends PartialType(
  CreateInteractionEntrypointDto
) {}
