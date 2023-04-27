import { BadRequestException, Injectable } from "@nestjs/common"
import { PrismaService } from "src/prisma.service"
import { CreateRaffleDto } from "./dto/create-raffle.dto"
@Injectable()
export class RaffleService {
  constructor(private prismaService: PrismaService) {}

  async create(createRaffleDto: CreateRaffleDto) {
    const code = Math.floor(Math.random() * 1000000)

    const raffle = await this.prismaService.raffle.create({
      data: {
        ...createRaffleDto,
        code,
      },
    })

    return raffle
  }

  async drawAWinner() {
    const raffleCandidates = await this.prismaService.raffle.findMany({
      where: {
        candidate: true,
      },
    })

    if (raffleCandidates.length === 0) {
      throw new BadRequestException("No candidates available for the raffle")
    }

    const numOfCandidates = raffleCandidates.length

    const randomIndex = Math.floor(Math.random() * numOfCandidates)

    const winner = raffleCandidates[randomIndex]

    await this.prismaService.raffle.updateMany({
      where: {
        candidate: true,
      },
      data: {
        candidate: false,
      },
    })

    return winner
  }
}
