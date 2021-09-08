# @1mill/kafka

```bash
npm install @1mill/kafka
```

```js
const { Cloudevent } = require('@1mill/cloudevents')
const { Kafka } = require('@1mill/kafka')

const kafka = new Kafka({
  brokers: 'https://rapids-1:9092,https://rapids-2:9092/' || process.env.MILL_KAFKAJS_BROKERS,
  id: 'my-kafka-client-id' || process.env.MILL_KAFKAJS_ID,
  mechanism: 'scram-sha-256' || process.env.MILL_KAFKAJS_MECHANISM,
  password: 'password' || process.env.MILL_KAFKAJS_PASSWORD,
  username: 'username' || process.env.MILL_KAFKAJS_USERNAME,
})

const cloudevent = new Cloudevent({ ... })

await kafka.emit({ cloudevent })

```

