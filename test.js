const path = require('path')
const CSVFastParser = require('./parser')

const parser = new CSVFastParser(path.resolve(__dirname, './source/transactions.csv'), 100)

parser.read((data) => {
    // console.log(data)
    // parsing data here
    // keep reading until the end of file
    parser.continue()
})
