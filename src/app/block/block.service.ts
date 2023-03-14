import { Injectable } from "@nestjs/common"
import axios from "axios"
import { PrismaService } from "src/prisma.service"

type WebhookBlock = {
  id: string
  type: string
  save_as: string
  data: {
    type?: string
    link?: string
    parameters?: string
    header?: any
    body?: any
  }
}

@Injectable()
export class BlockService {
  private instance: BlockService

  getInstance() {
    if (!this.instance) {
      this.instance = new BlockService(this.prismaService)
    }
    return this.instance
  }

  constructor(private prismaService: PrismaService) {}

  async webhookBlockExecution(blocks: WebhookBlock[], data: any[]) {
    if (blocks) {
      try {
        await Promise.all(
          blocks.map(async (block) => {
            if (block.type === "webhook") {
              const newData = await this.webhookBlock(block, data)
              data.push(newData)
            }
          })
        )
      } catch (error) {
        console.warn(error)
      }
    }

    return data
  }

  async webhookBlock(block: WebhookBlock, data: any[]) {
    let url = block.data.link

    if (block.data.parameters) {
      url = `${block.data.link}/${block.data.parameters}`
    }

    const webhookData = {
      config: {
        id: block.id,
        save_as: block.save_as,
        type: block.type,
        data: {
          type: block.data.type,
          link: block.data.link,
          header: block.data.header,
          parameters: block.data.parameters,
          body: block.data.body,
        },
      },
      output: {
        events: {},
        data: {
          data: {},
        },
      },
    }

    const api = axios.create({})

    if (block.data.header) {
      const headers = JSON.parse(block.data.header)
      api.defaults.headers = headers
    }

    const body = JSON.parse(block.data.body)

    try {
      switch (block.data.type) {
        case "GET":
          const getResponse = await api.get(url, body)

          webhookData.output.data = getResponse.data
          return webhookData

        case "POST":
          const postResponse = await api.post(url, body)

          webhookData.output.data = postResponse.data
          return webhookData

        case "PATCH":
          const patchResponse = await api.patch(url, body)

          webhookData.output.data = patchResponse.data
          return webhookData

        case "DELETE":
          const DeleteResponse = await api.delete(url, body)

          webhookData.output.data = DeleteResponse.data
          return webhookData
      }
    } catch (error) {
      console.warn(error)
    }
  }

  extractVariables(blocks: any[]) {
    const result = {}

    const extract = (value) => {
      if (typeof value === "object") {
        for (const key in value) {
          extract(value[key])
        }
      } else if (typeof value === "string") {
        const match = value.match(/{{(.*?)}}/g)
        if (match) {
          match.forEach((variable) => {
            let varName = variable.replace(/[{.}]/g, "__")
            varName = varName.substring(4, varName.length - 4)
            if (!result[varName]) {
              result[varName] = variable
            }
          })
        }
      }
    }

    blocks.forEach((item) => extract(item.data))

    return result
  }

  compileVariables(obj, vars) {
    const result = JSON.parse(JSON.stringify(obj))

    function replaceVar(str) {
      let res = str
      const varRegex = /\{\{([^{}]+)\}\}/g
      let match
      while ((match = varRegex.exec(str)) !== null) {
        const [varString, varPath] = match
        const pathParts = varPath.split(".")
        let value = vars
        for (const part of pathParts) {
          value = value[part]
          if (value === undefined) {
            break
          }
        }
        if (value !== undefined) {
          res = res.replace(varString, value)
        }
      }
      return res
    }

    function traverse(o) {
      for (const key in o) {
        if (typeof o[key] === "object") {
          traverse(o[key])
        } else if (typeof o[key] === "string") {
          o[key] = replaceVar(o[key])
        }
      }
    }

    traverse(result)
    return result
  }
}
