const fs = require('fs'),
    _now = require('performance-now');
    es = require('event-stream'),
    { parse } = require('csv-parse'),
    iconv = require('iconv-lite') // convert pure js character https://www.npmjs.com/package/iconv-lite

const DEFAULT_CHUNK_SIZE = 9999

const start = _now()
console.time('line count')

class CSVFastParser {
  constructor(filePath, chunkSize) {
    this.reader = fs.createReadStream(filePath).pipe(iconv.decodeStream('utf8'))
    this.chunkSize = chunkSize || DEFAULT_CHUNK_SIZE
    this.totalLines = 0
    this.data = []
    this.parseOptions = {trim: true, escape: '/'}
  }

  read(callback) {
    this.reader
      .pipe(es.split())
      .pipe(es.mapSync(line => {
        ++this.totalLines

        parse(line, this.parseOptions, (err, data) => {
            if (err) console.error(err)
            else this.data.push(data[0])
        })

        if (this.totalLines % this.chunkSize === 0) {
          callback(this.data)
        }
      })
      .on('error', (error) => {
          console.log('Error while reading file.')
          console.error(error)
      })
      .on('end', () => {
          console.log('Read entirefile.')
          const end = _now()
          console.log(this.totalLines)
          console.timeEnd('line count')
          console.log(
            `performance on parsing timing: ` + (end - start).toFixed(3) + `ms`,
          )
      }))
  }

  continue() {
    this.data = []
    this.reader.resume()
  }
}

module.exports = CSVFastParser