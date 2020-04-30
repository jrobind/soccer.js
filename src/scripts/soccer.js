(function(root) {
    'use strict';
    
    // table data cache 
    var tableState = {};
    
    // api object 
    var lib = {};
    // league store
    lib.league = [];
    
    // defaults for renderLeague()
    var leagueDefaults = {
        leagueName: 'League',
        dropdown: false,
        zones: false
    };
    

    /*-------------Helper Functions------------*/


    function goalDiffCheck(a, b) {
        if (a.goalDiff !== b.goalDiff) {
            return b.goalDiff - a.goalDiff;
        } else {
            // if goal difference is equal then sort by total goals scored
            return goalsScoredCheck(a, b);
        }
    }


    function goalsScoredCheck(a, b) {
        if (a.scored !== b.scored) {
            return b.scored - a.scored;
        } else {
            // if total goals scored are equal, then sort alphabetically
            return alphabeticalCheck(a, b);
        }
    }


    function alphabeticalCheck(a, b) {
        return b.name.toLowerCase() < a.name.toLowerCase();
    }


    function nodeLikeToArray(nodeLike) {
        return [].slice.apply(nodeLike);
    } 


    function addPositions() {
        // add league position to each team
        lib.league.forEach(function(team, index) {
                team.position = index + 1;   
        });
    }
    
    
    function checkForPositions() {
        // check if teams have position property
        return lib.league.some(function(team) {
            return team.position;
        });
    }
    
    
    function reverseSetup() {
        var reverseArrow = document.querySelector('#reverseTable');
        reverseArrow.addEventListener('click', reverseTable);
    }


    function reverseTable() {
        tableState.reversed = !tableState.reversed;
        // reverse the league array team order
        lib.league.reverse();
        lib.renderLeague(); 
    }


    function reverseZones() {
        var zones = document.querySelectorAll('.zone');
        var zonesArr = nodeLikeToArray(zones);
        // set id for zones
        zonesArr.forEach(function(zone) {
            zone.classList.remove('zone');
            zone.classList.add('zone-reverse');
        });
    }


    function setArrowDirection() { 
        // set direction depending on reverse state
        if (tableState.reversed) {
            return '&#9650';
        } else {
            return '&#9660';    
        }
    }
    
    function arrayCheck(val) {
        if (!Array.isArray(val)) {
            throw new Error('Invalid argument. Data must be passed within an array.');
        }
    }


    function checkName(team) {
        var name = typeof team === 'string' ? team : team.name;

        // check whether team name already exits
        var duplicate = lib.league.map(function(team) {
            return team.name;
        }).filter(function(sortedName) {
            return sortedName === name;
        });

        return Boolean(duplicate.length); 
    }
    
    
    function validateTableData(data) {
        // if data is passed then set as new values on defaults object
        for (var prop in data) {
            if (leagueDefaults.hasOwnProperty(prop)) {
                leagueDefaults[prop] = data[prop];
            }
        }
    }
    
    
    function validateOverride(toSwap) {
        arrayCheck(toSwap);
        // check number of positions passed
        if (toSwap.length > 2) {
            throw new Error('Only two teams can be swapped at a time.');
        }
    }
    
    
    function findTable() {
        return Boolean(document.querySelector('.league-table table'));
    }
    
    
    function sortAndRenderCheck() {
        if (findTable()) {
            // check our override state
            if (!tableState.override) {
                lib.sort(); 
                lib.renderLeague();
            } else {
                lib.renderLeague();
            }
        } else {
            if (!tableState.override) {
                lib.sort();   
            } 
        }
    }
    
    
    function createToggleIcon(iconContainer) {
        // create 3 divs for icon toggle
        for (var i = 0; i < 3; i++) {
            iconContainer.appendChild(document.createElement('div'));
        }
        return iconContainer;
    }


    function createDropdown(data) {
        var container = document.querySelector('.league-table table');
        var toggleRow = document.createElement('tr');
        container.appendChild(toggleRow);

        var toggleTd = document.createElement('td');
        // td to span all table columns
        toggleTd.setAttribute('colspan', '10');
        var toggleContainer = document.createElement('div');
        // set toggle div class
        toggleContainer.setAttribute('class', 'toggle');
        
        createToggleIcon(toggleContainer);
        
        toggleTd.appendChild(toggleContainer);
        toggleRow.appendChild(toggleTd);
        
        // set toggle arrow click event listener
        toggleContainer.addEventListener('click', dropdownToggle);
    }


    function hideTeams() {
        var teams = document.querySelectorAll('.league-table table tbody tr');
        tableState.toggleState = 'hidden';
        var unHiddenArr = nodeLikeToArray(teams);
        // retrieve teams to hide using dropdown value provided
        var newRows = unHiddenArr.splice(leagueDefaults.dropdown, lib.league.length);
        // hide teams
        newRows.forEach(function(teamRow) {
            teamRow.classList.add('hide-team');
        }); 
    }


    function showTeams() {
        var hidden = document.querySelectorAll('.hide-team');
        tableState.toggleState = 'show';
        var hiddenArr = nodeLikeToArray(hidden);

        // show hidden teams
        hiddenArr.forEach(function(team, index) {
            team.classList.remove('hide-team');
        });   
    }


    function dropdownToggle() {
        var hidden = document.querySelectorAll('.hide-team');
        // show or hide teams depending on whether we are currently hiding teams
        hidden.length ? showTeams() : hideTeams();
    }


    function checkToggleState(data) {
        // if 'data' is true, then we hide specified teams and create dropdown
        if (data) {
            createDropdown(data);
            hideTeams();
        // if user data is undefined then we are not initialising the table
        } else {
            // respect the current toggle state 
            if (tableState.toggleState === 'show') {
                    createDropdown();   
            } else {
                createDropdown();
                hideTeams();
            }
        }
    }


    function addGoalDiffClasses(teamRow) {    
        var tds = nodeLikeToArray(teamRow.cells);
        var gdSpan = tds[8].firstChild;
        var gd = gdSpan.innerText;
        // check goal diff value from td cell and add correct class
        if (gd > 0) {
            gdSpan.classList.add('plus');  
        } else if (gd < 0) {
            gdSpan.classList.add('minus');
        }
    }
    

    function removeLeague() {
        var container = document.querySelector('.league-table');
        var containerChildNodes = nodeLikeToArray(container.childNodes);
        
        containerChildNodes.forEach(function(node) {
            if (node.nodeName === 'TABLE' || node.classList.contains('toggle')) {
                // remove the table element
                node.parentNode.removeChild(node);
            }
        });
    }
    

    function createTableCaption() {
        var container = document.querySelector('.league-table');
        var leagueTable = document.createElement('table');
        var leagueCaption = document.createElement('caption');
        
        // set caption text equal to league name provided
        leagueCaption.innerText = leagueDefaults.leagueName;
        
        container.appendChild(leagueTable);
        leagueTable.appendChild(leagueCaption);
        
        createTableHead(leagueTable);
    }


    function createTableHead(tableEl) {
        var headData = ['Pos', 'Team', 'GP', 'W', 'D', 'L', 'F', 'A', 'GD', 'Pts'];
        
        var tableHead = document.createElement('thead');
        tableEl.appendChild(tableHead);
        var headRow = document.createElement('tr');
        tableHead.appendChild(headRow);

        // create header cells
        headData.forEach(function(headName) {
            var headCell = document.createElement('th');
            var abbrEl = document.createElement('abbr');
            // add reverse html character
            if (headName === 'Pos') {
                // set the reverse arrow direction
                var arrowUniCode = setArrowDirection();
                var arrowSpan = document.createElement('span');
                arrowSpan.innerHTML = arrowUniCode;
                abbrEl.innerText = headName;
                abbrEl.appendChild(arrowSpan);
                
                // add id for reverse functionality
                abbrEl.id = 'reverseTable';
                headCell.appendChild(abbrEl);
                headRow.appendChild(headCell);  
            } else {
                abbrEl.innerText = headName;
                headCell.appendChild(abbrEl);
                headRow.appendChild(headCell);  
            }  
        });

        createTableData(tableEl);
    }


    function createTableData(tableEl) {
        var league = lib.league;

        var tableBody = document.createElement('tbody');
        tableEl.appendChild(tableBody);

        // iterate over each team object and create a table row with relevant team data 
        league.forEach(function(team) {
            var dataArr = [];
            var teamRow = document.createElement('tr');
            
            // set team position as data attr on table row
            teamRow.setAttribute('data', team.position);
            tableBody.appendChild(teamRow);
            // push team data to temp array
            for (var prop in team) {
                if (team.hasOwnProperty(prop)) {
                    dataArr.push(team[prop]);
                }
            }
            // place team position at front of temp array (for column headings)
            var teamPos = dataArr[9];
            dataArr.splice(9, 1);
            dataArr.unshift(teamPos);

            // iterate over temp array and create standard table cells for team data and append to team row
            dataArr.forEach(function(teamData) {
                var standardCell = document.createElement('td');
                var dataSpan = document.createElement('span');
                dataSpan.innerText = teamData;
                standardCell.appendChild(dataSpan);
                teamRow.appendChild(standardCell);
            });

            addGoalDiffClasses(teamRow);
        });
    }

    
    function addZones() {
        var zonePosition = leagueDefaults.zones;
        arrayCheck(zonePosition);
        // store current number of positions on table
        var totalPos = document.querySelectorAll('.league-table tbody tr').length;
        
        // check that zone positions are within a valid range
        zonePosition.forEach(function(zone) {
            if (zone > totalPos || zone < 0) {
                throw new Error('Zone positions are not within valid team range.');
            }
        });

        var numOfTeamsNode = document.querySelectorAll('.league-table table tbody tr');
        var numOfTeamsArr = nodeLikeToArray(numOfTeamsNode);
        // set id on correct team rows
        zonePosition.forEach(function(zone) {
            numOfTeamsArr.forEach(function(teamRow) {
                var position = Number(teamRow.getAttribute('data'));
                
                if (position === zone) {
                    teamRow.classList.add('zone');
                }    
            });
        });
        // if in reversed state we need to reverse zone classes
        if (tableState.reversed) {
            if (leagueDefaults.zones) {
                reverseZones();
            }   
        }
    }


    /*------------API Methods------------*/

    
    /**
     * Renders a league table
     * Takes an optional table data object
     * Depending on data passed, the table may be rendered with a dropdown and/or league zones
     * If no data is passed, then default table values will be used
     * @param {Object} [data]
     */
    lib.renderLeague = function(data) {
        if (data) {
            tableState.override = false;
            // validate the table data
            validateTableData(data);
        }
        
        removeLeague();
        createTableCaption();
        reverseSetup();
        // check wether we need to create dropdown toggle
        if (leagueDefaults.dropdown) {
            checkToggleState(data);
        }
        // check whether we need to add zones
        if (leagueDefaults.zones.length) {
            addZones();
        }
    };

    /**
     * Takes an array of strings
     * Adds team(s) to the league array and auto-updates table if already rendered
     * Throws error if array is not passed, or team name already exists 
     * Returns sorted league array
     * @param {Array} teams
     */
    lib.addTeam = function(teams) {
        arrayCheck(teams); 
        tableState.override = false;
        // iterate over names and create team obj(s)
        teams.forEach(function(team, index, arr) {
            if (checkName(team)) {
                throw new Error('Team name already exists.');    
            }
            
            arr[index] = {
                name: team,
                played: 0,
                won: 0,
                drawn: 0,
                lost: 0,
                scored: 0,
                conceded: 0,
                goalDiff: 0,
                points: 0
            }
            
            lib.league.push(arr[index]);
        });

        sortAndRenderCheck();
        return lib.league;
    };
    
    /**
     * Sorts league array and adds league positions to team objects once sorted 
     * Teams are sorted by points first. If points are equal then by goal difference,
     * if goal difference is equal then by total goals scored. If goals scored are equal
     * then teams are sorted alphabetically
     * Returns sorted league array
     */
    lib.sort = function() {
        tableState.override = false;
        
        lib.league.sort(function(a, b) {
            // sort teams in descending order (by default) by points
            if (a.points !== b.points) {
                return b.points - a.points;
            } else {
                // if points are equal then sort by goal difference
                return goalDiffCheck(a, b);
            }
        });
        
        addPositions();
        
        if (tableState.reversed) {
            lib.league.reverse();
        }
        
        // if table is rendered we need to re-render the table
        if (findTable()) {
            lib.renderLeague();
        }
        
        return lib.league;
    };
    
    /**
     * Takes an array of objects representing teams to update
     * Object must contain correct team name
     * Updates individual team values
     * Updates can be applied to single or multiple team values
     * Throws error if team name already exists, or incorrect team property supplied 
     * Returns sorted league array
     * @param {Array} data
     */
    lib.updateTeam = function(data) {
        arrayCheck(data);
        
        data.forEach(function(team) {
            var teamName = checkName(team);

            // if team name not present throw error
            if (!teamName) {
                throw new Error('Team name does not exist.');
            }
            // find team object to update 
            var teamToUpdate = lib.league.filter(function(sortedTeam) {
                return sortedTeam.name === team.name;
            })[0];
            // set goal difference
            !team.scored ? team.scored = 0 : team.scored = team.scored;
            !team.conceded ? team.conceded = 0 : team.conceded = team.conceded;
            teamToUpdate.goalDiff = team.scored - team.conceded;
            
             // update team data
                for (var prop in team) {
                    if (teamToUpdate.hasOwnProperty(prop)) {
                        teamToUpdate[prop] = team[prop];
                    } else {
                        throw new Error('Incorrect team property format passed.');
                    }
                }
        });
        
        tableState.override = false;
        sortAndRenderCheck();
        return lib.league;
    };

    /**
     * Removes individual teams
     * Throws error if team name does not exist
     * Returns sorted league array
     * @param {String} name
     */
    lib.deleteTeam = function(name) {
        var teamName = checkName(name);
        // if team name not present throw error
        if (!teamName) {
            throw new Error('Team name does not exist.');
        }
        tableState.override = false;
        var deleteIndex;
        var nameEdited = name.toLowerCase();

        lib.league.forEach(function(sortedTeam, index) {
            if (sortedTeam.name.toLowerCase() === nameEdited) {
                deleteIndex = index;
            }
        });
        // remove team from the league
        lib.league.splice(deleteIndex, 1);
        
        sortAndRenderCheck();
        return lib.league;
    };
    
    /**
     * Swaps two specified teams and re-renders league, overriding sort mechanism
     * Positions should be an array of 2 numbers representing the team positions
     * to be swapped
     * Teams can be swapped even if table is reversed
     * Swapped teams are revereted back to original sorted state once any updates to the
     * league are made
     * Throws error if array is not passed
     * Returns unsorted league array
     * @param {Array} toSwap
     */
    lib.override = function(toSwap) {
        tableState.override = true;
        validateOverride(toSwap);
        
        var swap1 = {};
        var swap2 = {};
        
        // add positions if not present
        if (!checkForPositions()) {
            addPositions();  
        }
        // check positions passed are valid
        var valid = lib.league.filter(function(team) {
            return toSwap[0] === team.position || toSwap[1] === team.position;
        });
        
        if (valid.length !== 2) {
            throw new Error('Invalid team position(s).');
        }
        // store teams to be swapped, store index, and set new position value
        lib.league.forEach(function(team, index) {
            if (toSwap[0] === team.position) {
                team.position = toSwap[1];
                swap1.index = index;
                swap1.team = team;  
            } else if (toSwap[1] === team.position) {
                team.position = toSwap[0];
                swap2.index = index;
                swap2.team = team;  
            }
        });
        // swap teams
        lib.league.forEach(function(team, index, arr) {
            if (index === swap1.index) {
                arr[index] = swap2.team;
            } else if (index === swap2.index) {
                arr[index] = swap1.team;
            } 
        });
        
        sortAndRenderCheck();
        return lib.league;
    };
    
    
    /*-------------Module Definition------------*/
    
    
    // support for AMD
    if (typeof root.define === 'function' && define.amd) {
        
        root.define('soccer',[], function () {
            return lib;
        });
        
    } else {
        // add 'soccer' to the global object
        root.soccer = lib;           
    }

}(this));