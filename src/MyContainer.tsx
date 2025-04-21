import { extend, useTick, useApplication } from '@pixi/react'
import {
  Assets,
  Container,
  DisplacementFilter,
  Sprite,
  Texture,
  TilingSprite,
  UPDATE_PRIORITY,
} from 'pixi.js'
import { useCallback, useEffect, useRef, useState } from 'react'
import Fish from './Fish'
import { useControls } from 'leva'
import FishWithState from './FishWithState'
import Stats from 'stats.js'

// Extend PixiJS components for JSX usage
extend({ Container, Sprite, TilingSprite })

// Fish type definition
interface Fish extends Sprite {
  direction: number
  speed: number
  turnSpeed: number
}

const createFiches = (nb: number, screenWidth: number, screeHeight: number) => {
  return Array.from({ length: nb }).map((_, i) => {
    const fishAsset = `fish${(i % 5) + 1}`
    const fish = new Sprite(Texture.from(fishAsset)) as Fish
    fish.anchor.set(0.5)
    fish.direction = Math.random() * Math.PI * 2
    fish.speed = 2 + Math.random() * 2
    fish.turnSpeed = Math.random() - 0.8
    fish.x = Math.random() * screenWidth
    fish.y = Math.random() * screeHeight
    fish.scale.set(0.5 + Math.random() * 0.2)
    return fish
  })
}

export default function FishPond() {
  const { app } = useApplication()
  const [assetsLoaded, setAssetsLoaded] = useState(false)
  const [fishesInitialized, setFishesInitialized] = useState(false)
  const [fishes, setFishes] = useState<Fish[]>([])
  const overlayRef = useRef<TilingSprite | null>(null)
  const [nbFishs, setNbFishs] = useState(5)

  const { withState } = useControls({
    nbFishs: {
      label: 'Nb of fishs',
      value: nbFishs,
      min: 5,
      max: 50000,
      step: 1000,
      onEditEnd(value) {
        setNbFishs(value)
      },
    },
    withState: {
      label: 'with state',
      value: false,
    },
  })

  // Load assets
  useEffect(() => {
    const loadAssets = async () => {
      const assets = [
        {
          alias: 'background',
          src: 'https://pixijs.com/assets/tutorials/fish-pond/pond_background.jpg',
        },
        {
          alias: 'fish1',
          src: 'https://pixijs.com/assets/tutorials/fish-pond/fish1.png',
        },
        {
          alias: 'fish2',
          src: 'https://pixijs.com/assets/tutorials/fish-pond/fish2.png',
        },
        {
          alias: 'fish3',
          src: 'https://pixijs.com/assets/tutorials/fish-pond/fish3.png',
        },
        {
          alias: 'fish4',
          src: 'https://pixijs.com/assets/tutorials/fish-pond/fish4.png',
        },
        {
          alias: 'fish5',
          src: 'https://pixijs.com/assets/tutorials/fish-pond/fish5.png',
        },
        {
          alias: 'overlay',
          src: 'https://pixijs.com/assets/tutorials/fish-pond/wave_overlay.png',
        },
        {
          alias: 'displacement',
          src: 'https://pixijs.com/assets/tutorials/fish-pond/displacement_map.png',
        },
      ]

      await Assets.load(assets)
      setAssetsLoaded(true)
    }

    loadAssets()
  }, [])

  // Setup displacement filter
  useEffect(() => {
    if (!assetsLoaded || !app) return

    const sprite = Sprite.from('displacement')
    sprite.texture.source.addressMode = 'repeat'
    const filter = new DisplacementFilter({
      sprite,
      scale: 50,
    })
    app.stage.filters = [filter]

    // Load fiches
    setFishes(createFiches(nbFishs, app.screen.width, app.screen.height))
    setFishesInitialized(true)
  }, [assetsLoaded, app, nbFishs])

  const animate = useCallback((context: TilingSprite) => {
    if (!context) return
    context.tilePosition.x -= 1
    context.tilePosition.y -= 1
  }, [])

  // Animation tick
  useTick({
    callback() {
      // this === context
      if (!this.current) return
      animate(this.current)
    },
    context: overlayRef,
    isEnabled: true,
    priority: UPDATE_PRIORITY.LOW,
  })

  if (!assetsLoaded || !fishesInitialized) return null

  const isLandscape = app.screen.width > app.screen.height

  console.log('MyContainer render')

  const stats = new Stats()
  const children = [...stats.dom.children]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children.forEach((child: any) => {
    child.style.display = 'block'
  })
  document.body.appendChild(stats.dom)

  app.ticker.add(() => {
    stats.update() // Updates FPS/MS counters every frame
  })

  return (
    <>
      {/* Background */}
      <pixiSprite
        texture={Texture.from('background')}
        anchor={0.5}
        x={app.screen.width / 2}
        y={app.screen.height / 2}
        scale={2}
        width={isLandscape ? app.screen.width * 1.2 : app.screen.width}
        height={isLandscape ? app.screen.height * 1.2 : app.screen.height}
      />
      {/* Fish Container */}
      {withState ? (
        <pixiContainer>
          {fishes.map((fish, i) => (
            <FishWithState key={i} fish={fish} app={app} />
          ))}
        </pixiContainer>
      ) : (
        <pixiContainer>
          {fishes.map((fish, i) => (
            <Fish key={i} fish={fish} app={app} />
          ))}
        </pixiContainer>
      )}
      {/* Water Overlay */}
      <pixiTilingSprite
        ref={overlayRef}
        texture={Texture.from('overlay')}
        width={app.screen.width}
        height={app.screen.height}
      />
    </>
  )
}
