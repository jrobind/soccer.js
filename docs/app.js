soccer.addTeam(['Gandalf Academical', 'Frodo City', 'Aragorn Wanderers', 'Bilbo United', 'Gimli Albion', 'Sauron Town', 'Merry Argyle', 'Elrond Athletic', 'Rohan Rovers', 'White Tree Park']);
    
soccer.updateTeam([{
        name: 'Gandalf Academical',
        played: 10,
        won: 3,
        drawn: 1,
        lost: 6,
        scored: 21,
        conceded: 24,
        points: 10
    },
    {
        name: 'Frodo City',
        played: 10,
        won: 2,
        drawn: 2,
        lost: 6,
        scored: 15,
        conceded: 20,
        points: 6
        },
    {
        name: 'Aragorn Wanderers',
        played: 11,
        won: 10,
        drawn: 1,
        lost: 0,
        scored: 28,
        conceded: 6,
        points: 31
    },
    {
        name: 'Bilbo United',
        played: 11,
        won: 8,
        drawn: 0,
        lost: 3,
        scored: 20,
        conceded: 21,
        points: 24    
    },
    {
        name: 'Gimli Albion',
        played: 10,
        won: 7,
        drawn: 3,
        lost: 0,
        scored: 30,
        conceded: 20,
        points: 24 
    },
    {
        name: 'Sauron Town',
        played: 11,
        won: 6,
        drawn: 4,
        lost: 1,
        scored: 18,
        conceded: 12,
        points: 20  
    },
    {
        name: 'Merry Argyle',
        played: 11,
        won: 10,
        drawn: 0,
        lost: 1,
        scored: 35,
        conceded: 18,
        points: 30 
    },
    {
        name: 'Elrond Athletic',
        played: 10,
        won: 5,
        drawn: 0,
        lost: 5,
        scored: 12,
        conceded: 14,
        points: 15     
    },
    {
        name: 'Rohan Rovers',
        played: 11,
        won: 3,
        drawn: 1,
        lost: 7,
        scored: 10,
        conceded: 16,
        points: 10      
    },
    {
        name: 'White Tree Park',
        played: 11,
        won: 11,
        drawn: 0,
        lost: 0,
        scored: 40,
        conceded: 12,
        points: 33
}]);
        
soccer.renderLeague({
    leagueName: 'Middle Earth League 1',
    dropdown: 5,
    zones: [1, 8]
});
    