'use strict'

const React = require('react')
const ReactDOM = require('react-dom')

const client = require('./client')
const when = require('when')
const follow = require('./follow')

const Module = require('./Module')

const root = '/api'

class Modules extends React.Component {

	constructor(props) {
		super(props);
		this.state = {modules: {}} // TODO: Split up state between each module
		this.findModules = this.findModules.bind(this)
		this.refresh = this.refresh.bind(this)
		this.deploy = this.deploy.bind(this)
		this.undeploy = this.undeploy.bind(this)
		this.handleRefreshAll = this.handleRefreshAll.bind(this)
		this.handleDeployAll = this.handleDeployAll.bind(this)
		this.handleUndeployAll = this.handleUndeployAll.bind(this)
	}

	findModules() {
		follow(client, root, ['modules']).done(response => {
			this.setState({modules: response.entity._embedded.appStatuses.reduce((prev, curr) => {
				prev[curr.deploymentId] = curr
				return prev
			}, {})})
		})
	}

	refresh(moduleDetails) {
		client({method: 'GET', path: moduleDetails._links.self.href}).done(response => {
			let newModules = this.state.modules
			newModules[response.entity.deploymentId] = response.entity
			this.setState({modules: newModules})
		})
	}

	deploy(moduleDetails) {
		console.log(this.props.settings)
		console.log(this.props.settings['spinnaker-redis'])
		// TODO: Add optional arguments based on module, like redis.
		console.log('Deploying ' + moduleDetails._links.self.href + ', bound to ' + this.props.settings['spinnaker-redis'])
		client({method: 'POST', path: moduleDetails._links.self.href}).done(success => {
			this.refresh(moduleDetails)
		})
	}

	undeploy(moduleDetails) {
		client({method: 'DELETE', path: moduleDetails._links.self.href}).done(success => {
			this.refresh(moduleDetails)
		}, failure => {
			alert('FAILURE: ' + failure.entity.message)
		})
	}

	handleRefreshAll(e) {
		e.preventDefault()
		Object.keys(this.state.modules).map(key => {
			this.refresh(this.state.modules[key])
		})
	}

	handleDeployAll(e) {
		e.preventDefault()
		Object.keys(this.state.modules).map(key => {
			this.deploy(this.state.modules[key])
		})
	}

	handleUndeployAll(e) {
		e.preventDefault()
		Object.keys(this.state.modules).map(key => {
			this.undeploy(this.state.modules[key])
		})
	}

	componentDidMount() {
		this.findModules()
	}

	render() {
		let modules = Object.keys(this.state.modules).map(name =>
			<Module key={name}
					details={this.state.modules[name]}
					refresh={this.refresh}
					deploy={this.deploy}
					undeploy={this.undeploy} />)

		return (
			<table className="table table--cosy table--rows">
				<tbody>
				{modules}
				<tr>
					<td></td><td></td>
					<td><button onClick={this.handleRefreshAll}>Refresh All</button></td>
					<td><button onClick={this.handleDeployAll}>Deploy All</button></td>
					<td><button onClick={this.handleUndeployAll}>Undeploy All</button></td>
				</tr>
				</tbody>
			</table>
		)
	}

}

module.exports = Modules