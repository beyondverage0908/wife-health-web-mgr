import Vue from 'vue'
import Modal from './modal.vue'

const prefixCls = 'ivu-modal'
Modal.newInstance = properties => {
	const _props = properties || {}
	const Instance = new Vue({

		data: { ..._props, visible: false,
			width: '80%',
			title: '',
			body: '',
			iconType: '',
			iconName: '',
			props: null,
			component: '',
			events: {
				success (result) {

				},
				cancel () {

				},
				submit (result) {
					if (result && result != false) {
						Instance.visible = false
						Instance.buttonLoading = false
						Instance.$nextTick(() => {
							Instance.buttonLoading = true
						})
						Instance.remove()
						if (Instance.events.success) {
							Instance.events.success(result)
						} else {
							Instance.success(result)
						}
					} else {
						Instance.buttonLoading = true
						setTimeout(() => {
							Instance.$nextTick(() => {
								Instance.buttonLoading = false
							})
						}, 1000)
						//  Instance.buttonLoading = false;
					}
				}

			},
			okText: '提交',
			cancelText: '取消',
			showCancel: true,
			showOk: true,
			loading: true,
			buttonLoading: false,
			zIndex: 800,
			scrollable: false,
			closable: false},
		render (h) {
			const footerVNodes = []
			if (this.showCancel) {
				footerVNodes.push(h('Button', {
					props: {
						type: 'text',
						size: 'large'
					},
					on: {
						click: this.onCancel
					}
				}, this.localecancelText))
			}
			if (this.showOk) {
				footerVNodes.push(h('Button', {
					props: {
						type: 'primary',
						size: 'large',
						loading: this.buttonLoading
					},
					on: {
						click: this.ok
					}
				}, this.localeOkText))
			}

			// render content
			let body_render
			// debugger
			if (this.component) {
				body_render = h('div', {
					attrs: {
						class: `${prefixCls}-body `
					}
				}, [
					h(this.component, {
						props: this.props,
						ref: 'component',
						on: this.events
					})
				])
			}
			// if (this.render) {
			//     body_render = h('div', {
			//         attrs: {
			//             class: `${prefixCls}-body `
			//         }
			//     }, [this.render(h)]);
			// } else {
			//     body_render = h('div', {
			//         attrs: {
			//             class: `${prefixCls}-body`
			//         }
			//     }, [
			//         h('div', {
			//             domProps: {
			//                 innerHTML: this.body
			//             }
			//         })
			//     ]);
			// }

			// when render with no title, hide head
			let head_render
			if (this.title) {
				head_render = h('div', {
					attrs: {
						class: `${prefixCls}-header`
					}
				}, [
					h('div', {
						attrs: {
							class: `${prefixCls}-header-inner`
						},
						domProps: {
							innerHTML: this.title
						}
					})
				])
			}
			//  render top-close-button
			let close_btn
			close_btn = h('a', {
				attrs: {
					class: `${prefixCls}-close`
				}
			}, [
				h('Icon', {
					attrs: {
						class: `ivu-icon ivu-icon-ios-close`
					},
					on: {
						click: this.onCancel
					}
				})
			])
			return h(Modal, {
				props: { ..._props, width: this.width,
					scrollable: this.scrollable,
					zIndex: this.zIndex,
					closable: this.closable},
				domProps: {
					value: this.visible
				},
				on: {
					input: (status) => {
						this.visible = status
					}
				}
			}, [
				close_btn,
				head_render,
				body_render,
				h('div', {
					attrs: {
						class: `${prefixCls}-footer`
					}
				}, footerVNodes)
			])
		},
		computed: {

			localeOkText () {
				if (this.okText) {
					return this.okText
				} 
					return '确定'
				
			},
			localecancelText () {
				if (this.cancelText) {
					return this.cancelText
				} 
					return '取消'
				
			}
		},
		methods: {
			onCancel () {
				this.$children[0].visible = false
				this.buttonLoading = false
				if (this.$refs.component && this.$refs.component.close) {
					this.$refs.component.close()
				}
				if (this.events.cancel) {
					this.events.cancel()
				} else {
					this.cancel()
				}
				this.remove()
			},
			ok () {
				if (this.loading) {
					this.buttonLoading = true
				} else {
					this.$children[0].visible = false
					this.remove()
				}
				if (this.$refs.component.save) {
					const result = this.$refs.component.save()
					if (result == false) {
						this.changeLoading()
					} else {
						// this.changeLoading();
					}
				}
			},
			remove () {
				setTimeout(() => {
					this.destroy()
				}, 300)
			},
			destroy () {
				this.$destroy()
				document.body.removeChild(this.$el)
				this.onRemove()
			},
			success (result) {

			},
			onOk () {

			},
			changeLoading () {
				this.buttonLoading = true
				setTimeout(() => {
					this.$nextTick(() => {
						this.buttonLoading = false
					})
				}, 1000)
			},
			cancel () {
				// this.visible = false;
				// this.buttonLoading = false;
				// this.remove();
			},
			onRemove () {}
		}
	})

	const component = Instance.$mount()
	document.body.appendChild(component.$el)
	const modal = Instance.$children[0]

	return {
		show (props) {
			modal.$parent.showCancel = props.showCancel
			modal.$parent.showOk = props.showOk
			if ('width' in props) {
				modal.$parent.width = props.width
			}

			if ('closable' in props) {
				modal.$parent.closable = props.closable
			}

			if ('title' in props) {
				modal.$parent.title = props.title
			}
			if ('zIndex' in props) {
				modal.$parent.zIndex = props.zIndex
			}
			if ('content' in props) {
				modal.$parent.body = props.content
			}
			if ('component' in props) {
				modal.$parent.component = props.component
			}
			if ('okText' in props) {
				modal.$parent.okText = props.okText
			}
			if ('props' in props) {
				modal.$parent.props = props.props
			}
			if ('cancelText' in props) {
				modal.$parent.cancelText = props.cancelText
			}

			if ('onCancel' in props) {
				modal.$parent.onCancel = props.onCancel
			}
			if ('cancel' in props) {
				modal.$parent.cancel = props.cancel
			}
			if ('onOk' in props) {
				modal.$parent.onOk = props.onOk
			}
			if ('events' in props) {
				modal.$parent.events = { ...modal.$parent.events, ...props.events}
				// modal.$parent.events=props.events
			}
			// async for ok
			if ('loading' in props) {
				modal.$parent.loading = props.loading
			}
			if ('scrollable' in props) {
				modal.$parent.scrollable = props.scrollable
			}
			// notice when component destroy
			modal.$parent.onRemove = props.onRemove
			modal.visible = true
		},

		events: modal.$parent.events,
		// setComponentName(componentUrl){
		//     let compent =import(componentUrl)
		//     modal.$parent.component =  compent
		// },
		changeLoading () {
			modal.$parent.buttonLoading = false
		},
		cancel () {
			modal.$parent.buttonLoading = false
		},
		remove () {
			modal.visible = false
			modal.$parent.buttonLoading = false
			modal.$parent.remove()
		},
		component: modal
	}
}

export default Modal
