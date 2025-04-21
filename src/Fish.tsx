import { useTick } from '@pixi/react'
import { Application, Renderer, Sprite, UPDATE_PRIORITY } from 'pixi.js'
import { useCallback, useRef } from 'react'

export interface Fish extends Sprite {
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

  const animate = useCallback(
    (context: Sprite) => {
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
    },
    [app.screen.height, app.screen.width, boundHeight, boundWidth, fish]
  )

  useTick({
    callback() {
      // this === context
      if (!this.current) return
      animate(this.current)
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
