namespace SpriteKind {
    export const Wasp = SpriteKind.create()
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
    Queen.follow(mySprite2, 50)
    QueenHP.attachToSprite(Queen)
    tiles.placeOnTile(Queen, tiles.getTileLocation(Col, Row))
    Queen.setFlag(SpriteFlag.GhostThroughWalls, true)
}
function CreateWasp (C: number, R: number) {
    Wasp = sprites.create(assets.image`Wasp`, SpriteKind.Wasp)
    tiles.placeOnTile(Wasp, tiles.getTileLocation(C, R))
    Wasp.follow(mySprite2, 50)
    Wasp.setFlag(SpriteFlag.GhostThroughWalls, true)
    characterAnimations.loopFrames(
    Wasp,
    assets.animation`Flying up or down`,
    100,
    characterAnimations.rule(Predicate.MovingUp)
    )
    characterAnimations.loopFrames(
    Wasp,
    assets.animation`Flying up or down`,
    100,
    characterAnimations.rule(Predicate.MovingDown)
    )
    characterAnimations.loopFrames(
    Wasp,
    assets.animation`Flying left or right`,
    500,
    characterAnimations.rule(Predicate.MovingRight)
    )
    characterAnimations.loopFrames(
    Wasp,
    assets.animation`Flying left or right`,
    500,
    characterAnimations.rule(Predicate.MovingLeft)
    )
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
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
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
})
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    setDir(l)
    l = true
})
statusbars.onZero(StatusBarKind.EnemyHealth, function (status) {
    sprites.destroy(status.spriteAttachedTo())
    sprites.destroy(status)
})
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    setDir(r)
    r = true
})
scene.onOverlapTile(SpriteKind.Projectile, assets.tile`myTile0`, function (sprite, location) {
    CreateQueen(location.column, location.row)
    for (let index = 0; index < 10; index++) {
        CreateWasp(location.column, location.row)
        pause(100)
    }
    tiles.setTileAt(location, assets.tile`myTile1`)
})
sprites.onOverlap(SpriteKind.Enemy, SpriteKind.Player, function (sprite, otherSprite) {
    info.changeLifeBy(-1)
    PlayerHealth.value += -1
})
function Fire (X: number, Y: number, image2: Image) {
    projectile = sprites.createProjectileFromSprite(image2, mySprite, X, Y)
}
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    setDir(d)
    d = true
})
info.onLifeZero(function () {
    game.gameOver(false)
})
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Wasp, function (sprite, otherSprite) {
    sprites.destroy(sprite)
    sprites.destroy(otherSprite, effects.disintegrate, 500)
    info.changeScoreBy(1)
})
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function (sprite, otherSprite) {
    statusbars.getStatusBarAttachedTo(StatusBarKind.EnemyHealth, otherSprite).value += -1
    sprites.destroy(sprite)
    info.changeScoreBy(1)
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Wasp, function (sprite, otherSprite) {
    sprites.destroy(otherSprite)
    info.changeLifeBy(-1)
    PlayerHealth.value += -1
})
let location1: tiles.Location = null
let projectile: Sprite = null
let dir = false
let l = false
let r = false
let u = false
let Wasp: Sprite = null
let QueenHP: StatusBarSprite = null
let Queen: Sprite = null
let mySprite2: Sprite = null
let PlayerHealth: StatusBarSprite = null
let mySprite: Sprite = null
let d = false
info.setLife(100)
let TargetX = 0
let TargetY = 0
let WaspRate = 1000
d = true
color.setPalette(
color.GrayScale
)
color.startFadeFromCurrent(color.Arcade, 500)
if (game.ask("Input a name?") || !(blockSettings.exists("Name"))) {
    blockSettings.writeString("Name", game.askForString("Please input a name", 12))
}
color.setPalette(
color.GrayScale
)
color.startFadeFromCurrent(color.Arcade, 500)
mySprite = sprites.create(assets.image`Front`, SpriteKind.Player)
PlayerHealth = statusbars.create(16, 2, StatusBarKind.Health)
PlayerHealth.max = 100
PlayerHealth.attachToSprite(mySprite)
PlayerHealth.setColor(4, 13)
tiles.setCurrentTilemap(tilemap`Enter`)
tiles.placeOnTile(mySprite, tiles.getTileLocation(48, 13))
controller.moveSprite(mySprite)
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
game.onUpdateInterval(WaspRate, function () {
    if (tiles.getTilesByType(assets.tile`myTile0`).length > 0) {
        location1 = tiles.getTilesByType(assets.tile`myTile0`)._pickRandom()
        CreateWasp(location1.column, location1.row)
    }
})
game.onUpdateInterval(2000, function () {
    if (info.life() < 100) {
        info.changeLifeBy(1)
        PlayerHealth.value += 1
    }
})
game.onUpdateInterval(500, function () {
    mySprite2.setPosition(mySprite.x + randint(-30, 30), mySprite.y + randint(-30, 30))
})
