import { BadRequestException, Injectable } from "@nestjs/common"
import axios from "axios"
import { PrismaService } from "src/prisma.service"
import { CreateRaffleDto } from "./dto/create-raffle.dto"
@Injectable()
export class RaffleService {
  constructor(private prismaService: PrismaService) {}

  async create(createRaffleDto: CreateRaffleDto) {
    try {
      const raffleCandidates = await this.prismaService.raffle.findMany({
        where: {
          email: createRaffleDto.email,
        },
      })

      if (raffleCandidates.length > 0) {
        return {
          message: "You have already participated in the raffle",
          ...raffleCandidates[0],
        }
      }

      const code = Math.floor(Math.random() * 1000000)

      const raffle = await this.prismaService.raffle.create({
        data: {
          ...createRaffleDto,
          user_consent: true,
          code,
        },
      })

      const api = axios.create({})

      await api.post("https://mail.quaq.me/api/v1/send-email", {
        sender: {
          name: "quaq",
          email: "laliga@quaq.me",
        },
        to: [
          {
            name: raffle.name,
            email: raffle.email,
          },
        ],
        subject: "את‎/ה בפנים! הנה המספר המזהה הייחודי שלך להצטרפות",
        html: `<p>‎מזל טוב! את/ה רשמית משתתף/ת בהגרלה שלנו באשר לנסיעה לספרד. מספר הזיהוי הייחודי שלך הוא ${raffle.code}. שמור/י על מספר זה, מאחר שרק באמצעותו ניתן יהיה  לקבל את הפרס אם תבחר כזוכה.</p><p>‎בעודך מחכה לראות אם אתה הזוכה המאושר, למה שלא תלמד/י עוד על הקבוצות המרגשות של לה ליגה? בדוק/י את מגזין "ברוכים הבאים ללה ליגה" שלנו עבור מידע מפורט ובלעדי.</p><p>‎תודה שהשתתפת בהגרלה שלנו. אנחנו לא יכולים לחכות ולראות מי ינצח ויחווה את הריגוש שבתרבות הספרדית והכדורגל מקרוב</p><a href="https://quaq-image.s3.sa-east-1.amazonaws.com/laliga+magazine.pdf" target="_blank"><p>🇪🇸⚽לחץ כאן לגישה🇪⚽🇪🇸</p></a>`,
      })

      await api.post("https://gsheets.quaq.me/api/v1", {
        spreadsheetId: "1mW3wY0CNacTI6A8VVAXizHwNQihy2qr7T2unBp3QaMY",
        range: "Sheet1!A1:E2",
        values: [
          [
            raffle.name,
            raffle.email,
            raffle.code,
            createRaffleDto.team,
            createRaffleDto.user_consent,
          ],
        ],
      })

      return raffle
    } catch (error) {
      console.log(error)
    }
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
