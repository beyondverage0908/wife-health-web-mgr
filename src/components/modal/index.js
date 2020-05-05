import Modal from './modal-async'
// import Vue from 'vue';
let modalInstance

function createModalInstance (render = undefined) {
	modalInstance = Modal.newInstance({
		closable: false,
		maskClosable: false,
		footerHide: true,
		render
	})

	return modalInstance
}

Modal.create = function (options, afterSuccess, afterCancel) {
	const render = ('render' in options) ? options.render : undefined
	const instance = createModalInstance(render)
	options.onRemove = function () {
		modalInstance = null
	}
	if (options.showCancel === undefined) {
		options.showCancel = true
	}
	if (options.showOk === undefined) {
		options.showOk = true
	}
	instance.show(options)
	if (afterSuccess != undefined) {
		instance.events.success = afterSuccess
	}
	if (afterCancel != undefined) {
		instance.events.cancel = afterCancel
	}
}
// Modal.create = function (componentUrl,options,afterSuccess,afterCancel) {
//     debugger
//     if(componentUrl){
//         Vue.component(
//             'async-webpack-example',
//             // 这个 `import` 函数会返回一个 `Promise` 对象。
//             () => import(componentUrl)
//           )
//         options.component =   'async-webpack-example'
//     }
//     const render = ('render' in options) ? options.render : undefined;
//     let instance  = createModalInstance(render);
//     options.onRemove = function () {
//         modalInstance = null;
//     };
//     if( options.showCancel === undefined){
//         options.showCancel = true;
//     }
//     instance.show(options);
//     //instance.setComponentName(componentUrl);
//     if(afterSuccess != undefined){
//         instance.events.success=afterSuccess
//     }
//     if(afterCancel != undefined){
//         instance.events.cancel=afterCancel
//     }
// };

Modal.changeLoading = function () {
	const instance = createModalInstance()
	instance.changeLoading()
}
Modal.remove = function () {
	if (!modalInstance) { // at loading status, remove after Cancel
		return false
	}
	modalInstance.remove()
	// const instance = createModalInstance();
	// instance.remove();
}

export default Modal
