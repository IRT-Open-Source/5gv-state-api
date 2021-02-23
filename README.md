| [![5G-VICTORI logo](doc/images/5g-victori-logo.png)](https://www.5g-victori-project.eu/) | This project has received funding from the European Union’s Horizon 2020 research and innovation programme under grant agreement No 857201. The European Commission assumes no responsibility for any content of this repository. | [![Acknowledgement: This project has received funding from the European Union’s Horizon 2020 research and innovation programme under grant agreement No 857201.](doc/images/eu-flag.jpg)](https://ec.europa.eu/programmes/horizon2020/en) |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |


# State API

Service which exposes an API to persist and query system state information.

## What is this?

The State API service is part of the [platform](../../../5gv-platform) for media caching on trains. It exposes a REST API via which clients can update and query the platform's state. Also it provides a Gateway via which it multicasts state changes.

## How does it work?

The figure below illustrates the software modules that make up the State API Service. The Cache State and Aggregator providers manage between the consumer interfaces -- the Event Gateway and HTTP API -- and the State DB. The State DB is a database that stores both the state of the cache as well as the current and historical configurations of the [Aggregator](../../../5gv-aggregator) (as defined by users through the [Configurator UI](../../../5gv-configurator-ui)).

![Software components of the State API](https://docs.google.com/drawings/d/1M-Ez2_OM4T_-UdAkPOBMtrU7AQ36TNI6beFeitVgCtw/export/svg)

Via the Event Gateway, consumers receive updates about changes in the status. An example of a consumer is the [Sample Streaming Client](../../../5gv-sample-streaming-client). The gateway keeps the Sample Streamign Client informed about the current availability of cached streams. The Event Gateway primarily uses WebSockets for message transmission, but provides a number of fallback protocols for clients that do not support WebSockets. The Event Gateway is primarily intended for communication with consumers that are not part of the [Platform](../../../5gv-platform). Real-time communication between platform components runs via the [Message Streamer](../../../5gv-message-broker).

Using the HTTP API, consumers query or change the system state.

## API

The State API exposes following HTTP endoints to query and change the system state:

- `state-api/aggregator/config`
  - `GET`: list available configurations
    - **Returns**: [DataBasePage](../../../5gv-dto/blob/master/src/state-api/impl/data-base-page.dto.ts)<[AggregatorConfiguration](../../../5gv-dto/blob/master/src/aggregator/impl/config.dto.ts)>
  - `POST`: apply a new aggregator configuration
    - **Body**: [AggregatorConfiguration](../../../5gv-dto/blob/master/src/aggregator/impl/config.dto.ts)
- `state-api/cache-state`
  - `POST`: initialise a new cache state
    - **Body**: [CacheStateConfigItem](../../../5gv-dto/blob/master/src/state-api/impl/cache-state-config-item.dto.ts)[]
- `state-api/cache-state/streams`
  - `GET`: list of streaming media items
    - **Returns**: [DataBasePage](../../../5gv-dto/blob/master/src/state-api/impl/data-base-page.dto.ts)<[CacheAsset](../../../5gv-dto/blob/master/src/state-api/impl/cache-asset.dto.ts)>
- `state-api/cache-state/streams/availability`
  - `GET`: return availability statistic
    - **Returns**: [Availability](../../../5gv-state-api/blob/master/src/cache-state/dto/availability.dto.ts)
- `state-api/cache-state/streams/missing`
  - `GET`: list streaming media items missing in the cache
    - **Returns**: [DataBasePage](../../../5gv-dto/blob/master/src/state-api/impl/data-base-page.dto.ts)<[CacheAsset](../../../5gv-dto/blob/master/src/state-api/impl/cache-asset.dto.ts)>
- `state-api/cache-state/streams/available`
  - `GET`: list of streaming media items available in the cache
    - **Returns**: [DataBasePage](../../../5gv-dto/blob/master/src/state-api/impl/data-base-page.dto.ts)<[CacheAsset](../../../5gv-dto/blob/master/src/state-api/impl/cache-asset.dto.ts)>
  - `POST`: set availability of one or more streaming media items
    - **Body**: [CacheAssetInfo](../../../5gv-dto/blob/master/src/state-api/impl/stream-info.dto.ts)
- `state-api/cache-state/streams/:id`
  - `GET`: retrieve streaming media item with given id
    - **Parameter** `id`: caching URL hash of the streaming media item
    - **Returns**: [CacheAsset](../../../5gv-dto/blob/master/src/state-api/impl/cache-asset.dto.ts)[]
- `state-api/cache-state/streams/:id/available`
  - `PATCH`: set availability of one cache asset
    - **Parameter** `id`: caching URL hash of the cache asset
    - **Body**: boolean
- `state-api/cache-state/media-items`
  - `GET`: lists available media items
    - **Returns**: [DataBasePage](../../../5gv-dto/blob/master/src/state-api/impl/data-base-page.dto.ts)<[MediaItem](../../../5gv-dto/blob/master/src/state-api/impl/media-item.dto.ts)>
- `state-api/cache-state/media-items/:id`
  - `GET`: returns media item with given id
    - **Parameter**: `id`: id of the media item
    - **Returns**: [MediaItem](../../../5gv-dto/blob/master/src/state-api/impl/media-item.dto.ts)[]
- `state-api/cache-state/media-items/:id/availability`
  - `GET`: returns availability of streaming media items for the given media item id
    - **Parameter**: `id`: id of the media item
    - **Returns**: [Availability](../../../5gv-dto/blob/master/src/state-api/impl/availability.dto.ts)
- `state-api/cache-state/media-items/:id/available`
  - `GET`: returns available cache assets for the given media item id
    - **Parameter**: `id`: id of the media item
    - **Returns**: [DataBasePage](../../../5gv-dto/blob/master/src/state-api/impl/data-base-page.dto.ts)<[CacheAsset](../../../5gv-dto/blob/master/src/state-api/impl/cache-asset.dto.ts)>
- `state-api/cache-state/media-items/:id/missing`
  - `GET`: returns missing cache assets for the given media item id
    - **Parameter**: `id`: id of the media item
    - **Returns**: [DataBasePage](../../../5gv-dto/blob/master/src/state-api/impl/data-base-page.dto.ts)<[CacheAsset](../../../5gv-dto/blob/master/src/state-api/impl/cache-asset.dto.ts)>
- `state-api/cache-state/media-items/:id/streams`
  - `GET`: returns cache assets for the given media item id
    - **Parameter**: `id`: id of the media item
    - **Returns**: [DataBasePage](../../../5gv-dto/blob/master/src/state-api/impl/data-base-page.dto.ts)<[CacheAsset](../../../5gv-dto/blob/master/src/state-api/impl/cache-asset.dto.ts)>

## Technologie used

- [Nest.js](https://nestjs.com/)

## Install, build, run

**Note:** _Typically you would use the `up.sh` script from the [Platform](../../../5gv-platform) project to install, build and run this service as part of a composite of docker services. Read on if you intend to run the service directly on your host system._

**Prerequestits**: Following software needs to be installed on your host machine in order to execute the subsequent steps.

- [Node.js](https://nodejs.org/en/)
- [NPM](https://www.npmjs.com/)

First, `git clone` this project and change into its root directory. Than run the following command to install its dependencies:

```bash
$ npm install
```

You can than run the service in three different modes.

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

With following command you can build a [docker image](https://www.docker.com) for this service. But again, typically you use the startup script `up.sh` of the [Platform](../../../5gv-platform) project to do the job.

```bash
$ DOCKER_BUILDKIT=1 docker build --ssh gitlab="$HOME/.ssh/<<your_private_key_name>>" -t state-api .
```

Replace `<<your_private_key_name>>` by the name of the private key used to authenticate at the repository.
