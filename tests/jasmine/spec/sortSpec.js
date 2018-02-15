describe('sort()', function() {
    var points = [{name: 'Frodo City', points: 5}, {name: 'Rohan Rovers', points: 20}, {name: 'Merry Argyle', points: 10}]
    
    var goalDiff = [{name: 'Frodo City', scored: 10, conceded: 5}, {name: 'Rohan Rovers', scored: 8, conceded: 5}, 
                    {name: 'Merry Argyle', scored: 15, conceded: 5}]
    
    var goalsScored = [{name: 'Frodo City', scored: 50}, {name: 'Rohan Rovers', scored: 20}, {name: 'Merry Argyle', scored: 51}]
    
    beforeEach(function() {
        // remove position
        soccer.league.forEach(function(team) {
            delete team.position;
        });
        soccer.league.length = 0;
        soccer.addTeam(['Frodo City', 'Merry Argyle', 'Rohan Rovers']);
    });

    
    it('should sort teams by points', function() {
        soccer.updateTeam(points)
        soccer.sort();
        
        expect(soccer.league[0]).toEqual(jasmine.objectContaining(points[1]));
        expect(soccer.league[1]).toEqual(jasmine.objectContaining(points[2]));
        expect(soccer.league[2]).toEqual(jasmine.objectContaining(points[0]));
    });
    
    it('should sort teams by goal difference if points equal', function() {
        soccer.updateTeam(goalDiff);
        soccer.sort();
        
        expect(soccer.league[0]).toEqual(jasmine.objectContaining(goalDiff[2]));
        expect(soccer.league[1]).toEqual(jasmine.objectContaining(goalDiff[0]));
        expect(soccer.league[2]).toEqual(jasmine.objectContaining(goalDiff[1]));
    });
    
    it('should sort teams by goals scored if points and goal difference equal', function() {
        soccer.updateTeam(goalsScored);
        soccer.sort();
        
        expect(soccer.league[0]).toEqual(jasmine.objectContaining(goalsScored[2]));
        expect(soccer.league[1]).toEqual(jasmine.objectContaining(goalsScored[0]));
        expect(soccer.league[2]).toEqual(jasmine.objectContaining(goalsScored[1]));
    });
    
    it('should sort teams alphabetically if points, goal difference, and goals scored equal', function() {
        soccer.sort();
        
        expect(soccer.league[0].name).toBe('Frodo City');
        expect(soccer.league[1].name).toBe('Merry Argyle');
        expect(soccer.league[2].name).toBe('Rohan Rovers');
    });
    
    it('should add league position to sorted teams', function() {
        soccer.updateTeam(points);
        soccer.sort();
        
        expect(soccer.league[0].position).toBe(1);
        expect(soccer.league[1].position).toBe(2);
        expect(soccer.league[2].position).toBe(3);
    });
    
    it('should return league array', function() {
        soccer.updateTeam(points);
        var returnValue = soccer.sort();
        
        expect(returnValue).toEqual(jasmine.any(Array));
        expect(returnValue.length).toBe(3);
    });
    
});