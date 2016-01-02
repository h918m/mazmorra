import Dungeon from '../../../../shared/Dungeon'
import helpers from '../../../../shared/helpers'

import GameObject from '../../behaviors/GameObject'
import HasLifebar from '../../behaviors/HasLifebar'

import Character from '../../entities/Character'
import Enemy from '../../entities/Enemy'
import Item from '../../entities/Item'
import Chest from '../../entities/Chest'
import TileSelectionPreview from '../../entities/TileSelectionPreview'
import LightPole from '../../entities/LightPole'
import Door from '../../entities/Door'

export default class LevelGenerator {

  constructor (container, colyseus) {
    this.container = container
    this.colyseus = colyseus

    // visual groups
    this.ground = []
    this.wall = []
    this.entities = []
  }

  setGrid (grid) {
    this.grid = grid
  }

  createEntity (entity) {
    var element = null

    switch (entity.type) {
      case helpers.ENTITIES.DOOR:
        element = new Door()
        break;

      case helpers.ENTITIES.ENEMY:
        element = new Enemy(entity)
        break;

      case helpers.ENTITIES.PLAYER:
        element = new Character(entity)

        if (entity.id !== this.colyseus.id) {
          element.addBehaviour(new HasLifebar, this)
        }
        break;

      case helpers.ENTITIES.LIGHT:
        element = new LightPole()
        break;
    }

    this.fixTilePosition(element.position, entity.position.x, entity.position.y)
    this.container.add(element)

    element.addBehaviour(new GameObject, this)
    element.userData.position = entity.position
    return element
  }

  createTiles (mapkind = 'grass') {
    var xlen = this.grid.length
      , ylen = this.grid[0].length;

    for (var x = 0; x < xlen; ++x) {
      for (var y = 0; y < ylen; ++y) {
        var tile = this.grid[x][y];

        if (tile & helpers.TILE_TYPE.EMPTY) {
          continue;
        }

        // map 3d coordinates (-width/2~width/2 x -height/2~height/2)
        this.addTile(mapkind, tile, x, y);
      }
    }
  }

  addTile (mapkind, type, x, y) {
    var resource = null
      , group = null

    if (type & helpers.TILE_TYPE.FLOOR) {
      resource = 'tile-'+mapkind+'-ground'

    } else if (type & helpers.TILE_TYPE.WALL) {
      resource = (type & helpers.CORNER) ? null : 'tile-'+mapkind+'-wall'
    }

    // ignore corners for a while
    if (resource === null) return

    var tile = ResourceManager.createTileMesh(resource)

    // set tile position
    this.fixTilePosition(tile.position, x, y)

    if (type & helpers.TILE_TYPE.FLOOR) {
      group = this.ground

      // keep tile x/y reference on Object3D
      tile.userData.x = x
      tile.userData.y = y

      tile.position.y = -0.5;
      tile.rotation.x = Math.PI / 2;

      //
      // Add wall tiles on room connections
      //
      if (type & helpers.DIRECTION.NORTH) {
        this.addTile(mapkind, helpers.TILE_TYPE.WALL | helpers.DIRECTION.EAST, x, y);
        this.addTile(mapkind, helpers.TILE_TYPE.WALL | helpers.DIRECTION.WEST, x, y);
        this.addTile(mapkind, helpers.TILE_TYPE.WALL | helpers.DIRECTION.EAST, x, y + 1);
        this.addTile(mapkind, helpers.TILE_TYPE.WALL | helpers.DIRECTION.WEST, x, y + 1);

      } else if (type & helpers.DIRECTION.SOUTH) {
        this.addTile(mapkind, helpers.TILE_TYPE.WALL | helpers.DIRECTION.EAST, x, y);
        this.addTile(mapkind, helpers.TILE_TYPE.WALL | helpers.DIRECTION.WEST, x, y);
        this.addTile(mapkind, helpers.TILE_TYPE.WALL | helpers.DIRECTION.EAST, x, y - 1);
        this.addTile(mapkind, helpers.TILE_TYPE.WALL | helpers.DIRECTION.WEST, x, y - 1);

      } else if (type & helpers.DIRECTION.EAST) {
        this.addTile(mapkind, helpers.TILE_TYPE.WALL | helpers.DIRECTION.SOUTH, x, y);
        this.addTile(mapkind, helpers.TILE_TYPE.WALL | helpers.DIRECTION.NORTH, x, y);
        this.addTile(mapkind, helpers.TILE_TYPE.WALL | helpers.DIRECTION.SOUTH, x - 1, y);
        this.addTile(mapkind, helpers.TILE_TYPE.WALL | helpers.DIRECTION.NORTH, x - 1, y);

      } else if (type & helpers.DIRECTION.WEST) {
        this.addTile(mapkind, helpers.TILE_TYPE.WALL | helpers.DIRECTION.SOUTH, x, y);
        this.addTile(mapkind, helpers.TILE_TYPE.WALL | helpers.DIRECTION.NORTH, x, y);
        this.addTile(mapkind, helpers.TILE_TYPE.WALL | helpers.DIRECTION.SOUTH, x + 1, y);
        this.addTile(mapkind, helpers.TILE_TYPE.WALL | helpers.DIRECTION.NORTH, x + 1, y);
      }

    } else if (type & helpers.TILE_TYPE.WALL) {
      group = this.wall

      tile.position.y = 1
      tile.rotation.x = Math.PI;

      if (type & helpers.DIRECTION.NORTH) {
        tile.position.z += TILE_SIZE / 2

      } else if (type & helpers.DIRECTION.SOUTH) {
        tile.position.z -= TILE_SIZE / 2

      } else if (type & helpers.DIRECTION.EAST) {
        tile.rotation.y = Math.PI / 2
        tile.position.x -= TILE_SIZE / 2

      } else if (type & helpers.DIRECTION.WEST) {
        tile.rotation.y = Math.PI / 2
        tile.position.x += TILE_SIZE / 2

      }
    }

    group.push(tile)
    this.container.add(tile)
  }

  fixTilePosition(vec, x, y) {
    var xlen = this.grid.length
      , ylen = this.grid[0].length;

    vec.x = (x - (xlen / 2)) * TILE_SIZE
    vec.z = (y - (ylen / 2)) * TILE_SIZE

    return vec
  }

}