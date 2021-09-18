const { Kafka: KafkaJs } = require('kafkajs')

const KAFKA_SCRAM_MECHANISMS = [
	'plain',
	'scram-sha-256',
	'scram-sha-512',
]

const fetchEnv = (name) => {
	return process && process.env && process.env[name]
}

class Kafka {
	constructor({
		brokers = fetchEnv('1MILL_KAFKA_KAFKAJS_BROKERS'),
		id = fetchEnv('1MILL_KAFKA_KAFKAJS_ID'),
		mechanism = fetchEnv('1MILL_KAFKA_KAFKAJS_MECHANISM'),
		password = fetchEnv('1MILL_KAFKA_KAFKAJS_PASSWORD'),
		username = fetchEnv('1MILL_KAFKA_KAFKAJS_USERNAME'),
	}) {
		// * Inputs
		this.brokers = typeof brokers === 'string' ? brokers.split(',') : (brokers || [])
		this.id = id
		this.mechanism = mechanism
		this.password = password
		this.username = username

		// * Connections
		this.kafka = undefined
		this.producer = undefined
	}

	_buildAuthentication() {
		if (KAFKA_SCRAM_MECHANISMS.includes(this.mechanism)) {
			return {
				sasl: {
					mechanism: this.mechanism,
					password: this.password,
					username: this.username,
				},
				ssl: true,
			}
		}

		return {}
	}

	async emit({ cloudevent }) {
		if (!cloudevent.id) throw new Error('Cloudevent "id" is required')
		if (!cloudevent.source) throw new Error('Cloudevent "source" is required')
		if (!cloudevent.type) throw new Error('Cloudevent "type" is required')

		if (typeof this.kafka === 'undefined') {
			this.kafka = new KafkaJs({
				...this._buildAuthentication(),
				brokers: this.brokers,
				clientId: this.id,
			})
		}

		if (typeof this.producer === 'undefined') {
			this.producer = this.kafka.producer()
			await this.producer.connect()
		}

		const message = {
			headers: { contentType: 'application/cloudevents+json;charset=UTF-8' },
			value: JSON.stringify(cloudevent),
		}
		const kafkaEvent = { messages: [message], topic: cloudevent.type }
		await this.producer.send(kafkaEvent)

		return true
	}
}

module.exports = { Kafka }
