describe('override()', function() {
    var teams = [{name: 'Frodo City', played: 0, won: 0, drawn: 0, lost: 0, scored: 0, conceded: 0, goalDiff: 0, points: 0}, 
                 {name: 'Merry Argyle', played: 0, won: 0, drawn: 0, lost: 0, scored: 0, conceded: 0, goalDiff: 0, points: 0}];
    
    beforeEach(function() {
        soccer.league.length = 0;
        spyOn(soccer, 'renderLeague');
        spyOn(soccer, 'sort');
    });
    
    
    it('should swap two teams', function() {
        soccer.addTeam(['Frodo City', 'Merry Argyle']);
        soccer.override([1, 2]);
        // remove postion prop so we can compare with teams obj above
        soccer.league.forEach(function(team) {
            delete team.position;
        });

        expect(soccer.league[0]).toEqual(jasmine.objectContaining(teams[1]));
        expect(soccer.league[1]).toEqual(jasmine.objectContaining(teams[0]));
    });

    it('should swap team position properties', function() {
        soccer.addTeam(['Frodo City', 'Merry Argyle']);
        soccer.override([1, 2]);
        
        expect(soccer.league[0].position).toBe(1);
        expect(soccer.league[1].position).toBe(2);
        
        soccer.league.forEach(function(team) {
            delete team.position;
        });
        
    });
    
    it('should return league array', function() {
        soccer.addTeam(['Frodo City', 'Merry Argyle']);
        
        expect(soccer.override([1, 2])).toEqual(jasmine.any(Array));
        
        soccer.league.forEach(function(team) {
            delete team.position;
        });
    });
    
    it('should throw Error if positions not passed within an array', function() {
        expect(function(){
            soccer.override(1, 2);
        }).toThrow(new Error('Invalid argument. Data must be passed within an array.'));  
    });
    
    it('should throw Error if more than two positions passed within an array', function() {
        expect(function(){
            soccer.override([1, 2, 3]);
        }).toThrow(new Error('Only two teams can be swapped at a time.'));  
    });
    
    it('should throw Error if positions are invalid', function() {
        expect(function(){
            soccer.override([23, 200]);
        }).toThrow(new Error('Invalid team position(s).'));  
    });

});