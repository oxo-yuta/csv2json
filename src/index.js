const { Command } = require('commander');
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
  const jsonArray=await csv().fromFile(csvFilePath)
  const fs = require('fs')
  if (!outPutPath){
    const split_path = csvFilePath.match(/(.*\/)?(.*?)\.(\w+)?/)
    outPutPath = ""
    if(split_path[1]) {
      outPutPath += split_path[1] + '/'
    }
    outPutPath += split_path[2] + '.json'
  }
  fs.writeFile(outPutPath, JSON.stringify(jsonArray, null, '    '), (err) => {
    if (err) throw err;
    console.log('Done')
  })
}
