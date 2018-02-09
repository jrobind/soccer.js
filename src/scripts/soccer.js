(function(root) {
    'use strict'
    
    // table data cache 
    var tableState = {};
    
    // api object 
    var lib = {};
    lib.league = [];
    
    // default object for renderLeague()
    var leagueDefaults = {
        leagueName: 'League',
        dropdown: false,
        zones: false
    }
    
    // default properties for addTeam() and updateTeam()
    var defaultTeamProps = ['name', 'gp', 'w', 'd', 'l', 'gs', 'a', 'gd', 'pts'];


    /*-------------HELPER FUNCTIONS------------*/


    function sort() {
        lib.league.sort(function(a, b) {
            // sort teams in descending order (by default) by points
            if (a.pts !== b.pts) {
                return b.pts - a.pts;
            } else {
                // if points are equal then sort by goal difference
                return goalDiffCheck(a, b);
            }
        });

        addPositions(lib.league);

        // check if the league is reversed
        if (tableState.reversed) {
            lib.league.reverse();
        }
    }


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
            // if total goals scored is equal, then sort alphabetically
            return alphabeticalCheck(a, b);
        }
    }


    function alphabeticalCheck(a, b) {
        return b.name < a.name;
    }


    function nodeLikeToArray(nodeLike) {
        var arr = [].slice.apply(nodeLike);
        return arr;
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
        tableState.reversed = !tableState.reversed;
        // reverse the table order
        lib.league.reverse();
        lib.renderLeague(); 
    }


    function reverseZones() {
        var zones = document.querySelectorAll('#zone');
        var zonesArr = nodeLikeToArray(zones);

        // add reverse zone class
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
        if(!Array.isArray(val)) {
            throw new Error('Invalid argument. Data must be passed within an array.');
        }
    }


    function checkName(team) {
        var name;
        typeof team === 'string' ? name = team : name = team.name;

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

        // check default against data props
        dataProps.forEach(function(prop) {
            if (defaultTeamProps.indexOf(prop) === -1) {
                propsValid = false;
            } 
        });

        if (!propsValid || dataProps.length !== defaultTeamProps.length) {
            throw new Error('Incorrect team property format passed.')
        };
    }
    
    
    function validateTableData(data) {
        for(var prop in data) {
            if (leagueDefaults.hasOwnProperty(prop)) {
                leagueDefaults[prop] = data[prop];
            }
        }
    }
    
    
    function setToggleArrowDirection(toggleArrow, data) {
        if (tableState.toggleState === 'show' && !data) {
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
        // set td to span all table columns
        toggleTd.setAttribute('colspan', '10');
        var toggleDiv = document.createElement('div');
        // set toggle div class
        toggleDiv.setAttribute('class', 'toggle');

        var toggleArrow = document.createElement('div');
        // set arrow direction
        setToggleArrowDirection(toggleArrow, data)
        
        toggleDiv.appendChild(toggleArrow);
        toggleTd.appendChild(toggleDiv);
        toggleRow.appendChild(toggleTd);
        
        toggleArrow.addEventListener('click', dropdownToggle);
    }


    function hideTeams() {
        tableState.toggleState = 'hidden';
        var teams = document.querySelectorAll('.league-table table tbody tr');
        var unHiddenArr = nodeLikeToArray(teams);
        // retrieve teams to hide
        var newRows = unHiddenArr.splice(leagueDefaults.dropdown, lib.league.length);

        // hide team rows
        newRows.forEach(function(teamRow) {
            teamRow.classList.add('hide-team');
        }); 
    }


    function showTeams() {
        tableState.toggleState = 'show';
        var hidden = document.querySelectorAll('.hide-team');
        // transform to array so we can work with it
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
        // if user data is true then we hide specified teams and create dropdown
        if (data) {
            createDropdown(data);
            hideTeams();
        // if user data is undefined then we are not initialising the table
        } else {
            // respect the toggle state 
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

        // prepend correct symbols to goal difference 
        if (team.gd > 0) {
            // remove any uneeded whitespace
            team.gd = team.gd.toString().replace(/\s+/g, '').replace(/^\d+/, plusFormat);
        } else if (team.gd < 0) {
            // remove any uneeded whitespace
            team.gd = team.gd.toString().replace(/\s+/g, '');
        }
    }


    function addGoalDiffClasses(teamRow) {    
        // check goal diff value from td cell
        var tds = nodeLikeToArray(teamRow.cells);
        var gdSpan = tds[8].firstChild;
        var gd = gdSpan.innerText;

        if(gd > 0) {
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

        // set caption text
        leagueCaption.innerText = leagueDefaults.leagueName;
        // append table element and table caption to container div
        container.appendChild(leagueTable);
        leagueTable.appendChild(leagueCaption);

        // create the tablehead
        createTableHead(leagueTable);
    }



    function createTableHead(tableEl) {
        var headData;
        // cell data for header
        var headData = ['Pos', 'Team', 'GP', 'W', 'D', 'L', 'F', 'A', 'GD', 'Pts'];

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
                var arrowUniCode = setArrowDirection();
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
        var sorted = lib.league;

        // create table body and append to table
        var tableBody = document.createElement('tbody');
        tableEl.appendChild(tableBody);

        // iterate over each team object create a table row with relevant team data 
        sorted.forEach(function(team) {
            // format goal difference
            formatGoalDiff(team);

            var teamRow = document.createElement('tr');
            // set team position as data attr on table row
            teamRow.setAttribute('data', team.position);
            tableBody.appendChild(teamRow);

            var dataArr = [];
            for (var prop in team) {
                dataArr.push(team[prop]);
            }
            // place team position at front of team data array (for column headings)
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

            // add goal difference classes
            addGoalDiffClasses(teamRow);
        });
    }

    
    function addZones() {
        var zonePosition = leagueDefaults.zones;
        
        // check whether array
        arrayCheck(zonePosition);
        // current number of positions on table
        var totalPos = document.querySelectorAll('.league-table tbody tr').length;
        
        // throw error if zone positions are not within a valid range
        zonePosition.forEach(function(zone) {
            if (zone > totalPos || zone < 0) {
                throw new Error('Zone positions are not within valid team range.');
            }
        });

        // store zone positons
        tableState['zonePositions'] = zonePosition;

        var numOfTeamsNode = document.querySelectorAll('.league-table table tbody tr');
        var numOfTeamsArr = nodeLikeToArray(numOfTeamsNode);

        // set zone class on correct team rows
        zonePosition.forEach(function(zone) {
            numOfTeamsArr.forEach(function(teamRow) {
                var position = Number(teamRow.getAttribute('data'));

                if(position === zone) {
                    teamRow.id = 'zone';
                }    
            });
        });
        
        // if in reversed state we need to reverse zones
        if (tableState.reversed) {
            if (tableState.hasOwnProperty('zonePositions')) {
                reverseZones();
            }   
        }
    }



    /*------------API FUNCTIONS------------*/



    lib.renderLeague = function(data) {
        // store table data if present
        if (data) {
            // validate the table data
            validateTableData(data);
        }

        sort();
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
    }


    lib.addTeam = function(team) {
        // check whether array
        arrayCheck(team); 
        
        // loop over array and validate each team obj
        team.forEach(function(team) {
            var duplicate = checkName(team); 
            if (duplicate) {
                throw new Error('Team name already exists.');
            }
            validateProps(team);
            // push team to sorted league array
            lib.league.push(team);
        });

        // check if table has been rendered - if so, we sort (if possible)
        if (document.querySelector('.league-table table')) {
            lib.renderLeague();
        }
        
        return lib.league;
    }


    lib.updateTeam = function(name, data) {
        var teamName = checkName(name);

        // if team name not present throw error
        if (!teamName) {
            throw new Error('Team name does not exist.');
        }

        // find team 
        var teamToUpdate = lib.league.filter(function(sortedTeam) {
            return sortedTeam.name === name;
        })[0];

        var dataPropNames = Object.getOwnPropertyNames(data);
        var teamToUpdatePropNames = Object.getOwnPropertyNames(teamToUpdate);
        // update team data
        teamToUpdatePropNames.forEach(function(teamProp) {
            dataPropNames.forEach(function(dataProp) {
                if (dataProp === teamProp) {
                    teamToUpdate[dataProp] = data[dataProp];
                // if prop is invalid throw error
                } else if (teamToUpdatePropNames.indexOf(dataProp) === -1) {
                    throw new Error('Incorrect team property format passed.');
                }
            });
        });
        
        lib.renderLeague();
    }


    lib.deleteTeam = function(name) {
        var teamName = checkName(name);

        // if team name not present throw error
        if (!teamName) {
            throw new Error('Team name does not exist.');
        }

        var deleteIndex;
        var nameEdited = name.toLowerCase();

        lib.league.forEach(function(sortedTeam, index) {
            if (sortedTeam.name.toLowerCase() === nameEdited) {
                deleteIndex = index;
            };
        });

        // delete from the league
        lib.league.splice(deleteIndex, 1);
        lib.renderLeague();
    }
    
    // set to window for now
    root['soccer'] = lib;

}(this));