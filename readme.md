# @1mill/kafka

```bash
npm install @1mill/kafka
```

```js
const { Kafka } = require('@1mill/kafka')

const kafka = new Kafka({
  brokers: 'https://rapids-1:9092,https://rapids-2:9092/' || process.env.1MILL_KAFKA_KAFKAJS_BROKERS,
  id: 'my-kafka-client-id' || process.env.1MILL_KAFKA_KAFKAJS_ID,
  mechanism: 'scram-sha-256' || process.env.1MILL_KAFKA_KAFKAJS_MECHANISM,
  password: 'my-password' || process.env.1MILL_KAFKA_KAFKAJS_PASSWORD,
  username: 'my-username' || process.env.1MILL_KAFKA_KAFKAJS_USERNAME,
})

```

|           | Required | Type            | Default                                   | Notes                                                                                                               |
|-----------|----------|-----------------|-------------------------------------------|---------------------------------------------------------------------------------------------------------------------|
| brokers   | yes      | [String, Array] | process.env.1MILL_KAFKA_KAFKAJS_BROKERS   | 'https://my-broker-1:9092/,https://my-broker-2:9092/' OR ['https://my-broker-1:9092/', 'https://my-broker-2:9092/'] |
| id        | yes      | String          | process.env.1MILL_KAFKA_KAFKAJS_ID        |                                                                                                                     |
| mechanism |          | String          | process.env.1MILL_KAFKA_KAFKAJS_MECHANISM | Options: 'plain', 'scram-sha-256', or 'scram-sha-512'                                                               |
| password  |          | String          | process.env.1MILL_KAFKA_KAFKAJS_PASSWORD  |                                                                                                                     |
| username  |          | String          | process.env.1MILL_KAFKA_KAFKAJS_USERNAME  |                                                                                                                     |

```js
const { Cloudevent } = require('@1mill/cloudevents')
const { Kafka } = require('@1mill/kafka')

const cloudevent = new Cloudevent({ ... })
const kafka = new Kafka({ ... })

await kafka.emit({ cloudevent })
```
