

const XLSX = require('xlsx');
const fs = require('fs');
const Docxtemplater = require('docxtemplater');
const path = require('path');

const scriptDirectory = __dirname; // Get the directory of the current script
const sheetFile       = path.join(scriptDirectory,'cb_experiment_id.xlsx')
// Load the Excel file
const workbook = XLSX.readFile(sheetFile); // Replace 'cb_id_sheet.xlsx' with the path to your Excel file

// Assume the data is in the first sheet of the workbook
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Define the list variable to store the values from the first column
const ids = {};

ids.sub_id      = []
ids.teacher_id  = []
ids.district_id = []
ids.cbpasssage  = []
ids.cbspacing   = []
ids.cbtime      = []
// Loop through the worksheet to extract values from the first column
for (let rowIndex = 2; rowIndex < 77; rowIndex++) {
  const id_cell             = worksheet[`B${rowIndex}`]; // Assuming the values are in column A (adjust as needed)
  const districtid_cell     = worksheet[`C${rowIndex}`];
  const teacherid_cell      = worksheet[`D${rowIndex}`];  
  const cbpas_cell          = worksheet[`F${rowIndex}`];
  const cbspa_cell          = worksheet[`G${rowIndex}`];
  const cbtim_cell          = worksheet[`H${rowIndex}`];
  if (!id_cell || !id_cell.v) {
    // Break when there are no more values in the first column
    continue;
  }

  ids["sub_id"].push(id_cell.v);
  ids["district_id"].push(districtid_cell.v);
  ids["teacher_id"].push(teacherid_cell.v);  
  ids["cbpasssage"].push(cbpas_cell.v);
  ids["cbspacing"].push(cbspa_cell.v);
  ids["cbtime"].push(cbtim_cell.v);

}


// console.log(ids["sub_id"]);
// console.log(ids["teacher_id"]);
// console.log(ids["cbpasssage"]);
// Output the list of IDs
// for (const curid of ids){
//     console.log(curid);
// }


var shelves = {}
ch_list = {}
ch_attemptRegistry = {}
ch_fitClashRegistry = {} 
ch_experimentRegistry = {}
ch_performanceRegistry = {}

for (var i = 0; i < ids["sub_id"].length; i++){
  ch_list[ids["sub_id"][i]]                 = {"teacherID": ids["teacher_id"][i],"districtID": ids["district_id"][i],"counterbalance_group": [ids["cbpasssage"][i],ids["cbspacing"][i],ids["cbtime"][i]]}
  ch_attemptRegistry[ids["sub_id"][i]]      = [0,0,0]
  ch_fitClashRegistry[ids["sub_id"][i]]     = [{"fit": [], "clash": [] }, {"fit": [], "clash": [] } ]
  ch_experimentRegistry[ids["sub_id"][i]]   = {"name": "none","t1_status": "notStarted","t1_leftTrial": 0, "t1_trialOrder" : [[],[],[]],"t2_status": "notStarted","t2_leftTrial": 0, "t2_trialOrder" : [[],[],[]],"t3_status": "notStarted","t3_leftTrial": 0,"t3_trialOrder" : [[],[],[]],"completionDates": ["undefined","undefined","undefined"]}
  ch_performanceRegistry[ids["sub_id"][i]]  = [
      {
        "sp1": { "setid": [], "wpm": [], "accuracy": [] },
        "sp2": { "setid": [], "wpm": [], "accuracy": [] },
        "sp3": { "setid": [], "wpm": [], "accuracy": [] }
      },
      {
        "sp1": { "setid": [], "wpm": [], "accuracy": [] },
        "sp2": { "setid": [], "wpm": [], "accuracy": [] },
        "sp3": { "setid": [], "wpm": [], "accuracy": [] }
      }
    ]

}


// console.log("ID LIST")
// console.log(JSON.stringify(ch_list))
// console.log("\nATTEMPT REGISTRY")
// console.log(JSON.stringify(ch_attemptRegistry))
// console.log("\nFIT CLASH REGISTRY")
// console.log(JSON.stringify(ch_fitClashRegistry))
// console.log("\nEXPERIMENT REGISTRY")
// console.log(JSON.stringify(ch_experimentRegistry))
// console.log("\nPERFORMANCE REGISTRY")
// console.log(JSON.stringify(ch_performanceRegistry))


shelves["list"] = ch_list
shelves["experimentRegistry"] = ch_experimentRegistry
shelves["performanceRegistry"] = ch_performanceRegistry
shelves["fitClashRegistry"] = ch_fitClashRegistry
shelves["attemptRegistry"] = ch_attemptRegistry

console.log('++++++++++++++++++++++\n\n')
var shelf_names = Object.keys(shelves)


// initialize months as a vector for date save
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
// initialize date variable for retrieving month info
const d = new Date();
// get day of the month (1-31)
currentDay = d.getDate()
// get month of the year as text ("april" etc.)
currentMonth = months[d.getMonth()];
// get current year
currentYear = d.getFullYear()


const folderName = currentDay.toString()+currentMonth+currentYear.toString()



for (currentShelf of shelf_names){
        
  shelfPath = '.\\generate_ids\\generated_shelves\\'+folderName+'\\'
  // generate the folder for this date if it does not exists
  if (!fs.existsSync(shelfPath)){
    fs.mkdirSync(shelfPath);  }
  filePath = shelfPath + 'added_' + currentShelf +'.json'

  currentWrittenShelf = JSON.stringify(shelves[currentShelf])
  // Write the JSON string to a file named 'user.json'
  fs.writeFile(filePath, currentWrittenShelf, (err) => {
      if (err) {
          throw err;
      }
      
  });
  
  console.log(currentShelf + ' shelf is saved as ' + 'added_'+ currentShelf +'.json in '+folderName+' folder\n');

}

