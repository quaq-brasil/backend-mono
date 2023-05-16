import { Body, Controller, Get, Post } from "@nestjs/common"
import { CreateRaffleDto } from "./dto/create-raffle.dto"
import { RaffleService } from "./raffle.service"

@Controller("api/v1/raffle")
export class RaffleController {
  constructor(private readonly raffleService: RaffleService) {}

  @Post()
  create(@Body() createRaffleDto: CreateRaffleDto) {
    return this.raffleService.create(createRaffleDto)
  }

  @Get()
  drawAWinner() {
    return this.raffleService.drawAWinner()
  }

  @Get("winners")
  getWinners() {
    return this.raffleService.getWinners()
  }
}
