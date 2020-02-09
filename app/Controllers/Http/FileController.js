'use strict'

const File = use('App/Models/File')
const Helpers = use('Helpers')

class FileController {
  /**
   * Create/save a new file.
   * POST files
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    try {
      if (!request.file('file')) return

      const upload = request.file('file', { size: '2mb' })

      const filename = `${Date.now()}.${upload.subtype}`

      await upload.move(Helpers.tmpPath('uploads'), {
        name: filename,
      })

      if (!upload.moved()) throw upload.error()

      const file = File.create({
        file: filename,
        name: upload.clientName,
        type: upload.type,
        subtype: upload.subtype,
      })

      return file
    } catch (error) {
      response
        .status(error.status)
        .send({ error: { message: 'Erro no upload de arquivos' } })
    }
  }
}

module.exports = FileController
