# :soccer: soccer.js
 

__soccer.js__ is a vanilla JavaScript micro-library for building soccer league tables. It is lightweight and has no dependencies. It provides an easy way to update league tables with added reverse functionality, auto-sort, and an optional dropdown toggle. 

Built to account for every scenario in mind. The library sorts teams by points, then by goal difference, goals scored, and lastly, alphabetically. Works on mobile devices as well.

To see a league table in action take a look at the website: https://jrobind.github.io/soccer.js/

## Install

### Browser

Load the files straight into your HTML from the ```dist``` folder:

```html
<link rel="stylesheet" href="soccer.min.css">
<script src="soccer.min.js"></script>
```
Alternatively, soccer.js is also compatible with AMD (RequireJS) - simply wrap your code in the following block:

```js
require(['soccer'], function (soccer) {
  // your code
});
```
Make sure you add a league table container:

```html
<div class="league-table"></div>
```

### npm

If you prefer package management, you can install soccer.js on npm:

```
npm install soccer.js --save
```
To use:

```js
var soccer = require('soccer.js').soccer;
```

## Usage

To quickly set up a league, first add teams using the ```addTeam()``` method. It accepts an array of strings representing the names of the teams to be created. Team objects will be created with default values and sorted alphabetically. A league position will be assigned to each team object once the league has been sorted. The method also returns a league array containing the sorted teams:

```js
soccer.addTeam(['Rohan Rovers', 'Elrond Athletic', 'Sauron Town', 'White Tree Park']);
```

Default team objects will look something like this:

```js
{
    name: 'Rohan Rovers',
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    scored: 0,
    conceded: 0,
    goalDiff: 0,
    points: 0,
    position: 1 // represents league position
}
```

Once all your teams are added, render a league table using the ```renderLeague()``` method. By default, the table will render __without__ a dropdown or zones applied. To alter this, you can pass in an optional object allowing you to configure the table. The configuration object consists of 3 properties:

```js
soccer.renderLeague({
    leagueName: 'Middle Earth League 1', // name of your league
    dropdown: 3, // collapse table from 3rd place and render toggle to table
    zones: [1, 4] // set a promotion and relegation zone
});
```

The rendered league table comes with a reverse toggle built-in, so users can reverse the league table making it easier to view leagues containing lots of teams. To reverse a league table simply click the __'Pos'__ column header.

## Updating The Table

### Update Team Stats

Once the league table has been rendered, you can easily update individual team stats by using the ```updateTeam()``` method. The method accepts an array of objects containing team stats you wish to update. Objects __must__ contain a ```name``` property with it's value set equal to the name of the team to be updated. __You do not need to pass in a goal difference value - it is automatically calculated__.

The table will auto-update and sort the teams. The method also returns an updated and sorted league array. You do not have to update all of the team stats - you can update a few if you wish:

```js
soccer.updateTeam([{
    name: 'Rohan Rovers',
    played: 16,
    won: 11,
    points: 34
}]);
```

### Removing Teams

To remove teams from the league simply invoke the ```deleteTeam()``` method and pass in a string representing the name of the team you wish to delete. The method returns the updated league array and automatically re-sorts and renders the league table: 

```js
soccer.deleteTeam('Rohan Rovers');
```

## Additional Methods

### Override

There are edge cases where a manual position override in the league may be necessary. For instance, other countries may apply different rules when two teams are tied with equal points for important promotion, winning, and relegation positions. There may be a situation where two teams are tied for 1st place with equal points, but instead of the winner being determined by goal difference, then goals scored etc, different rule systems (such as the Spanish head-to-head rule) may be implemented. 

With these edge cases in mind, teams can be manually swapped as a last resort by using the ```overide()``` method. The method accepts an array containing the positions of the two teams you wish to swap. This mechanism will ignore any default sorting and the league table will auto-update the changes. ```override()``` will return an unsorted league array containing the changes:

```js
soccer.override([1, 2]); // teams at positions 1 and 2 swapped
```

Note that any changes made using the `overide()` method will remain in effect __as long as no other library methods are called__. Calling other methods will revert any changes made by `override()`. To revert changes back again simply re-call the method. 

### Sort

If, for any reason you need to re-sort the table, then the ```sort()``` method will do just that. The method will also return a sorted league array:

```js
soccer.sort();
```

## Usage Without A Table

The library is built so that it will work even if you choose not to render a league table and wish instead to just work with the league array itself. This may be useful for those who are looking to build their own unique tables. In this case, to prevent any potential errors you need to __remove__ any league table container divs from your HTML (if present):

```html
<div class="league-table"></div> <!--remove-->
```

## Changing The Looks

To alter the league table looks you can easily override the styles within ```soccer.css```. The most common style alteration will involve changing the league table caption color. By default it is red. To do this, change the ```background-color``` property in the ```.league-table caption ``` rule.

## Contributing

Please let me know of any issues/feature requests. Pull-requests and all contributions are greatly appreciated. 

## License

[MIT License](https://opensource.org/licenses/MIT)
