describe('addTeam()', function() {
    var teamDefaults = {
        name: 'Rohan Rovers', 
        played: 0, 
        won: 0, 
        drawn: 0, 
        lost: 0, 
        scored: 0, 
        conceded: 0, 
        goalDiff: 0,
        points: 0
    };
    
    var multipleTeams
    
    beforeEach(function() {
        soccer.league.length = 0;
        spyOn(soccer, 'sort');
    });
    
    
    it('should create a team object', function() {
        soccer.addTeam(['Rohan Rovers']);
        
        expect(soccer.league.length).toBe(1);
        expect(soccer.league[0]).toEqual(jasmine.any(Object));
        expect(soccer.league[0]).toEqual(jasmine.objectContaining(teamDefaults));
    });
    
    it('should create multiple team objects', function() {
        soccer.addTeam(['Rohan Rovers', 'Frodo City', 'Bilbo Town']);
        
        expect(soccer.league.length).toBe(3);
        expect(soccer.league[0]).toEqual(jasmine.objectContaining(teamDefaults));
        expect(soccer.league[1].name).toBe('Frodo City');
        expect(soccer.league[2].name).toBe('Bilbo Town');
    });
    
    it('should return league array containing team object(s)', function() {
        var returnValue = soccer.addTeam(['Rohan Rovers']);
        
        expect(returnValue).toEqual(jasmine.any(Array));
        expect(returnValue[0]).toEqual(jasmine.objectContaining(teamDefaults));
        expect(returnValue.length).toBe(1);
    });
    
    it('should contain default team properties', function() {
        soccer.addTeam(['Rohan Rovers']);
        
        expect(soccer.league[0].name).toBe('Rohan Rovers');
        expect(soccer.league[0].played).toBe(0);
        expect(soccer.league[0].won).toBe(0);
        expect(soccer.league[0].drawn).toBe(0);
        expect(soccer.league[0].lost).toBe(0);
        expect(soccer.league[0].scored).toBe(0);
        expect(soccer.league[0].conceded).toBe(0);
        expect(soccer.league[0].goalDiff).toBe(0);
        expect(soccer.league[0].points).toBe(0);
        expect(soccer.league[0]).not.toEqual(jasmine.objectContaining({
            name: 'Bilbo Town'
        }));
    });
    
    it('should throw Error if team names not passed within an array', function() {
        expect(function(){
            soccer.addTeam('Rohan Rovers');
        }).toThrow(new Error('Invalid argument. Data must be passed within an array.'));  
    });
    
    it('should throw Error if team name is already in use', function() {
        soccer.addTeam(['Rohan Rovers']);
        
        expect(function() {
            soccer.addTeam(['Rohan Rovers']);   
        }).toThrow(new Error('Team name already exists.'));
    });
    
});