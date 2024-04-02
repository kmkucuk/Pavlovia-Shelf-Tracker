
const fs = require('fs');

shelf_names = ['list','experimentRegistry','performanceRegistry','fitClashRegistry','attemptRegistry']

var shelves = {}
var added_shelves = {}


// IMPORTANT INFO ABOUT PATHING
// path for "require" (to load json) does not need the path of the parent folder (i.e. check_overlapping_ids)
// however, paths for creating another folder requires the name of the parent folder in the path 


for (currentShelf of shelf_names){
    // console.log(currentShelf)
    shelfPath = '.\\existing_shelves\\' + currentShelf +'.json'
    shelves[currentShelf] = require(shelfPath)
    // console.log(shelves[currentShelf])

    shelfPath = '.\\added_shelves\\added_' + currentShelf +'.json'
    added_shelves[currentShelf] = require(shelfPath)
}




// loop over keys to find if one of added IDs exist in existing shelves
var match_object = {}

// noOverlap variable used for identifying if there is "any" overlap in 
// ID names between added and existing shelves. 

// If there are no overlaps, code continues and creates the combined shelves
noOverlap = 1


var overlappindParticipants = []
for (currentShelf of shelf_names){
    
    existing_ids = Object.keys(shelves[currentShelf])
    added_ids    = Object.keys(added_shelves[currentShelf])


    for (currentID of added_ids){


        if (!Object.keys(match_object).includes(currentID)){

            match_object[currentID] = {}

        }
            

        if (existing_ids.includes(currentID)){

            match_object[currentID][currentShelf] = "overlap"
            overlappindParticipants.push(currentID)
            noOverlap = 0
        } else {

            match_object[currentID][currentShelf] = "good"

        }
            

    }

}



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


var combined_shelves = {} 


Object.assign(combined_shelves,shelves)

// console.log(combined_shelves)

// if there was no overlap, merge existing and added shelves here
if (noOverlap){
    // combine existing and added shelves using deep merge function    

    for (currentShelf of shelf_names){

        Object.assign(combined_shelves[currentShelf],added_shelves[currentShelf])
        
        console.log(combined_shelves)
        console.log(combined_shelves[currentShelf])
        
        shelfPath = '.\\check_overlapping_ids\\combined_shelves\\'+folderName+'\\'

        // generate the folder for this date if it does not exists
        if (!fs.existsSync(shelfPath)){
            fs.mkdirSync(shelfPath);  }

        // turn shelf object into string for writing
        writtenShelf = JSON.stringify(combined_shelves[currentShelf])
        // create the full file path for writing
        filePath = shelfPath + 'combined_' + currentShelf +'.json'
        // Write the JSON string 
        fs.writeFile(filePath, writtenShelf, (err) => {
            if (err) {
                throw err;
            }
            
        });
        console.log(currentShelf + ' shelf is saved as ' + 'combined_'+ currentShelf +'.json in '+folderName+' folder\n');
    }


} else {
    // throw an error due to overlap in IDs
    console.error('Shelf merge failed due to overlap, check .csv file for the following overlapping IDs:');
    // print out overlapping IDs just once 
    console.error(JSON.stringify(...new Set(overlappindParticipants)))

}
