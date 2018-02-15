describe('deleteTeam()', function() {
    
    beforeEach(function() {
        soccer.league.length = 0;
        spyOn(soccer, 'renderLeague');
        spyOn(soccer, 'sort');
        soccer.addTeam(['Frodo City', 'Merry Argyle']);
    });

    
    it('should delete a team', function() {
        soccer.deleteTeam('Frodo City');
        
        expect(soccer.league.length).toBe(1);
        soccer.deleteTeam('Merry Argyle');
        expect(soccer.league.length).toBe(0);
    });
    
    it('should return league array', function() {
        expect(soccer.deleteTeam('Merry Argyle')).toEqual(jasmine.any(Array));
    });
    
    it('should throw Error if team name does not exist', function() {
        expect(function(){
            soccer.deleteTeam('Frodo Rovers');
        }).toThrow(new Error('Team name does not exist.'));
    });
    
    it('should throw Error if team name is not case sensitive', function() {
        expect(function(){
            soccer.deleteTeam('fRoDo RoVerRs');
        }).toThrow(new Error('Team name does not exist.'));
    });
    
});