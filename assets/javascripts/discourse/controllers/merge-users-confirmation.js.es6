import ModalFunctionality from 'discourse/mixins/modal-functionality'

export default Ember.Controller.extend(ModalFunctionality, {
    source: null,
    target: null,

    actions: {
        confirm() {
            this.resolve(0)
        },

        cancel() {
            this.resolve(0)
        },
    }
})