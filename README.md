# test-tasks-ts

Two tasks: Labyrinth and Fibonacci
Two problems and solved with TypeScript

Created by [Alexander Diller](https://www.alexander-diller.de)

## Usage

Everything is prebuilt and can be used directly. The `tasks.exe` can be found in "dist" folder

### Execute Labyrinth

- `tasks.exe labyrinth <input>`
- `tasks.exe labyrinth --interactive` you can then interactively enter the input into the console
- `tasks.exe labyrinth < labyrinth.txt` example file of labyrinth.txt (for cmd.exe)
- `Get-Content labyrinth.txt | & .\tasks.exe labyrinth` example file of labyrinth.txt (for powershell.exe)

Parameters
- append `--debug` to output the labyrinth in colors and colorized path if exit is possible (`tasks.exe labyrinth --debug < labyrinth.txt`)
- append `--interactive` for interactive mode with some instructions and stdin is kept alive for further input
### Execute Fibonacci

- `tasks.exe fibonacci <input>`
- `tasks.exe fibonacci --interactive` you can then interactively enter the input into the console
- `tasks.exe fibonacci < fibonacci.txt` example file of fibonacci.txt (for cmd.exe)
- `Get-Content fibonacci.txt | & .\tasks.exe fibonacci` example file of fibonacci.txt (for powershell.exe)

Parameters
- append `--debug` for some debug output (`tasks.exe fibonacci 5000 --debug`)
- append `--interactive` for interactive mode with some instructions and stdin is kept alive for further input
## Build yourself

The whole project can be built very easily, with the following dependencies:

- `nodejs 14` (lts), newer ones might work too

clone project and install dependencies with npm:

- `npm install` (`yarn` should work too <3)

You most likely need cspell dictionaries. With VSCode the english one should be shipped, but the german one is missing

- `npm install -g @cspell/dict-de-de`
- `cspell link add @cspell/dict-de-de`

Then you can build everything be executing

- `npm run dist`

This will run tests, coverage, documentation and builds the application and package it into exe

> For linux users, you could update the pkg cmd in `package.json` to include linux ;)

## Documentation

- Code Coverage `npm run cov` (opens automatically in browser)
- Code Documentation `npm run doc` (opens automatically in browser)

## Tasks
### Labyrinth
```
# Labyrinth 

Sie befinden sich in einem 3D Labyrinth und wollen auf schnellstem Weg nach Hause. Das Labyrinth besteht aus einheitlichen Quadern aus Stein oder Luft. Sie benötigen 1 Minute, um einen Schritt nach Norden, Süden, Westen, Osten, Oben oder Unten zu gehen. Diagonale Fortbewegung ist nicht möglich. Ausserdem ist das Labyrinth an allen Seiten von Steinen umgeben.

Ist es möglich zu entkommen, und falls ja, wie lange sind Sie mindestens unterwegs?

Eingabe:

Als Eingabe erhält ihr Programm eine Reihe Beschreibungen von Labyrinthen, aus denen es zu entkommen gilt. Jede Beschreibung beginnt mit drei ganzzahligen Werten L, R, C (alle <= 30).

L ist die Anzahl der Ebenen des Labyrinths.
R ist die Länge des Labyrinths, und C die Breite.

Anschließend folgen L Ebenen des Labyrinths, mit je R Zeilen die C Zeichen enthalten. Jedes Zeichen steht für einen Quader: '#' für Stein, '.' für Luft. An ihrer Startposition befindet sich ein 'S', und der Ausgang ist ein 'E'. Jede Ebene wird durch eine einzelne leere Zeile abgeschlossen. Die Eingabe wird durch drei Nullen für L, R, C abgeschlossen.

Ihr Programm soll für jedes eingegebene Labyrinth genau eine Zeile ausgeben, in der Form:

Entkommen in 11 Minute(n)!

bzw.

Gefangen :-(

falls es keine Möglichkeit gibt zu entkommen.

Beispiel Eingabe:

3 4 5
S....
.###.
.##..
###.#

#####
#####
##.##
##...

#####
#####
#.###
####E

1 3 3
S##
#E#
###

0 0 0

Beispiel Ausgabe:

Entkommen in 11 Minute(n)!
Gefangen :-(
```
### Fibonacci Zahlen

```
Die Fibonacci Zahlen (0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55 ...) sind rekursiv definiert durch:
F(0) = 0
F(1) = 1
F(i) = F(i-1) + F(i-2) für i >= 2

Schreiben Sie ein Programm, das Fibonacci Zahlen berechnet.

Als Eingabe erhält ihr Programm eine Reihe von Zahlen kleiner oder gleich 5000 (eine Zahl pro Zeile). Für jede dieser Zahlen soll Ihr Programm die zugehörige Fibonacci Zahl berechnen und auf einer Zeile ausgeben.

Beispiel Eingabe:
5
7
11

Beispiel Ausgabe:
Die Fibonacci Zahl für 5 ist: 5
Die Fibonacci Zahl für 7 ist: 13
Die Fibonacci Zahl für 11 ist: 89

Rahmenbedingungen:
Wir testen ihr Programm mit einer Folge von etwa 523 zufällig ausgewählten Zahlen. Die maximale Laufzeit ihres Programms sei hierbei auf 30 Sekunden begrenzt.
```
