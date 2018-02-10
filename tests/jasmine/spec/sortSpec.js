describe('sort()', function() {
    var points = [{name: 'Frodo City', gp: 15, w: 1, d: 0, l: 4, gs: 5, a: 4, gd: -6, pts: 5}, {name: 'Merry Argyle', gp: 15, w: 1, d: 0, l: 4, gs: 5, a: 4, gd: -6, pts: 11}, {name: 'Rohan Rovers', gp: 15, w: 1, d: 0, l: 4, gs: 5, a: 4, gd: -6, pts: 20}];
    
    var goalDiff = [{name: 'Frodo City', gp: 15, w: 1, d: 0, l: 4, gs: 5, a: 4, gd: 1, pts: 11}, {name: 'Merry Argyle', gp: 15, w: 1, d: 0, l: 4, gs: 5, a: 4, gd: 4, pts: 11}, {name: 'Rohan Rovers', gp: 15, w: 1, d: 0, l: 4, gs: 5, a: 4, gd: -3, pts: 11}];
    
    var goalsScored = [{name: 'Frodo City', gp: 15, w: 1, d: 0, l: 4, gs: 5, a: 4, gd: -6, pts: 11}, {name: 'Merry Argyle', gp: 15, w: 1, d: 0, l: 4, gs: 4, a: 4, gd: -6, pts: 11}, {name: 'Rohan Rovers', gp: 15, w: 1, d: 0, l: 4, gs: 3, a: 4, gd: -6, pts: 11}];
    
    var alphabetically = [{name: 'Merry Argyle', gp: 15, w: 1, d: 0, l: 4, gs: 5, a: 4, gd: -6, pts: 11}, {name: 'Rohan Rovers', gp: 15, w: 1, d: 0, l: 4, gs: 5, a: 4, gd: -6, pts: 11}, {name: 'Frodo City', gp: 15, w: 1, d: 0, l: 4, gs: 5, a: 4, gd: -6, pts: 11}];
    
    beforeEach(function() {
        // remove position
        soccer.league.forEach(function(team) {
            delete team.position;
        });
        soccer.league.length = 0;
    });

    
    it('should sort teams by points', function() {
        soccer.addTeam(points);
        soccer.sort();
        
        expect(soccer.league[0]).toEqual(jasmine.objectContaining(points[2]));
        expect(soccer.league[1]).toEqual(jasmine.objectContaining(points[1]));
        expect(soccer.league[2]).toEqual(jasmine.objectContaining(points[0]));
    });
    
    it('should sort teams by goal difference if points equal', function() {
        soccer.addTeam(goalDiff);
        soccer.sort();
        
        expect(soccer.league[0]).toEqual(jasmine.objectContaining(goalDiff[1]));
        expect(soccer.league[1]).toEqual(jasmine.objectContaining(goalDiff[0]));
        expect(soccer.league[2]).toEqual(jasmine.objectContaining(goalDiff[2]));
    });
    
    it('should sort teams by goals scored if points and goal difference equal', function() {
        soccer.addTeam(goalsScored);
        soccer.sort();
        
        expect(soccer.league[0]).toEqual(jasmine.objectContaining(goalsScored[0]));
        expect(soccer.league[1]).toEqual(jasmine.objectContaining(goalsScored[1]));
        expect(soccer.league[2]).toEqual(jasmine.objectContaining(goalsScored[2]));
    });
    
    it('should sort teams alphabetically if points, goal difference, and goals scored equal', function() {
        soccer.addTeam(alphabetically);
        soccer.sort();
        
        expect(soccer.league[0]).toEqual(jasmine.objectContaining(alphabetically[2]));
        expect(soccer.league[1]).toEqual(jasmine.objectContaining(alphabetically[0]));
        expect(soccer.league[2]).toEqual(jasmine.objectContaining(alphabetically[1]));
    });
    
    it('should add league position to sorted teams', function() {
        soccer.addTeam(points);
        soccer.sort();
        
        expect(soccer.league[0].position).toBe(1);
        expect(soccer.league[1].position).toBe(2);
        expect(soccer.league[2].position).toBe(3);
    });
    
});