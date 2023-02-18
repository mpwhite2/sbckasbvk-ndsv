function CreateWasp (C: number, R: number) {
    Wasp = sprites.create(assets.image`Wasp`, SpriteKind.Enemy)
    tiles.placeOnTile(Wasp, tiles.getTileLocation(C, R))
    game.onUpdateInterval(200, function() { 
        story.spriteMoveToLocation(Wasp, TargetX, TargetY, 70)
    })
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
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    setDir(r)
    r = true
})
function Fire (X: number, Y: number, image2: Image) {
    projectile = sprites.createProjectileFromSprite(image2, mySprite, X, Y)
}
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    setDir(d)
    d = true
})
let location: tiles.Location = null
let projectile: Sprite = null
let dir = false
let l = false
let r = false
let u = false
let mySprite: Sprite = null
let d = false
let TargetY = 0
let TargetX = 0
let Wasp: Sprite = null
let WaspRate = 200
d = true
color.setPalette(
color.GrayScale
)
color.startFadeFromCurrent(color.Arcade, 500)
if (game.ask("Input a name?") || !(blockSettings.exists("Name"))) {
    blockSettings.writeString("Name", game.askForString("Please input a name"))
}
color.setPalette(
color.GrayScale
)
color.startFadeFromCurrent(color.Arcade, 500)
mySprite = sprites.create(assets.image`Front`, SpriteKind.Player)
tiles.setCurrentTilemap(tilemap`Enter`)
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
game.onUpdateInterval(500, function () {
    location = tiles.getTilesByType(assets.tile`myTile0`)._pickRandom()
    CreateWasp(location.column, location.row)
})
game.onUpdateInterval(200, function () {
    TargetX = mySprite.x + randint(-20, 20)
    TargetY = mySprite.y + randint(-20, 20)
})
