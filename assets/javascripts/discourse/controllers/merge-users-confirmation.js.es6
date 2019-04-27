import ModalFunctionality from 'discourse/mixins/modal-functionality'

export default Ember.Controller.extend(ModalFunctionality, {
    source: null,
    target: null,

    actions: {
        cancel() {
            this.resolve(0)
            this.send('closeModal')
        },

        confirm() {
            this.resolve(1)
            this.send('closeModal')
        },
    }
})