//import * as utils from '@dcl/ecs-scene-utils'
import { AudioSource, engine, Entity, GltfContainer, Transform,TransformType } from "@dcl/sdk/ecs"
import { Vector3 } from "@dcl/sdk/math"
import { triggerAreaSystem } from "./utils/triggerArea"
/*
export class Crown {
  constructor(model: GLTFShape, transform: Transform) {
    super()
    //engine.addEntity(this)
    this.addComponent(model)
    this.addComponent(transform)
    this.addComponent(new AudioSource(new AudioClip('sounds/win.mp3')))

    // Create trigger for crown
    this.addComponent(
      new utils.TriggerComponent(
        new utils.TriggerBoxShape(new Vector3(2.5, 2.5, 2.5)),
        {
          onCameraEnter: () => {
            // Hide the crown and play sound
            this.getComponent(Transform).scale.setAll(0)
            this.getComponent(AudioSource).playOnce()
          },
          onCameraExit: () => {
            this.getComponent(utils.TriggerComponent).enabled = false
          }
        }
      )
    )

  }
}*/

/**
 * Sound is a separated from the coin entity so that you can
 * still hear it even when the coin is removed from the engine.
 */
const crownPickupSound = engine.addEntity()
Transform.create(crownPickupSound)
AudioSource.create(crownPickupSound, { audioClipUrl: 'sounds/win.mp3' })

export function createCrown(
  model: string,
  transform:TransformType
): Entity {
  const entity = engine.addEntity()
  GltfContainer.create(entity, { src: model })
  Transform.create(entity, transform)

  const size = Vector3.create(2.5, 2.5, 2.5)
  const centerOffset = Vector3.Zero()
  
  triggerAreaSystem.setTriggerArea(entity, size, centerOffset)
 
  triggerAreaSystem.onPlayerEnter(entity, () => {
    //how can it detect player enter if is null
    triggerAreaSystem.removeTriggerArea(entity)
    AudioSource.getMutable(crownPickupSound).playing = true 
    const playerPosition = Transform.getOrNull(engine.PlayerEntity)?.position || Vector3.Zero()
    //console.log("engine.PlayerEntity",Transform.getOrNull(engine.PlayerEntity),playerPosition,AudioSource.get(crownPickupSound).playing) 
    Transform.getMutable(crownPickupSound).position = playerPosition//.position
    engine.removeEntity(entity)  
  })

  return entity
}