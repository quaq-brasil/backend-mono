import { BadRequestException, Injectable } from "@nestjs/common"
import axios from "axios"
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

    const api = axios.create({})

    await api.post("https://mail.quaq.me/api/v1/send-email", {
      to: createRaffleDto.email,
      subject: "Raffle subscription successful",
      text: `Your code is ${code}`,
      html: `
      <h1>Raffle subscription successful ${createRaffleDto.name}</h1>
      <p>Thank you for subscribing to the raffle</p>
      <p>Your code is ${code}</p>`,
      // code: code,
      // name: createRaffleDto.name,
      // email: createRaffleDto.email,
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

    await this.prismaService.raffle.update({
      where: {
        id: winner.id,
      },
      data: {
        winner: true,
        candidate: false,
      },
    })

    // await this.prismaService.raffle.updateMany({
    //   where: {
    //     candidate: true,
    //   },
    //   data: {
    //     candidate: false,
    //   },
    // })

    return {
      code: winner.code,
      name: winner.name,
      email: winner.email,
    }
  }

  async getWinners() {
    const winners = await this.prismaService.raffle.findMany({
      where: {
        winner: true,
      },
    })

    return winners
  }
}
