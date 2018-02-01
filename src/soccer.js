var league = {
    tempLeague: [],
    sortedLeague: [],
    manualLeague: []
};

// used for sorting comparisons
var cache = {
    team: null,
    points: 0,
    goalDiff: 0,
    goalsScored: 0
}


/*HELPER FUNCTIONS*/


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
    }
}

function cacheReset() {

    cache.team = null;
    cache.points = 0;
    cache.goalDiff = 0;
    cache.goalsScored = 0;
}


/*API FUNCTIONS*/


function addTeam(team, position) {
    // logic for manual positioning
    if (arguments > 1) {
        // manual position logic to go here...
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

function sort() {
    
    var sorted = league.sortedLeague;
    var temp = league.tempLeague;
    
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
