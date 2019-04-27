import ModalFunctionality from 'discourse/mixins/modal-functionality'

export default Ember.Controller.extend(ModalFunctionality, {
    source: null,
    target: null,

    actions: {
        confirm() {
            this.get('resolve')(1)
            this.send('closeModal')
        },
    },

    onClose()
    {
        this.get('resolve')(0)
    },
})