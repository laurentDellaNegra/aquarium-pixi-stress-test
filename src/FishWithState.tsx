import { useTick } from '@pixi/react'
import { Application, Renderer } from 'pixi.js'
import { useCallback, useState } from 'react'
import { Fish } from './Fish'

interface Position {
  x: number
  y: number
  rotation: number
}

interface Props {
  fish: Fish
  app: Application<Renderer>
}

export default function FishWithState({ fish, app }: Props) {
  const [position, setPosition] = useState<Position>({
    rotation: fish.rotation,
    x: fish.x,
    y: fish.y,
  })

  const stagePadding = 100
  const boundWidth = app.screen.width + stagePadding * 2
  const boundHeight = app.screen.height + stagePadding * 2

  const animate = useCallback(() => {
    setPosition((oldPosition) => {
      const newPosition = { ...oldPosition }

      // Animate fish
      fish.direction += fish.turnSpeed * 0.01
      newPosition.x += Math.sin(fish.direction) * fish.speed
      newPosition.y += Math.cos(fish.direction) * fish.speed
      newPosition.rotation = -fish.direction - Math.PI / 2

      if (newPosition.x < -stagePadding) newPosition.x += boundWidth
      if (newPosition.x > app.screen.width + stagePadding)
        newPosition.x -= boundWidth
      if (newPosition.y < -stagePadding) newPosition.y += boundHeight
      if (newPosition.y > app.screen.height + stagePadding)
        newPosition.y -= boundHeight

      return newPosition
    })
  }, [app.screen.height, app.screen.width, boundHeight, boundWidth, fish])

  useTick(animate)

  return (
    <pixiSprite
      texture={fish.texture}
      anchor={0.5}
      scale={fish.scale}
      rotation={position.rotation}
      x={position.x}
      y={position.y}
    />
  )
}
