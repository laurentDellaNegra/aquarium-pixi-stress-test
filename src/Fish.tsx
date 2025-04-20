import { useApplication, useTick } from '@pixi/react'
import { Application, Renderer, Sprite, Ticker, UPDATE_PRIORITY } from 'pixi.js'
import { useCallback, useRef } from 'react'

interface Fish extends Sprite {
  direction: number
  speed: number
  turnSpeed: number
}

interface Props {
  fish: Fish
  app: Application<Renderer>
}

export default function Fish({ fish, app }: Props) {
  const fishRef = useRef<Sprite | null>(null)

  const stagePadding = 100
  const boundWidth = app.screen.width + stagePadding * 2
  const boundHeight = app.screen.height + stagePadding * 2

  const animate = useCallback((delta: Ticker, context: Sprite) => {
    if (!context) return

    // Animate fish
    fish.direction += fish.turnSpeed * 0.01
    context.x += Math.sin(fish.direction) * fish.speed
    context.y += Math.cos(fish.direction) * fish.speed
    context.rotation = -fish.direction - Math.PI / 2

    if (context.x < -stagePadding) context.x += boundWidth
    if (context.x > app.screen.width + stagePadding) context.x -= boundWidth
    if (context.y < -stagePadding) context.y += boundHeight
    if (context.y > app.screen.height + stagePadding) context.y -= boundHeight
  }, [])

  useTick({
    callback(delta) {
      // this === context
      if (!this.current) return
      animate(delta, this.current)
    },
    context: fishRef,
    isEnabled: true,
    priority: UPDATE_PRIORITY.HIGH,
  })

  return (
    <pixiSprite
      ref={fishRef}
      texture={fish.texture}
      anchor={0.5}
      scale={fish.scale}
    />
  )
}
