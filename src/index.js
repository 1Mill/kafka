const { Kafka: KafkaJs } = require('kafkajs')

const KAFKA_SCRAM_MECHANISMS = [
	'plain',
	'scram-sha-256',
	'scram-sha-512',
]

class Kafka {
	constructor({
		id = process && process.env && process.env.MILL_KAFKAJS_ID,
		mechanism = process && process.env && process.env.MILL_KAFKAJS_MECHANISM,
		password = process && process.env && process.env.MILL_KAFKAJS_PASSWORD,
		urls = process && process.env && process.env.MILL_KAFKAJS_URLS,
		username = process && process.env && process.env.MILL_KAFKAJS_USERNAME,
	}) {
		// * Inputs
		this.id = id
		this.mechanism = mechanism
		this.password = password
		this.urls = urls
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
				brokers: this.urls,
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
