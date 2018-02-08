describe('deleteTeam()', function() {
    var team = [{name: 'Frodo City', gp: 15, w: 1, d: 0, l: 4, gs: 5, a: 4, gd: -6, pts: 11}];
    
    beforeEach(function() {
        soccer.sortedLeague.length = 0;
        spyOn(soccer, 'renderLeague');
        soccer.addTeam(team);
    });

    
    it('should delete a team', function() {
        soccer.deleteTeam('Frodo City');
        
        expect(soccer.sortedLeague.length).toBe(0);
    });

    it ('should invoke renderLeague()', function() {
        soccer.deleteTeam('Frodo City');
        
        expect(soccer.renderLeague).toHaveBeenCalled();
    });
    
    it('should throw Error if team name does not exist', function() {
        expect(function(){
            soccer.updateTeam('Frodo Rovers');
        }).toThrow(new Error('Team name does not exist.'));
    });
    
    it('should throw Error if team name is not case sensitive', function() {
        expect(function(){
            soccer.updateTeam('fRoDo RoVerRs');
        }).toThrow(new Error('Team name does not exist.'));
    });
    
});