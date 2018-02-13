(function(root) {
    'use strict';
    
    // table data cache 
    var tableState = {};
    
    // api object 
    var lib = {};
    lib.league = [];
    
    // defaults for renderLeague()
    var leagueDefaults = {
        leagueName: 'League',
        dropdown: false,
        zones: false
    };
    
    // default properties for addTeam() and updateTeam()
    var defaultTeamProps = ['name', 'gp', 'w', 'd', 'l', 'gs', 'a', 'gd', 'pts'];


    /*-------------Helper Functions------------*/


    function goalDiffCheck(a, b) {
        if (a.gd !== b.gd) {
            return b.gd - a.gd;
        } else {
            // if goal difference is equal then sort by total goals scored
            return goalsScoredCheck(a, b);
        }
    }


    function goalsScoredCheck(a, b) {
        if (a.gs !== b.gs) {
            return b.gs - a.gs;
        } else {
            // if total goals scored are equal, then sort alphabetically
            return alphabeticalCheck(a, b);
        }
    }


    function alphabeticalCheck(a, b) {
        return b.name.toLowerCase() < a.name.toLowerCase();
    }


    function nodeLikeToArray(nodeLike) {
        var arr = [].slice.apply(nodeLike);
        return arr;
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
        var zones = document.querySelectorAll('#zone');
        var zonesArr = nodeLikeToArray(zones);
        // set id for zones
        zonesArr.forEach(function(zone) {
            zone.id = 'zoneReverse';
        });
    }


    function setArrowDirection() { 
        // set direction depending on reverse state
        if (tableState.reversed) {
            return '&#9653';
        } else {
            return '&#9663';    
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


    function validateProps(data) {
        var propsValid = true;
        var dataProps = Object.getOwnPropertyNames(data);

        // check defaults against data props
        dataProps.forEach(function(prop) {
            if (defaultTeamProps.indexOf(prop) === -1) {
                propsValid = false;
            } 
        });

        if (!propsValid || dataProps.length !== defaultTeamProps.length) {
            throw new Error('Incorrect team property format passed.');
        }
    }
    
    
    function validateTableData(data) {
        for(var prop in data) {
            if (leagueDefaults.hasOwnProperty(prop)) {
                leagueDefaults[prop] = data[prop];
            }
        }
    }
    
    
    function checkForTable() {
        if (document.querySelector('.league-table table')) {
            // if table is present then re-render
            lib.renderLeague();
        }
    }
    
    
    function setToggleArrowDirection(toggleArrow, data) {
        if (tableState.toggleState === 'show' && !data) { // 'data' represents table creation
            toggleArrow.classList.remove('toggle-arrow-default');
            toggleArrow.classList.add('toggle-arrow-collapse');
        } else {
            toggleArrow.classList.add('toggle-arrow-default');
        }
    }


    function createDropdown(data) {
        var container = document.querySelector('.league-table table');
        var toggleRow = document.createElement('tr');
        container.appendChild(toggleRow);

        var toggleTd = document.createElement('td');
        // td to span all table columns
        toggleTd.setAttribute('colspan', '10');
        var toggleDiv = document.createElement('div');
        // set toggle div class
        toggleDiv.setAttribute('class', 'toggle');

        var toggleArrow = document.createElement('div');
        
        setToggleArrowDirection(toggleArrow, data);
        
        toggleDiv.appendChild(toggleArrow);
        toggleTd.appendChild(toggleDiv);
        toggleRow.appendChild(toggleTd);
        // set toggle arrow click event listener
        toggleArrow.addEventListener('click', dropdownToggle);
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
        var toggleArrow = document.querySelector('.toggle div');
        var hidden = document.querySelectorAll('.hide-team');
        // show or hide teams depending on whether we are currently hiding teams
        if (hidden.length) {
            showTeams();
            // change arrow direction
            toggleArrow.classList.remove('toggle-arrow-default');
            toggleArrow.classList.add('toggle-arrow-collapse');
        } else {
            hideTeams();
            // change arrow direction
            toggleArrow.classList.remove('toggle-arrow-collapse');
            toggleArrow.classList.add('toggle-arrow-default');
        }
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


    function formatGoalDiff(team) {
        var plusFormat = '+' + team.gd;
        // prepend correct '+' or '-' symbols to goal difference 
        if (team.gd > 0) {
            team.gd = team.gd.toString().replace(/\s+/g, '').replace(/^\d+/, plusFormat);
        } else if (team.gd < 0) {
            team.gd = team.gd.toString().replace(/\s+/g, '');
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
                abbrEl.innerHTML = headName + arrowUniCode;
                
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
            formatGoalDiff(team);

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
        // check whether array
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
                    teamRow.id = 'zone';
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
        
        if (!tableState.override) {
            lib.sort();   
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
     * Takes an array of object(s)
     * Adds team(s) to the league array and auto-updates table if already rendered
     * Throws error if array is not passed, if team props are incorrect, or team name already exists 
     * Returns league array
     * @param {Array} team
     */
    lib.addTeam = function(team) {
        arrayCheck(team); 
        tableState.override = false;
        
        // iterate over array and validate team obj(s)
        team.forEach(function(team) {
            var duplicate = checkName(team); 
            if (duplicate) {
                throw new Error('Team name already exists.');
            }
            validateProps(team);
            lib.league.push(team);
        });
        
        checkForTable();
        return lib.league;
    };
    
    /**
     * Sorts league array containing unsorted teams
     * Teams are sorted by points first. If points are equal then by goal difference,
     * if goal difference is equal then by total goals scored. If goals scored are equal
     * then teams are sorted alphabetically
     * Returns sorted league array
     */
    lib.sort = function() {
        tableState.override = false;
        
        lib.league.sort(function(a, b) {
            // sort teams in descending order (by default) by points
            if (a.pts !== b.pts) {
                return b.pts - a.pts;
            } else {
                // if points are equal then sort by goal difference
                return goalDiffCheck(a, b);
            }
        });
        
        addPositions();
        
        if (tableState.reversed) {
            // if reveresed state is true, then we reverse the sorted league
            lib.league.reverse();
        }
        
        return lib.league;
    };
    
    /**
     * Takes a string for team name and an object for team values to be updated
     * Updates individual team values
     * Updates can be applied to single or multiple team values
     * Throws error if team name already exists, or incorrect team property supplied 
     * Returns sorted league array
     * @param {String} name
     * @param {Object} data
     
     * To-do: allow multiple teams to be updated at once
     */
    lib.updateTeam = function(name, data) {
        var teamName = checkName(name);

        // if team name not present throw error
        if (!teamName) {
            throw new Error('Team name does not exist.');
        }

        // find specifed team 
        var teamToUpdate = lib.league.filter(function(sortedTeam) {
            return sortedTeam.name === name;
        })[0];
        
        tableState.override = false;
        var dataPropNames = Object.getOwnPropertyNames(data);
        var teamToUpdatePropNames = Object.getOwnPropertyNames(teamToUpdate);
        // update team data
        teamToUpdatePropNames.forEach(function(teamProp) {
            dataPropNames.forEach(function(dataProp) {
                if (dataProp === teamProp) {
                    teamToUpdate[dataProp] = data[dataProp];
                // if prop provided is invalid, then throw error
                } else if (teamToUpdatePropNames.indexOf(dataProp) === -1) {
                    throw new Error('Incorrect team property format passed.');
                }
            });
        });
        
        checkForTable();
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
        
        checkForTable();
        return lib.league;
    };
    
    /**
     * Swaps two specified teams and re-renders league, overriding sort mechanism
     * Positions should be an array of 2 numbers representing the team positions that
     * are to be swapped
     * Teams can be swapped even if table is reversed
     * Swapped teams are revereted back to original sorted state once any updates to the
     * league are made
     * Throws error if array is not passed
     * Returns sorted league array
     * @param {Array} positions
     */
    lib.override = function(positions) {
        arrayCheck(positions);
        tableState.override = true;
        var pos1 = {};
        var pos2 = {};
        
        // add positions if not present
        if (!checkForPositions()) {
            addPositions();  
        } 
        // store teams to be swapped, store index, and set new position value
        lib.league.forEach(function(team, index) {
            if (positions[0] === team.position) {
                team.position = positions[1];
                pos1.index = index;
                pos1.team = team;  
            } else if (positions[1] === team.position) {
                team.position = positions[0];
                pos2.index = index;
                pos2.team = team;  
            }
        });
        // swap teams
        lib.league.forEach(function(team, index, arr) {
            if (index === pos1.index) {
                arr[index] = pos2.team;
            } else if (index === pos2.index) {
                arr[index] = pos1.team;
            } 
        });
        
        checkForTable();
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