# The-Memory-Game
Udacity Front-End Web Developer Nanodegree Assignment

----

#Game Details

##Objective
The objective of the game is to match-up all cards with as many stars leftover as possible and as fast as possible. 

##Rule
1. The timer starts as soon as one card is turnedover.
2. Every card paring counts as a move.
3. Points formula. (Number of Stars * 20000) / Total amount of milliseconds.

###Code Notes
Two key events were added to the code to help the game feel more smooth.
:one: In to seperate areas an invalid card check was added to help with invalid pulls
:two: Card matching or missmatch was set on a timeout to make the game feel more alive.  Prior version required additional user inputs and that was just not good enough.


###Code console.log
A few console.logs were left in the code commented out.  These are placed stratigically for troubleshooting the game.
