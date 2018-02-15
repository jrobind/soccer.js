describe('updateTeam()', function() {
    var team = [{name: 'Merry Argyle', played: 15, w: 1, d: 0, l: 4, gs: 5, a: 4, gd: -6, pts: 11}];
    var updatePts = [{name: 'Merry Argyle', points: 15}];
    var updateAll = [{name: 'Merry Argyle', points: 10, won: 4, drawn: 3, lost: 2, scored: 15, conceded: 7, goalDiff: 8, points: 34}];
    var incorrectPop = [{name: 'Merry Argyle', gsp: 20}];
    
    beforeEach(function() {
        soccer.league.length = 0;
        spyOn(soccer, 'renderLeague');
        spyOn(soccer, 'sort');
        soccer.addTeam(['Merry Argyle']);
    });

    
    it('should update one team property', function() {
        soccer.updateTeam(updatePts);
        
        expect(soccer.league[0].points).toBe(15);
    });
    
    it('should update all team properties', function() {
        soccer.updateTeam(updateAll);
        
        expect(soccer.league[0]).toEqual(jasmine.objectContaining(updateAll[0]));
    });
    
    it('should return league array', function() {
        var returnValue = soccer.updateTeam(updatePts)
        
        expect(returnValue).toEqual(jasmine.any(Array));
        expect(returnValue.length).toBe(1);
    });
    
    it('should throw Error if team name does not exist', function() {
        expect(function(){
            soccer.updateTeam([{name: 'Bilbo Rovers'}]);
        }).toThrow(new Error('Team name does not exist.'));
    });
    
    it('should throw Error if team name is not case sensitive', function() {
        expect(function(){
            soccer.updateTeam([{name:'mErrY aRGYle'}]);
        }).toThrow(new Error('Team name does not exist.'));
    });
    
    it('should throw Error if incorrect team property used', function() {
        expect(function(){
            soccer.updateTeam(incorrectPop);
        }).toThrow(new Error('Incorrect team property format passed.'));
    });
    
});