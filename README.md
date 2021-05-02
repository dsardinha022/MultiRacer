# MultiRacer

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.2.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further development of this project

This project is at its infency and much more work is needed before this project can take off. The main component for hosted game engine is in the 'game-engine' component where the model and game logic are hosted. This component can be further broken down into sperate components to help isolate game engine physics, model loading and rendering. Anyone who has access to the repo can take the establish code base and alter to your hearts content. This project is protected via Creative Commons liscene so any personal can be free to use this code without consequence. 

First step in the right direction for this project would to fix and establish working answer cube generate system once player model collides with respective answer cubes. Currently implemented, one round of answer cubes will be spawned before the rendering of the overall and simply gets removed when the player collided with answer cube. Next developer can take this in mind and try to solve issue of generating answer cubes into over world after removal of answer cube set.
