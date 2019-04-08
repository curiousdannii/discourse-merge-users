export default Ember.Controller.extend({
    source: 'sourceuser',
    target: 'targetuser',

    noSource: Ember.computed.empty('model.source'),
    noTarget: Ember.computed.empty('model.target'),
    mergeDisabled: Ember.computed.or('model.noSource','model.noTarget'),

    actions: {
        mergeUsers() {
            const source = this.get("source")
            const target = this.get("target")
            bootbox.confirm(I18n.t("merge-users.confirm", source, target), confirm => {
                if (!confirm)
                {
                    return
                }

                bootbox.alert(I18n.t("merge-users.begun"))
                this.set('source', null)
                this.set('target', null)
            })
        }
    }
});