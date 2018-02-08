describe('addTeam()', function() {
    var team = {name: 'Merry Argyle', gp: 15, w: 1, d: 0, l: 4, gs: 5, a: 4, gd: -6, pts: 11};
    var missingProps = {name: 'Merry Argyle', gp: 15, w: 1};
    var incorrectprops = {name: 'Merry Argyle', wrong: 15, w: 1, d: 0, l: 4, gs: 5, a: 4, gd: -6, pts: 11};
    
    beforeEach(function() {
        soccer.sortedLeague.length = 0;
    });
    
    
    it('should store a team object', function() {
        soccer.addTeam(team);
        
        expect(soccer.sortedLeague[0]).toEqual(jasmine.any(Object));
    });
    
    it('should return league array containing team object', function() {
        expect(soccer.addTeam(team)).toEqual(jasmine.any(Array));
        soccer.sortedLeague.length = 0;
        expect(soccer.addTeam(team)[0]).toEqual(jasmine.objectContaining(team));
    });
    
    it('should contain default team properties', function() {
        soccer.addTeam(team);
        
        expect(soccer.sortedLeague[0]).toEqual(jasmine.objectContaining(team));
        
        expect(soccer.sortedLeague[0]).not.toEqual(jasmine.objectContaining({
            name: 'Bilbo Town'
        }));
    });
   
    describe('when to call createLeague()', function() {
        
        beforeEach(function() {
            soccer.sortedLeague.length = 0;
            spyOn(soccer, 'createLeague');
        });
        
        it('should call createLeague() only when a table has been rendered', function() {
            var container = document.createElement('div');
            container.setAttribute('class', 'league-table');
            var table = document.createElement('table');
            container.appendChild(table);
            document.body.appendChild(container);
            
            soccer.addTeam(team);
            
            expect(soccer.createLeague).toHaveBeenCalled();
            
            document.body.removeChild(container);
        });
        
        it('should not call createLeague() when no table has been rendered', function() {
            soccer.addTeam(team);
            expect(soccer.createLeague).not.toHaveBeenCalled();
        });
    });
    
    it('should throw Error if incorrect number of properties used', function() {
        expect(function(){
            soccer.addTeam(missingProps);
        }).toThrow(new Error('Incorrect team property format passed.'));
    });
    
    it('should throw Error if incorrect property is used', function() {
        expect(function(){
            soccer.addTeam(incorrectprops);
        }).toThrow(new Error('Incorrect team property format passed.'));
    });
    
    it('should throw Error if team name is already in use', function() {
        soccer.addTeam(team);
        
        expect(function() {
            soccer.addTeam(team);   
        }).toThrow(new Error('Team name already exists.'));
    });
    
});