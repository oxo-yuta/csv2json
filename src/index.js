const { Command } = require('commander');
const createObjectCsvWriter = require('csv-writer').createObjectCsvWriter;

const program = new Command();
program.version('0.0.1');

program
  .version('0.0.1', '-v, --version')
  .argument('<csvFilePath>', 'path to input CSV file')
  .argument('[outPutPath]', 'path to output JSON file. If not provided, it will create a same named JSON file')
  .action(async (csvFilePath, outPutPath) => {
    createJson(csvFilePath, outPutPath)
  })
  .addHelpText('after', `

Example call:
  $ npm start input.csv output.json`)
  .parse(process.argv)

async function createJson(csvFilePath, outPutPath){
  const csv = require('csvtojson')
  const jsonArray = await csv().fromFile(csvFilePath)
  for(const data of jsonArray) {
    data.json = JSON.stringify(data)
  }
  const fs = require('fs')
  if (!outPutPath){
    const split_path = csvFilePath.match(/(.*\/)?(.*?)\.(\w+)?/)
    outPutPath = ""
    if(split_path[1]) {
      outPutPath += split_path[1] + '/'
    }
    outPutPath += split_path[2] + '_json.csv'
  }
  const res = await createCSV(jsonArray, outPutPath)
  console.log( `OUTPUT: ${res}` )
}

async function createCSV(data, csvFilePath) {
  const csvWriter2 = createObjectCsvWriter({
    path: csvFilePath,
    header: Object.keys(data[0]).map(v => ({ id: v, title: v }))
  })
  await csvWriter2.writeRecords(data)
  return csvFilePath
}
