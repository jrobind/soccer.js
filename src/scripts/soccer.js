(function(root) {
    'use strict'
    
    var league = {
        sortedLeague: [],
        positionedManually: false,
        tableData: {},
    };
    
    var lib = {};
    // just for testing!
    lib['sortedLeague'] = league.sortedLeague;


    /*-------------UTILITY FUNCTIONS------------*/


    function sort() {
        league.sortedLeague.sort(function(a, b) {
            // sort teams in descending order (by default) by points
            if (a.pts !== b.pts) {
                return b.pts - a.pts;
            } else {
                // if points are equal then sort by goal difference
                return goalDiffCheck(a, b);
            }
        });

        // add positions to teams
        addPositions(league.sortedLeague);

        // check if the league is reversed
        if (league.reversed) {
            league.sortedLeague.reverse();
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
            // if total goals scored is equal then sort alphabetically
            return alphabeticalCheck(a, b);
        }
    }


    function alphabeticalCheck(a, b) {
        return b.name < a.name;
    }


    function nodeLikeToArray(nodeLike) {
        // convert node-like array to array that we can work with
        var arr = [].slice.apply(nodeLike);
        return arr;
    } 


    function lastUpdated() {
        var date = new Date();
        // format the date
        var dString = date.toGMTString();
        // remove 'GMT' from end of date
        var sliceGmt = dString.slice(0, 25);

        // set new date onto the league object
        var lastUpdated = 'Last updated ' + sliceGmt;
        // set most recent update time to league object
        league['lastUpdated'] = lastUpdated;

        return lastUpdated;
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
        setReverseState();
        // reverse the table order
        league.sortedLeague.reverse();
        // re-render
        lib.createLeague(); 

        // check if we have table zones present
        if (league.reversed) {
            if (league.hasOwnProperty('zonePositions')) {
                reverseZones();
            }   
        }
    }


    function setReverseState() {
        // check reversed state
        if (league.reversed) {
            league.reversed = false;
        } else {
            league['reversed'] = true;
        }
    }


    function reverseZones() {
        // grab the number of team rows with zone class
        var zones = document.querySelectorAll('#zone');
        // convert node like array into array we can work with
        var zonesArr = nodeLikeToArray(zones);

        // add reverse zone class
        zonesArr.forEach(function(zone) {
            zone.id = 'zoneReverse';
        });
    }


    function setArrowDirection() { 
        // set direction depending on reverse state
        if (league.reversed) {
            return '&#9653';
        } else {
            return '&#9663';    
        }
    }


    function checkInput(team) {
        var name;
        typeof team === 'string' ? name = team : name = team.name;

        // check whether name already exits
        var duplicate = league.sortedLeague.map(function(team) {
            return team.name;
        }).filter(function(sortedName) {
            return sortedName === name;
        });

        return Boolean(duplicate.length);
    }


    function validateProps(defaults, data) {
        var propsValid = true;
        var defaultProps = defaults;
        var dataProps = Object.getOwnPropertyNames(data);

        // check default against data props
        dataProps.forEach(function(prop) {
            if (defaultProps.indexOf(prop) === -1) {
                propsValid = false;
            } 
        });

        if (!propsValid || dataProps.length !== defaultProps.length) {
            throw new Error('Incorrect team property format passed.')
        };
    }


    function tableSplice() {
        // remove teams
        var newLeague = league.sortedLeague.slice(0, league.tableData.show);
        // update the league
        league.sortedLeague = newLeague;
    }


    function createDropdown() {
        // add in collapsible toggle to the bottom of table
        var container = document.querySelector('.league-table table');
        var toggleRow = document.createElement('tr');
        container.appendChild(toggleRow);

        var toggleTd = document.createElement('td');
        // set td to span all table columns
        toggleTd.setAttribute('colspan', '10');
        var toggleDiv = document.createElement('div');
        // set toggle div class
        toggleDiv.setAttribute('class', 'toggle');

        // create toggle arrow
        var toggleArrow = document.createElement('div');

        // set arrow direction
        if (league.toggleState === 'show') {
            toggleArrow.classList.remove('toggle-arrow-default');
            toggleArrow.classList.add('toggle-arrow-collapse');
        } else {
            toggleArrow.classList.add('toggle-arrow-default');
        }

        toggleDiv.appendChild(toggleArrow);
        toggleTd.appendChild(toggleDiv);
        toggleRow.appendChild(toggleTd);   

        // setup click listener for toggle arrow
        toggleArrow.addEventListener('click', dropdownToggle);
    }


    function hideTeams() {
        league['toggleState'] = 'hidden';
        // grab all team rows
        var teams = document.querySelectorAll('.league-table table tbody tr');
        // transform to array so we can work with it
        var unHiddenArr = nodeLikeToArray(teams);
        var newRows = unHiddenArr.splice(league.tableData.show, league.sortedLeague.length);

        // hide team rows
        newRows.forEach(function(teamRow) {
            teamRow.classList.add('hide-team');
        }); 
    }


    function showTeams() {
        league.toggleState = 'show';
        var hidden = document.querySelectorAll('.hide-team');
        // transform to array so we can work with it
        var hiddenArr = nodeLikeToArray(hidden);

        // show hidden teams
        hiddenArr.forEach(function(team, index) {
            if (index + 1 === hiddenArr.length) {
                team.id = 'lastTeam';
                team.classList.remove('hide-team');
            } else {
                team.classList.remove('hide-team');   
            }
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
            createDropdown();
            hideTeams();
        // if user data is undefined then we are not initialising the table
        } else {
            // respect the toggle state 
            if (league.toggleState === 'show') {
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
        leagueCaption.innerText = league.tableData.leagueName;
        // append table element and table caption to container div
        container.appendChild(leagueTable);
        leagueTable.appendChild(leagueCaption);

        // create the tablehead
        createTableHead(leagueTable, league.tableData.colTitle);
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
        var sorted = league.sortedLeague;

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

        // check if we need to create the tableFooter
        if (league.tableData.footer) {
            createTableFooter();   
        }
    }


    function createTableFooter(leagueTable) {
        var leagueTable = document.querySelector('.league-table table');
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

        // add most recent update time (but not if we are reversing table)
        if (!league.hasOwnProperty('reversed')) {
            footerTime.innerText = lastUpdated();   
        } else {
            footerTime.innerText = league.lastUpdated;    
        }

        // append span to footer cell
        footerCell.appendChild(footerTime);

        // check if we have zone positions for the table, if so add them
        if (league.zonePositions) {
            soccer.addZones(league.zonePositions);
        }
    }



    /*------------API FUNCTIONS------------*/



    lib.createLeague = function(data) {
        // store table data if present
        if (data) {
            var defaultProps = ['leagueName', 'colTitle', 'footer', 'show', 'dropdown'];
            // store table data
            league.tableData = data;
            // validate the table data
            validateProps(defaultProps, data);
        }

        // if partial table requested then splice league table
        if (league.tableData.show > 0 && !league.tableData.dropdown) {
            tableSplice();
        }

        sort();
        removeLeague();

        // create the table caption
        createTableCaption();

        // setup reverse listeners and handler
        reverseSetup();

        // check wether we need to create dropdown toggle
        if (league.tableData.show > 0 && league.tableData.dropdown) {
            checkToggleState(data);
        }
    }


    lib.addTeam = function(team) {
        var defaultProps = ['name', 'gp', 'w', 'd', 'l', 'gs', 'a', 'gd', 'pts'];
        var sorted = league.sortedLeague;
        var duplicate = checkInput(team);
        var validData = validateProps(defaultProps, team);

        // if duplicate team throw error
        if (duplicate) {
            throw new Error('Team name already exists.')
        }

        // push team to sorted league array for processing
        sorted.push(team);
        console.log(league.sortedLeague);

        // check if table has been rendered - if so, we sort (if possible)
        if (document.querySelector('.league-table table')) {
            lib.createLeague();
        }
    }


    lib.addZones = function(zonePosition) {
        // current number of positions on table
        var totalPos = document.querySelectorAll('.league-table tbody tr').length;
        // throw error if zone positions are not within a valid range
        zonePosition.forEach(function(zone) {
            if (zone > totalPos || zone < 0) {
                throw new Error('Zone positions are not within valid team range.');
            }
        });

        // check whether array
        if(!Array.isArray(zonePosition)) {
            throw new Error('Invalid argument. Zone positions must be passed as an array.')
        }

        // store zone positons
        league['zonePositions'] = zonePosition;

        // grab the number of teams in the table
        var numOfTeamsNode = document.querySelectorAll('.league-table table tbody tr');
        // convert node like array into array we can work with
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
    }


    lib.updateTeam = function(name, data) {
        var teamName = checkInput(name);

        // if team name not present throw error
        if (!teamName) {
            throw new Error('Team name does not exist.');
        }

        // find team and update with relevant data
        var teamToUpdate = league.sortedLeague.filter(function(sortedTeam) {
            return sortedTeam.name === name;
        })[0];

        var dataPropNames = Object.getOwnPropertyNames(data);
        var teamToUpdatePropNames = Object.getOwnPropertyNames(teamToUpdate);
        // check that a valid team property was passed in
        dataPropNames.forEach(function(prop){
            if (teamToUpdatePropNames.indexOf(prop) === -1) {
                throw new Error('Incorrect team property passed.');
                return;
            }
        });


        teamToUpdatePropNames.forEach(function(teamProp) {
            dataPropNames.forEach(function(dataProp) {
                if (dataProp === teamProp) {
                    teamToUpdate[dataProp] = data[dataProp];
                }
            });
        });
        // re-render the table
        lib.createLeague();
    }


    lib.deleteTeam = function(name) {
        var teamName = checkInput(name);

        // if team name not present throw error
        if (!teamName) {
            throw new Error('Team name does not exist.');
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
        lib.createLeague();
    }
    
    // set to window for now
    root['soccer'] = lib;

}(this));