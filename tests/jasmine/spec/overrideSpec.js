describe('override()', function() {
    var teams = [{name: 'Frodo City', gp: 15, w: 1, d: 0, l: 4, gs: 5, a: 4, gd: -6, pts: 11}, 
                 {name: 'Merry Argyle', gp: 10, w: 4, d: 0, l: 3, gs: 7, a: 4, gd: 6, pts: 5}];
    
    beforeEach(function() {
        soccer.league.length = 0;
        spyOn(soccer, 'renderLeague');
    });
    
    
    it('should swap two teams', function() {
        soccer.addTeam(teams);
        soccer.override([1, 2]);
        // remove postion prop so we can compare with teams obj above
        soccer.league.forEach(function(team) {
            delete team.position;
        });

        expect(soccer.league[0]).toEqual(jasmine.objectContaining(teams[1]));
        expect(soccer.league[1]).toEqual(jasmine.objectContaining(teams[0]));
    });

    it('should swap team position properties', function() {
        soccer.addTeam(teams);
        soccer.override([1, 2]);
        
        expect(soccer.league[0].position).toBe(1);
        expect(soccer.league[1].position).toBe(2);
        
        soccer.league.forEach(function(team) {
            delete team.position;
        });
        
    });
    
    it('should return league array', function() {
        soccer.addTeam(teams);
        
        expect(soccer.override([1, 2])).toEqual(jasmine.any(Array));
        
        soccer.league.forEach(function(team) {
            delete team.position;
        });
    });
    
    it ('should invoke renderLeague()', function() {
        soccer.addTeam(teams);
        soccer.override([1, 2]);
        
        expect(soccer.renderLeague).toHaveBeenCalled();
        
        soccer.league.forEach(function(team) {
            delete team.position;
        });
    });
    
    it('should throw Error if positions not passed within an array', function() {
        expect(function(){
            soccer.override(1, 2);
        }).toThrow(new Error('Invalid argument. Data must be passed within an array.'));  
    });
    
});