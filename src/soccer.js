var league = {
    tempLeague: [],
    sortedLeague: [],
    positionedManually: false
};

// used for sorting comparisons
var cache = {
    team: null,
    points: 0,
    goalDiff: 0,
    goalsScored: 0
}


/*-------------HELPER FUNCTIONS------------*/


function updateCache(team) {
    cache.team = team;
    cache.points = team.points;
    cache.goalDiff = team.goalDiff;
    cache.goalsScored = team.goalsScored;
}


function goalDifferenceCheck(team) {
    if (team.goalDiff > cache.goalDiff) {
        updateCache(team);
    } else if (team.goalDiff === cache.goalDiff) {
        // unlikely edge case - but still possible so check the goals scored
        goalsScoredCheck(team);
    }
}


function goalsScoredCheck(team) {
    if (team.goalsScored > cache.goalsScored) {
        updateCache(team);
    } else if (team.goalsScored === cache.goalsScored) {
        // sort the teams alphabetically - extreme edge case during the season but useful for the start when no games have been played
        sortAlphabetically(team, cache.team);
    } 
}


function sortAlphabetically(team, cacheTeam) {
    if (team.name.toLowerCase() < cacheTeam.name.toLowerCase()) {
        updateCache(team);
    }
}


function cacheReset() {
    cache.team = null;
    cache.points = 0;
    cache.goalDiff = 0;
    cache.goalsScored = 0;
}


function addPositions(sorted) {
    // add league position to each team object
    sorted.forEach(function(team, index) {
       team['position'] = index + 1;
    });
    
    console.log(sorted);
}


function sortWithZeroPoints(zeroTeams) {
    // push all team names to temp array then sort
    var sortedZeroTeams = zeroTeams.map(function(team) {
        return team.name.toLowerCase();
    }).sort();
    
    // now sort the team objects
    sortedZeroTeams.forEach(function(teamName, index) {
        zeroTeams.forEach(function(team) {
            if (teamName === team.name.toLowerCase()) {
                sortedZeroTeams[index] = team;
            }
        });
    });
    
    // remove sorted zero point teams from tempLeague array
    sortedZeroTeams.forEach(function(zeroTeam) {
        league.tempLeague.forEach(function(team, index) {
            if (zeroTeam.name === team.name) {
                league.tempLeague.splice(index, 1);
            }
        });
    });
    
    // sort the remaining tempLeague teams as normal
    sort();
    
    // concat both the sorted zero points teams and the sorted teams with points
    league.sortedLeague = league.sortedLeague.concat(sortedZeroTeams);
    console.log(league.sortedLeague);
}


function positionManually(team, position) {
    // format position in relation to array indexing
    var arrPos = position -1;
    // add position property to the team 
    team['position'] = position;
    
    // add to tempArray but sort by manual position given
    league.sortedLeague[arrPos] = team;
    league.positionedManually = true;
    
    console.log(league.sortedLeague);
}


function createTableHead(tableEl) {
    // cell data for header
    var headData = ['#', 'Team', 'GP', 'W', 'D', 'L', 'F', 'A', 'GD', 'Pts'];
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
        abbrEl.innerText = headName;
        headCell.appendChild(abbrEl);
        // append cells to the head row
        headRow.appendChild(headCell);
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
    
    // add most recent last updated time if we have it
    if (league.lastUpdated) {
        footerTime.innerText = league.lastUpdated;
    }
    // append span to footer cell
    footerCell.appendChild(footerTime);
}


/*------------API FUNCTIONS------------*/


function createLeague(leagueName) {    
    // find table container id and append table element and table caption
    var container = document.querySelector('#leagueTable');
    
    var leagueTable = document.createElement('table');
    var leagueCaption = document.createElement('caption');
    // set caption text
    leagueCaption.innerText = leagueName;
    
    container.appendChild(leagueTable);
    leagueTable.appendChild(leagueCaption)
    
    // create the tablehead
    createTableHead(leagueTable);
    // create the tableFooter
    createTableFooter(leagueTable);
}


function addTeam(team, position) {
    // logic for manual positioning
    if (arguments.length > 1) {
        // team to be positioned manually
        positionManually(team, position);
        return;
    }
        
    var sorted = league.sortedLeague;
    var temp = league.tempLeague;
    
    temp.push(team);
    // check whether we are adding teams to an existing league
    if (sorted.length) {
        league.tempLeague = league.tempLeague.concat(sorted);
        league.sortedLeague.length = 0;
    }
    
    console.log(league);
}


function addLastupdated(date) {
    // format the date
    var dString = date.toGMTString();
    // remove 'GMT' from end of date
    var sliceGmt = dString.slice(0, 25);
    
    // set new date onto the league object
    league['lastUpdated'] = 'Last updated ' + sliceGmt;
    
    console.log(sliceGmt);
}


function sort() {
    var sorted = league.sortedLeague;
    var temp = league.tempLeague;
    var zeroTeams = temp.filter(function(team) {
        return !team.points;
    });
    
    // check for teams with postiion set manually
    if (league.positionedManually) {
        throw new Error('Sort function can only be called when teams have not had their positions manually set.');
    }
    
    if (zeroTeams.length) {
        sortWithZeroPoints(zeroTeams);
        return;
    }
    
    // base case
    if (temp.length === 0) {
        return;
    // recursive case
    } else {
        for (var i = 0; i < temp.length; i ++) {
            if (temp[i].points > cache.points) {
                // update the cache with team data
                updateCache(temp[i]);  
            } else if (temp[i].points === cache.points) {
                // check goal difference
                goalDifferenceCheck(temp[i]);
            }
        }
        
        // match the right team(s) and push to sorted league
        temp.forEach(function(team, index) {
            if (team.name === cache.team.name) {
                sorted.push(team);
                // remove team 
                temp.splice(index, 1);
            }
        });
        
        // reset cache
        cacheReset();

        // recurse until all teams are checked
        sort();
        
        // add positions to teams
        addPositions(league.sortedLeague);
        console.log(league);   
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
    
    console.log(league.sortedLeague);
}


function deleteTeam(name) {
    var deleteIndex;
    
    league.sortedLeague.forEach(function(sortedTeam, index) {
        if (sortedTeam.name === name) {
            deleteIndex = index;
        };
    });
    
    // delete from the league
    league.sortedLeague.splice(deleteIndex, 1);
    
}