export default Ember.Controller.extend({
    source: null,
    target: null,

    actions: {
        mergeUsers() {
            bootbox.confirm(I18n.t("merge-users.confirm"), confirm => {
                if (!confirm)
                {
                    return
                }

                bootbox.alert(I18n.t("merge-users.begun"))
            })
        }
    }
});