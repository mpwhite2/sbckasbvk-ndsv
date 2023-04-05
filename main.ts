namespace SpriteKind {
    export const Wasp = SpriteKind.create()
    export const Spider = SpriteKind.create()
    export const Egg = SpriteKind.create()
}
function CreateQueen (Col: number, Row: number) {
    Queen = sprites.create(img`
        ....ff.........ff...
        .....f........ff....
        .....ffffffffff.....
        ...fffffffffffff....
        ...fff1ffffff1ff....
        ....fffffffffff.....
        ....ffffffffff......
        .....55555555.......
        .1111ffffffff111111.
        11111555555551111111
        .11111fffffff111111.
        ......5555555.......
        ......ffffffff......
        .......5555555......
        .......fffffff......
        ........555555......
        .........ffffff.....
        ..........55555.....
        ............ffff....
        ................ff..
        `, SpriteKind.Enemy)
    QueenHP = statusbars.create(20, 2, StatusBarKind.EnemyHealth)
    QueenHP.setColor(2, 13)
    QueenHP.max = 30
    Queen.follow(mySprite2, 40)
    QueenHP.attachToSprite(Queen)
    tiles.placeOnTile(Queen, tiles.getTileLocation(Col, Row))
    Queen.setFlag(SpriteFlag.GhostThroughTiles, true)
}
function CreateWasp (C: number, R: number) {
    Wasp2 = sprites.create(assets.image`Wasp`, SpriteKind.Wasp)
    tiles.placeOnTile(Wasp2, tiles.getTileLocation(C, R))
    Wasp2.follow(mySprite2, 50)
    Wasp2.setFlag(SpriteFlag.GhostThroughTiles, true)
    if (Math.percentChance(5)) {
        Wasp2.setImage(img`
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . f f . . . . . . . 
            . . . . . . . f f . . . . . . . 
            . . . . . . 4 f f 4 . . . . . . 
            . . . . 4 4 4 f f 4 4 4 . . . . 
            . . . . . . 4 f f 4 . . . . . . 
            . . . . . . . f f . . . . . . . 
            . . . . . . . f f . . . . . . . 
            . . . . . . f . . f . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            `)
    } else {
        characterAnimations.loopFrames(
        Wasp2,
        assets.animation`Flying up or down`,
        100,
        characterAnimations.rule(Predicate.MovingUp)
        )
        characterAnimations.loopFrames(
        Wasp2,
        assets.animation`Flying up or down`,
        100,
        characterAnimations.rule(Predicate.MovingDown)
        )
        characterAnimations.loopFrames(
        Wasp2,
        assets.animation`Flying left or right`,
        500,
        characterAnimations.rule(Predicate.MovingRight)
        )
        characterAnimations.loopFrames(
        Wasp2,
        assets.animation`Flying left or right`,
        500,
        characterAnimations.rule(Predicate.MovingLeft)
        )
    }
}
function setDir (dir: boolean) {
    u = false
    r = false
    l = false
    d = false
    dir = true
}
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    setDir(u)
    u = true
})
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (blockSettings.readNumber("A") > 0 && IsGameRunning) {
        CreateSpider(mySprite.tilemapLocation().column, mySprite.tilemapLocation().row)
        blockSettings.writeNumber("A", blockSettings.readNumber("A") + -1)
    }
})
spriteutils.onSpriteKindUpdateInterval(SpriteKind.Wasp, 100, function (sprite) {
    sprite.follow(mySprite2, 50)
    if (spriteutils.getSpritesWithin(SpriteKind.Projectile, 60, sprite).length > 0) {
        sprite.follow(mySprite2, 0)
        spriteutils.setVelocityAtAngle(sprite, randint(0, 360), 20)
        timer.after(500, function () {
            sprite.follow(mySprite, 50)
        })
    } else {
        if (spriteutils.getSpritesWithin(SpriteKind.Spider, 50, sprite).length > 0) {
            sprite.follow(spriteutils.getSpritesWithin(SpriteKind.Wasp, 50, sprite)._pickRandom(), 50)
        }
    }
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Egg, function (sprite, otherSprite) {
    sprites.destroy(otherSprite)
    blockSettings.writeNumber("A", 5 + blockSettings.readNumber("A"))
})
spriteutils.onSpriteKindUpdateInterval(SpriteKind.Spider, 500, function (sprite) {
    if (spriteutils.getSpritesWithin(SpriteKind.Wasp, 40, sprite).length > 0) {
        sprite.follow(spriteutils.getSpritesWithin(SpriteKind.Wasp, 40, sprite)._pickRandom())
    }
})
sprites.onOverlap(SpriteKind.Spider, SpriteKind.Enemy, function (sprite, otherSprite) {
    sprites.destroy(sprite)
})
function CreateSpider (Col: number, Row: number) {
    Spider2 = sprites.create(assets.image`Spider`, SpriteKind.Spider)
    tiles.placeOnTile(Spider2, tiles.getTileLocation(Col, Row))
}
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    setDir(l)
    l = true
})
statusbars.onZero(StatusBarKind.EnemyHealth, function (status) {
    sprites.destroy(status.spriteAttachedTo())
    sprites.destroy(status)
})
function Enable_movment (Bool: boolean) {
    if (Bool) {
        controller.moveSprite(mySprite, 80, 80)
    } else {
        controller.moveSprite(mySprite, 0, 0)
    }
}
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    setDir(r)
    r = true
})
scene.onOverlapTile(SpriteKind.Projectile, assets.tile`myTile0`, function (sprite, location) {
    CreateQueen(location.column, location.row)
    tiles.setTileAt(location, assets.tile`myTile1`)
    timer.background(function () {
        for (let index = 0; index < 20; index++) {
            CreateWasp(location.column, location.row)
            pause(500)
        }
    })
})
function Quest2 () {
    tiles.setCurrentTilemap(tilemap`level4`)
    tiles.placeOnTile(mySprite, tiles.getTileLocation(46, 11))
    Popeggs(4)
}
sprites.onOverlap(SpriteKind.Enemy, SpriteKind.Player, function (sprite, otherSprite) {
    info.changeLifeBy(-1)
    PlayerHealth.value += -1
})
function Fire (X: number, Y: number, image2: Image) {
    projectile = sprites.createProjectileFromSprite(image2, mySprite, X, Y)
}
function startQuest () {
    IsGameRunning = true
    info.setLife(100)
    TargetX = 0
    TargetY = 0
    WaspRate = 1000
    d = true
    color.setPalette(
    color.GrayScale
    )
    color.startFadeFromCurrent(color.Arcade, 500)
    color.setPalette(
    color.GrayScale
    )
    color.startFadeFromCurrent(color.Arcade, 500)
    mySprite = sprites.create(assets.image`Front`, SpriteKind.Player)
    PlayerHealth = statusbars.create(16, 2, StatusBarKind.Health)
    PlayerHealth.max = 100
    PlayerHealth.attachToSprite(mySprite)
    PlayerHealth.setColor(4, 13)
    controller.moveSprite(mySprite, 80, 80)
    scene.cameraFollowSprite(mySprite)
    characterAnimations.loopFrames(
    mySprite,
    assets.animation`Up`,
    100,
    characterAnimations.rule(Predicate.MovingUp)
    )
    characterAnimations.loopFrames(
    mySprite,
    assets.animation`Down`,
    100,
    characterAnimations.rule(Predicate.MovingDown)
    )
    characterAnimations.loopFrames(
    mySprite,
    assets.animation`Left`,
    100,
    characterAnimations.rule(Predicate.MovingLeft)
    )
    characterAnimations.loopFrames(
    mySprite,
    assets.animation`Right`,
    100,
    characterAnimations.rule(Predicate.MovingRight)
    )
    mySprite2 = sprites.create(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `, SpriteKind.Player)
    mySprite2.setFlag(SpriteFlag.Ghost, true)
}
sprites.onOverlap(SpriteKind.Wasp, SpriteKind.Wasp, function (sprite, otherSprite) {
    sprite.x += randint(-3, 3)
    otherSprite.y += randint(-3, 3)
})
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    setDir(d)
    d = true
})
info.onLifeZero(function () {
    game.gameOver(false)
})
controller.A.onEvent(ControllerButtonEvent.Repeated, function () {
    if (IsGameRunning) {
        if (u == true) {
            Fire(0, -200, assets.image`Vert`)
        } else {
            if (d == true) {
                Fire(0, 200, assets.image`Vert`)
            } else {
                if (l == true) {
                    Fire(-200, 0, assets.image`Hori`)
                } else {
                    Fire(200, 0, assets.image`Hori`)
                }
            }
        }
    }
})
function Quest1 () {
    tiles.setCurrentTilemap(tilemap`Enter`)
    tiles.placeOnTile(mySprite, tiles.getTileLocation(48, 13))
    Quest = 1
    blockSettings.writeNumber("1", 1)
}
function ShowMenu1 () {
    story.showPlayerChoices("Enter Wasp territory", "More Quests will appear here soon")
    if (story.checkLastAnswer("More Quests will appear here soon")) {
        story.showPlayerChoices("Enter Wasp territory", "More Quests will appear here soon")
    }
    if (story.checkLastAnswer("Enter Wasp territory")) {
        if (!(blockSettings.exists("1"))) {
            startQuest()
            Quest2()
            Enable_movment(false)
            story.printCharacterText("Are you ready, " + blockSettings.readString("Name") + "? ")
            story.printCharacterText("You must cross the bridge and destroy the nest, but watch out for the Queen!")
            Enable_movment(true)
        } else {
            story.showPlayerChoices("Enter Wasp territory", "More Quests will appear here soon")
            game.reset()
            ShowMenu1()
        }
    }
}
scene.onOverlapTile(SpriteKind.Wasp, assets.tile`myTile0`, function (sprite, location) {
    blockSettings.writeNumber("A", blockSettings.readNumber("A") + 10)
    tiles.setTileAt(location, assets.tile`myTile1`)
})
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Wasp, function (sprite, otherSprite) {
    sprites.destroy(sprite)
    sprites.destroy(otherSprite, effects.disintegrate, 500)
    info.changeScoreBy(1)
    music.play(music.randomizeSound(music.createSoundEffect(WaveShape.Sine, 1, 2381, 0, 140, 500, SoundExpressionEffect.Warble, InterpolationCurve.Curve)), music.PlaybackMode.InBackground)
})
sprites.onOverlap(SpriteKind.Spider, SpriteKind.Wasp, function (sprite, otherSprite) {
    if (otherSprite.image.equals(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . f f . . . . . . . 
        . . . . . . . f f . . . . . . . 
        . . . . . . 4 f f 4 . . . . . . 
        . . . . 4 4 4 f f 4 4 4 . . . . 
        . . . . . . 4 f f 4 . . . . . . 
        . . . . . . . f f . . . . . . . 
        . . . . . . . f f . . . . . . . 
        . . . . . . f . . f . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `)) {
        sprites.destroy(sprite)
    } else {
        sprites.destroy(otherSprite)
    }
})
spriteutils.onSpriteKindUpdateInterval(SpriteKind.Enemy, 100, function (sprite) {
    timer.background(function () {
        if (sprites.allOfKind(SpriteKind.Wasp).length == 0) {
            Num = 60
            sprite.follow(mySprite2, 75,1000)
        }
        if (spriteutils.getSpritesWithin(SpriteKind.Projectile, 80, sprite).length > 0 && spriteutils.getSpritesWithin(SpriteKind.Wasp, 20, sprite).length > 0) {
            if (spriteutils.getSpritesWithin(SpriteKind.Wasp, 50, sprite).length > 0) {
                spriteutils.getSpritesWithin(SpriteKind.Wasp, 20, sprite)._pickRandom().follow(spriteutils.getSpritesWithin(SpriteKind.Projectile, 80, sprite)._pickRandom())
            } else {
                sprite.follow(mySprite2, 0)
                spriteutils.setVelocityAtAngle(sprite, 0 - spriteutils.angleFrom(sprite, spriteutils.getSpritesWithin(SpriteKind.Projectile, 40, sprite)._pickRandom()) + randint(-30, 30), 60)
                pause(500)
                sprite.follow(mySprite, 40)
            }
        }
    })
})
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function (sprite, otherSprite) {
    statusbars.getStatusBarAttachedTo(StatusBarKind.EnemyHealth, otherSprite).value += -1
    music.play(music.randomizeSound(music.createSoundEffect(WaveShape.Sine, 1, 3183, 0, 64, 500, SoundExpressionEffect.Warble, InterpolationCurve.Linear)), music.PlaybackMode.InBackground)
    sprites.destroy(sprite)
    info.changeScoreBy(1)
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Wasp, function (sprite, otherSprite) {
    sprites.destroy(otherSprite)
    info.changeLifeBy(-1)
    PlayerHealth.value += -1
})
function Popeggs (Eggs: number) {
    for (let index = 0; index < Eggs; index++) {
        mySprite3 = sprites.create(img`
            6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 
            6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 
            6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 
            6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 
            6 6 6 6 6 6 1 1 1 6 6 6 6 6 6 6 
            6 6 6 6 6 6 1 1 1 1 1 6 6 6 6 6 
            6 6 6 6 6 1 1 1 1 1 1 6 6 6 6 6 
            6 6 6 6 6 1 1 1 1 1 1 6 6 6 6 6 
            6 6 6 6 1 1 1 1 1 1 1 6 6 6 6 6 
            6 6 6 6 1 1 1 1 1 1 1 6 6 6 6 6 
            6 6 6 6 1 1 1 1 1 1 1 1 6 6 6 6 
            6 6 6 6 1 1 1 1 1 1 1 1 6 6 6 6 
            6 6 6 6 6 1 1 1 1 1 1 6 6 6 6 6 
            6 6 6 6 6 6 1 1 1 1 6 6 6 6 6 6 
            6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 
            6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 
            `, SpriteKind.Egg)
        tiles.placeOnRandomTile(mySprite3, tiles.tileImageAtLocation(tiles.getTileLocation(1, 1)))
    }
}
let location1: tiles.Location = null
let mySprite3: Sprite = null
let WaspRate = 0
let TargetY = 0
let TargetX = 0
let projectile: Sprite = null
let PlayerHealth: StatusBarSprite = null
let Spider2: Sprite = null
let mySprite: Sprite = null
let dir = false
let d = false
let l = false
let r = false
let u = false
let Wasp2: Sprite = null
let QueenHP: StatusBarSprite = null
let Queen: Sprite = null
let IsGameRunning = false
let Num = 0
let Quest = 0
let mySprite2: Sprite = null
blockSettings.writeNumber("A", 0)
controller.setRepeatDefault(0,200)
Num = 30
music.play(music.createSong(assets.song`mySong`), music.PlaybackMode.LoopingInBackground)
pause(100)
if (controller.B.isPressed()) {
    story.showPlayerChoices("Reset data?", "No! Keep my data!")
    if (story.checkLastAnswer("Reset data?")) {
    	
    }
}
Quest = null
IsGameRunning = false
if (game.ask("Input a name? R = reset ") || !(blockSettings.exists("Name"))) {
    blockSettings.writeString("Name", game.askForString("Please input a name", 12))
    if (blockSettings.readString("Name") == "R") {
        color.startFade(color.Black, color.Arcade, 1000)
        blockSettings.clear()
        game.reset()
    }
}
ShowMenu1()
game.onUpdateInterval(WaspRate, function () {
    if (IsGameRunning) {
        if (tiles.getTilesByType(assets.tile`myTile0`).length > 0 && sprites.allOfKind(SpriteKind.Wasp).length < 40) {
            location1 = tiles.getTilesByType(assets.tile`myTile0`)._pickRandom()
            CreateWasp(location1.column, location1.row)
        }
    }
})
game.onUpdateInterval(2000, function () {
    if (IsGameRunning) {
        if (info.life() < 100) {
            info.changeLifeBy(1)
            PlayerHealth.value += 1
        }
    }
})
game.onUpdateInterval(1000, function () {
    if (IsGameRunning && sprites.allOfKind(SpriteKind.Wasp).length + sprites.allOfKind(SpriteKind.Enemy).length == 0) {
        game.reset()
    }
})
game.onUpdateInterval(500, function () {
    if (IsGameRunning) {
        mySprite2.setPosition(mySprite.x + randint(0 - Num, Num), mySprite.y + randint(0 - Num, Num))
    }
})
