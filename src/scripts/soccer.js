var league = {
    sortedLeague: [],
    positionedManually: false,
    reversed: false,
    tableData: {}
};


/*-------------UTILITY FUNCTIONS------------*/


function sort() {
    league.sortedLeague.sort(function(a, b) {
        // sort teams in descending order (by default) by points
        if (a.points !== b.points) {
            return b.points - a.points;
        } else {
            // if points are equal then sort by goal difference
            return goalDiffCheck(a, b);
        }
    });
    
    if (league.reversed) {
        league.sortedLeague.reverse();
    }
    
    // add positions to teams
    addPositions(league.sortedLeague);
}


function goalDiffCheck(a, b) {
    if (a.goalDiff !== b.goalDiff) {
        return b.goalDiff - a.goalDiff;
    } else {
        // if goal difference is equal then sort by total goals scored
        return goalsScoredCheck(a, b);
    }
}


function goalsScoredCheck(a, b) {
    if (a.goalsScored !== b.goalsScored) {
        return b.goalsScored - a.goalsScored;
    } else {
        // if total goals scored is equal then sort alphabetically
        return alphabeticalCheck(a, b);
    }
}


function alphabeticalCheck(a, b) {
    return b.name < a.name;
}


function lastUpdated() {
    var date = new Date();
    // format the date
    var dString = date.toGMTString();
    // remove 'GMT' from end of date
    var sliceGmt = dString.slice(0, 25);
    
    // set new date onto the league object
    return 'Last updated ' + sliceGmt;
}


function addPositions(sorted) {
    // add league position to each team object
    sorted.forEach(function(team, index) {
       team['position'] = index + 1;
    });
}


function reverseSetup() {
    var reverseArrow = document.querySelector('#reverseTable');
    reverseArrow.addEventListener('click', reverseTable);
}


function reverseTable() {
    if (league.reversed) {
        league.reversed = false;
        // reverse the table order
        league.sortedLeague.reverse();
        // re-render
        createLeague();
    } else {
        league.reversed = true;
        // reverse the table order
        league.sortedLeague.reverse();
        // re-render
        createLeague();
    }
}


function removeLeague() {
    var container = document.querySelector('#leagueTable');
    
    var containerChildNodes = [].slice.apply(container.childNodes);
    containerChildNodes.forEach(function(node) {
        if (node.nodeName === 'TABLE') {
            // remove the table element
            node.parentNode.removeChild(node);
        }
    });
}



function storeLeagueData(data) {
    league.tableData['leagueName'] = data.leagueName;
    league.tableData['colTitle'] = data.colTitle;
    league.tableData['footer'] = data.footer;  
    // set default reverse state to false
    league.tableData['reversed'] = false;
}


function createTableHead(tableEl, headLength) {
    var headData;
    // cell data for header
    var headDataAbbr = ['Pos', 'Team', 'GP', 'W', 'D', 'L', 'F', 'A', 'GD', 'Pts'];
    var headDataLng = ['Pos', 'Team', 'Played', 'Won', 'Drawn', 'Lost', 'For', 'Against', 'GD', 'Points'];
    
    // determine the type of header data we need to use
    if (headLength === 'short') {
        headData = headDataAbbr;
    } else {
        headData = headDataLng;
    }
    
    // append table head to table
    var tableHead = document.createElement('thead');
    tableEl.appendChild(tableHead);
    // create the header row
    var headRow = document.createElement('tr');
    tableHead.appendChild(headRow);
    
    // create header cells
    headData.forEach(function(headName) {
        var headCell = document.createElement('th');
        // create abbreviation tag and set inner text
        var abbrEl = document.createElement('abbr');
        // add reverse html character
        if (headName === 'Pos') {
            var arrowUniCode;
            
            if (league.reversed) {
                arrowUniCode = '&#9653';
            } else {
                arrowUniCode = '&#9663';    
            }
            // set arrow icon
            abbrEl.innerHTML = headName + arrowUniCode;
            // add id for reverse functionality
            abbrEl.id = 'reverseTable';
            headCell.appendChild(abbrEl);
            // append cells to the head row
            headRow.appendChild(headCell);  
        } else {
            abbrEl.innerText = headName;
            headCell.appendChild(abbrEl);
            headRow.appendChild(headCell);  
        }  
    });
    
    // create table body and table row data for each team and append to table
    createTableData(tableEl);
}


function createTableData(tableEl) {
    var sorted = league.sortedLeague;
    
    // create table body and append to table
    var tableBody = document.createElement('tbody');
    tableEl.appendChild(tableBody);
    
    // iterate over each team object create a table row with relevant team data 
    sorted.forEach(function(team) {
        var teamRow = document.createElement('tr');
        tableBody.appendChild(teamRow);
        
        var dataArr = [];
        for (var prop in team) {
            dataArr.push(team[prop]);
        }
        // place team position at front of team data array
        var teamPos = dataArr[9];
        dataArr.splice(9, 1);
        dataArr.unshift(teamPos);
        
        // iterate over team data array and create standard table cells for team data and append to team row
        dataArr.forEach(function(teamData) {
            var standardCell = document.createElement('td');
            var dataSpan = document.createElement('span');
            // add team data to span
            dataSpan.innerText = teamData;
            // append data span to standard cell and append cell to team row
            standardCell.appendChild(dataSpan);
            teamRow.appendChild(standardCell);
        });
    });
}

function createTableFooter(leagueTable) {
    var footer = document.createElement('tfoot');
    leagueTable.appendChild(footer);
    // create footer row
    var footerRow = document.createElement('tr');
    footer.appendChild(footerRow);
    // create standard cell for footer row
    var footerCell = document.createElement('td');
    
    // add colspan attribute to ensure footer cell stretches entire table
    footerCell.setAttribute('colspan', '10');
    footerRow.appendChild(footerCell);
    
    // create span for footer row cell
    var footerTime = document.createElement('time');
    
    // add most recent update time
        footerTime.innerText = lastUpdated();
    // append span to footer cell
    footerCell.appendChild(footerTime);
    
    // check if we have zone positions for the table, if so add them
    if (league.zonePositions) {
        addTableZones(league.zonePositions);
    }
}


/*------------API FUNCTIONS------------*/


function createLeague(data) {
    var container = document.querySelector('#leagueTable');
    var leagueTable = document.createElement('table');
    var leagueCaption = document.createElement('caption');
    
    // sort teams
    sort();       
    
    // remove old league if there is one
    removeLeague();
    
    // store table data
    if (data) {
        storeLeagueData(data);
    }
    
    // set caption text
    leagueCaption.innerText = league.tableData.leagueName;
    // append table element and table caption to container div
    container.appendChild(leagueTable);
    leagueTable.appendChild(leagueCaption)
    
    // create the tablehead
    createTableHead(leagueTable, league.tableData.colTitle);
    
    // check if we need to create the tableFooter
    if (league.tableData.footer) {
        createTableFooter(leagueTable);   
    }
    
    // setup reverse listeners and handler
    reverseSetup();
}


function addTeam(team) {
    var sorted = league.sortedLeague;
    
    // throw error if positionOverride() has been used
    if (league.positionedManually) {
        throw new Error('Teams cannot be added once positionOverride() has been called.');
    }
    
    // push team to sorted league array for processing
    sorted.push(team);
    console.log(league.sortedLeague);
    
    // check if table has been rendered - if so, we sort if possible
    if (document.querySelector('#leagueTable table')) {
        createLeague();
    }
}


function positionOverride(positions) {
    var sorted = league.sortedLeague;
    league.positionedManually = true;
    
    var pos1 = positions[0] -1; 
    var pos2 = positions[1] -1; 
    
    // swap team positions
    var tempArr = new Array(sorted.length);
    for (var i = 0; i < sorted.length; i ++) {
        if (i === pos1) {
            tempArr[pos2] = sorted[i];
            // change the teams position property
            sorted[i].position = positions[1];
        } else if (i === pos2) {
            tempArr[pos1] = sorted[i];  
            // change the teams position property
            sorted[i].position = positions[0];
        } else {
            tempArr[i] = sorted[i];
        }
    }
    
    league.sortedLeague = tempArr;
    // re-render the table
    createLeague();
}


function addTableZones(zonePosition) {
    // store zone positons
    league['zonePositions'] = zonePosition;
    
    var zoneArgArray = false;
    // check whether array or number
    if(Array.isArray(zonePosition)) {
        zoneArgArray = true;
    }
    // grab the number of teams in the table
    var numOfTeamsNode = document.querySelectorAll('#leagueTable table tbody tr');
    // convert node like array into array we can work with
    var numOfTeamsArr = [].slice.apply(numOfTeamsNode);
    
    if (!zoneArgArray) {
        // apply zone line to number specified
        var team = zonePosition -1;
        var teamForZone = numOfTeamsArr[team];
        // apply bottom border class on the team row
        teamForZone.classList.add('zone');
    } else {
        // array case
        zonePosition.forEach(function(zone) {
            numOfTeamsArr.forEach(function(teamRow, index) {
                if(zone === index + 1) {
                    teamRow.classList.add('zone');
                }    
            });
        });
    }
}


function updateTeam(name, data) {
    // find team and update with relevant data
    var teamToUpdate = league.sortedLeague.filter(function(sortedTeam) {
        return sortedTeam.name === name;
    })[0];
    
    var dataPropNames = Object.getOwnPropertyNames(data);
    var teamToUpdatePropNames = Object.getOwnPropertyNames(teamToUpdate);
    
    teamToUpdatePropNames.forEach(function(teamProp) {
        dataPropNames.forEach(function(dataProp) {
            if (dataProp === teamProp) {
                teamToUpdate[dataProp] = data[dataProp];
            }
        });
    });
    // re-render the table and sort if we can
    createLeague();
}


function deleteTeam(name) {
    // throw error if positionOverride() has been used
    if (league.positionedManually) {
        throw new Error('Teams cannot be deleted once positionOverride() has been called.');
    }
    
    var deleteIndex;
    var nameEdited = name.toLowerCase();
    
    league.sortedLeague.forEach(function(sortedTeam, index) {
        if (sortedTeam.name.toLowerCase() === nameEdited) {
            deleteIndex = index;
        };
    });
    
    // delete from the league
    league.sortedLeague.splice(deleteIndex, 1);
    // re-render the table
    createLeague();
}








/*----------------------------------------------------*/

function mockData() {
    addTeam({
        name: 'gandalf',
        GP: 15,
        W: 1,
        D: 0,
        L: 4,
        goalsScored: 5,
        A: 4,
        goalDiff: 15,
        points: 29
    })
    
        addTeam({
        name: 'frodo',
        GP: 15,
        W: 1,
        D: 0,
        L: 4,
        goalsScored: 5,
        A: 4,
        goalDiff: 5,
        points: 19
    })
    
        addTeam({
        name: 'aragron',
        GP: 15,
        W: 1,
        D: 0,
        L: 4,
        goalsScored: 5,
        A: 4,
        goalDiff: 5,
        points: 27
    })
    
        addTeam({
        name: 'bilbo',
        GP: 15,
        W: 1,
        D: 0,
        L: 4,
        goalsScored: 5,
        A: 4,
        goalDiff: 5,
        points: 25
    })
    
        addTeam({
        name: 'gimli',
        GP: 15,
        W: 3,
        D: 0,
        L: 4,
        goalsScored: 12,
        A: 4,
        goalDiff: 5,
        points: 7
    })
    
        addTeam({
        name: 'sauron',
        GP: 15,
        W: 1,
        D: 0,
        L: 4,
        goalsScored: 1,
        A: 4,
        goalDiff: 5,
        points: 10
    })
    
        addTeam({
        name: 'merry',
        GP: 15,
        W: 1,
        D: 0,
        L: 4,
        goalsScored: 5,
        A: 4,
        goalDiff: 5,
        points: 11
    })
    
        addTeam({
        name: 'elrond',
        GP: 15,
        W: 1,
        D: 0,
        L: 4,
        goalsScored: 5,
        A: 4,
        goalDiff: 5,
        points: 5
    })
    
        addTeam({
        name: 'mount doom',
        GP: 15,
        W: 1,
        D: 0,
        L: 4,
        goalsScored: 5,
        A: 4,
        goalDiff: 5,
        points: 10
    })
    
        addTeam({
        name: 'white tree',
        GP: 15,
        W: 1,
        D: 0,
        L: 4,
        goalsScored: 5,
        A: 4,
        goalDiff: 5,
        points: 17
    })
        
    createLeague({
        leagueName: 'MOCK LEAGUE',
        colTitle: 'short',
        footer: true
    });
    
}