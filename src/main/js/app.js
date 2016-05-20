'use strict';

const React = require('react')
const ReactDOM = require('react-dom')

const Settings = require('./Settings')
const Modules = require('./Modules')

class Application extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			services: 'spring.cloud.deployer.cloudfoundry.defaults.services',
			accountName: 'cf.account.name',
			accountPassword: 'cf.account.password',
			repoUsername: 'cf.repo.username',
			repoPassword: 'cf.repo.password',
			springConfigLocation: 'spring.config.location',
			active: 'settings'
		}
		this.updateSetting = this.updateSetting.bind(this)
		this.handleSettings = this.handleSettings.bind(this)
		this.handleStatus = this.handleStatus.bind(this)
		this.tabStatus = this.tabStatus.bind(this)
		this.settingsStatus = this.settingsStatus.bind(this)
		this.isActive = this.isActive.bind(this)
	}

	updateSetting(key, value) {
		let newState = {}
		newState[key] = value
		this.setState(newState)
	}

	handleSettings(e) {
		e.preventDefault()
		this.setState({active: 'settings'})
	}

	handleStatus(e) {
		e.preventDefault()
		this.setState({active: 'status'})
	}

	isActive(tab) {
		return ((this.state.active === tab) ? ' active' : '')
	}

	tabStatus(tab) {
		return 'tabs__item' + this.isActive(tab)
	}

	settingsStatus(tab) {
		return 'content wrapper' + this.isActive(tab)
	}

	render() {
		return (
			<div>
				<section className="page-header box box--tiny">
					<ul className="tabs">
						<li className={this.tabStatus('settings')}>
							<a id="settings-link" className="tabs__link" onClick={this.handleSettings}>Settings</a>
						</li>
						<li className={this.tabStatus('status')}>
							<a id="status-link" className="tabs__link" onClick={this.handleStatus}>Status</a>
						</li>
					</ul>
				</section>

				<section className="box box--tiny content__container">
					<div id="settings" className={this.settingsStatus('settings')}>
						<h1>Spinnaker Settings</h1>
						<Settings updateSetting={this.updateSetting} />
					</div>

					<div id="status" className={this.settingsStatus('status')}>
						<h1>Spinnaker Status</h1>
						<Modules settings={this.state} />
					</div>
				</section>
			</div>
		)
	}
}

ReactDOM.render(
	<Application />,
	document.getElementById('app')
)

