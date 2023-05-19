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
          email: "hello@quaq.me",
        },
        to: [
          {
            name: raffle.name,
            email: raffle.email,
          },
        ],
        subject: "אתה בתוך! הנה מזהה הייחודי שלך למשיכת הנסיעה לספרד.",
        html: `<p>יקירי ${raffle.name},</p>      <p>מזל טוב! אתה רשמית משתתף בהגרלה שלנו לנסיעה לספרד. המספר הזיהוי הייחודי שלך הוא ${raffle.code}. שמור על מספר זה בבטחה, מאחר שהוא יהיה הכרטיס שלך לקבלת הפרס אם תבחר כזוכה.  </p>  <p>בעודך מחכה לראות אם אתה הזוכה המאושר, למה לא ללמוד יותר על הקבוצות המרגשות של לה ליגה? בדוק את מגזין "ברוכים הבאים ללה ליגה" שלנו עבור מידע פרטני ובלעדי.  </p>  <p>    תודה שהשתתפת בהגרלה שלנו. אנחנו לא יכולים לחכות לראות מי ינצח ויחווה את הרגש של התרבות הספרדית וכדורגל מקרוב.  </p><p><a href="https://quaq-image.s3.sa-east-1.amazonaws.com/laliga+magazine.pdf">לחץ כאן לגישה</a></p>`,
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
