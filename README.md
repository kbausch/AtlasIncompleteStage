# AtlasIncompleteStage

## Selecting a character

There are two columns. The **first column** is a list of the characters in the database:

![](https://lh6.googleusercontent.com/_23pL4czNi5ciy5-SIUaYUKsNNDI74-8pXc8ygKvrmxkJxSsDC3ljucb1XHCXQupZhqpytoejp-omnjeBOaEHfna9GmbVn0Gue2j3eoiJm2PLmv7Km0_cmFdJvNYR8CkLBbIEm-q)

By clicking a character, it will add them onto the stage if that character isn't on already. It will add them to Position 0 and Level 1 (Offstage). If the character is already on the stage, then it will remove them from it.

The **second column** consists of the characters active on the stage:

![](https://lh5.googleusercontent.com/lLsqIurKXXKgSQ0tpBEXfL8iG8dIlLmWZrKvGe2Aqwm-9i8MQujtWVvcfZWSB2DGIgACSdYWt7k88v_4LWNHgX9LJ3vGs2lW-QhN6e-ko4Mh5SDiIK1S_w1hLetLJO4ukf-Sl-pV)

To gain control of a character, click on their box in this column. You should be given a message saying:

![](https://lh6.googleusercontent.com/YTCE-JsPPDbPAxaz7Wyp3udh4ukCEiwyyUlZns6YhRlYPlU3nMdOpT8B-ySjK-1dJ2Zo0qixYOCyhJbOeAtKPEtr1aV68Y1jx59h055wdGodY8mZYqgJrWd0PJinnZrSQQn_8wiM)

You should also see a list of their available emotions:

![](https://lh5.googleusercontent.com/145EXo4Zx_wMDWojeauOzDao8YMoawNq2opwX-O0yC_UZ8s6KixWHvwmE2eJHGavseexjeJjQNeFSPesbnUor71bbAK5ILDwTDTNkRp8vigRj-s6PE-nocaZU-aP4XIm0EI3g7dA)

## The Stage

The stage is broken up into 2 Levels and 8 Positions with an "ease" transition between each of the spots. (Notice that Level 0 and Position 0 & 7 are "off-camera)" You can navigate your active character to the different locations (and change the direction your character is facing) by using the **Arrow Keys**.

![](https://lh4.googleusercontent.com/nfCLOq2Ltq9OWuhCAppTGLlkP4sOHLbeiqmuDd0d5SH3Cfj8iCa6xJH0NY_vqnArrVT4M7t9COSdv8pJ9kABxzW5-5fhC9Tw-MLKQ0tyPpqOsBxc0EwiOcvqO79jFnKkUvLfCxXA)

The bottom of the stage is also draggable so you can resize the stage to better fit the characters. There is currently no way for players to resize the characters themselves.

*(Note that resizing the stage will not ***resize*** the stage for everyone else connected)*

You can also change the background for everyone connected by using the URL box at the bottom of the application:

![](https://lh3.googleusercontent.com/puC8kCAOuRdnk-1zTcpQIKLtydUzWfHbgAGukUjVykzTl8upvhc7ZYWJgO3ghW8jKpQvPXE-VTS9KvabQ6gxf7o7AgAs8UnE7sGt_z1eLT9lYtaTyYAnHiGIokqRr1oUfcif_zwf)

*(The Reset button will put the forest background back)*

You can also add an animation for everyone connected to view by using the URL box at the bottom of the application:

![](https://lh6.googleusercontent.com/QydrPbB_2EAHG4zIIaeLLHiD1c6q6ByQHwRX-7F4Kt0xiSHKPLBxp9DZckqMBjGFkOcMiEmysY8GVm9olUmiOuFXoyg4_sbKygioFk3GD5xID3v1BAAwAxKxr5IARg1Jjz74cK1O)

*(The Reset button will set the animation to be nothing and is used to clean the stage)*

## Emoting

Players should be able to switch their active characters emotion by simply using one of the following default hotkeys:

*(You can now bind emotions to something else if you don't like it)*

```sh
q: 'angry'
w: 'concern'
e: 'confused'
r: 'default'
t: 'furious'
y: 'happy'
u: 'kiss'
i: 'oh'
o: 'question'
p: 'sad'
[: 'wink'
```

**Bonus:**

```sh 
V: 'toggle invisibility'
```

*(Note that you must press Shift+V to toggle visibility. Make sure you don't release Shift before releasing v. It's a bit buggy and particular right now)*

*(Note that if your character doesn't have access that emotion, then they will disappear)*