# name: discourse-merge-users
# about: Adds an admin option to merge users
# version: 0.1.0
# authors: Dannii Willis
# url: https://github.com/curiousdannii/discourse-merge-users

add_admin_route 'merge-users.title', 'merge-users'

after_initialize do

    module ::MergeUsers
        def self.plugin_name
            'merge-users'.freeze
        end

        class MergeUsersController < ::ApplicationController
            requires_plugin MergeUsers.plugin_name

            def index
                render_serialized Discourse.visible_plugins, AdminPluginSerializer, root: 'plugins'
            end

            def merge
                params.require(:source)
                params.require(:target)

                source = params[:source]
                target = params[:target]

                source_user = User.find_by_username(source)
                target_user = User.find_by_username(target)

                if params[:check] == "1"
                    return render json: {
                        source: BasicUserSerializer.new(source_user, root: false).as_json,
                        target: BasicUserSerializer.new(target_user, root: false).as_json,
                        #source: !!source_user,
                        #target: !!target_user,
                    }
                end

                message_users = [current_user.username]
                if params[:messageTarget] == "1"
                    message_users.push(target)
                end

                Thread.new {
                    UserMerger.new(source_user, target_user).merge!
                    PostCreator.new(Discourse.system_user,
                       title: I18n.t('merge-users.message.subject_template'),
                       raw: I18n.t('merge-users.message.text_body_template', { source: source, target: target }),
                       archetype: Archetype.private_message,
                       target_usernames: message_users.join(','),
                       target_group_names: Group.exists?(name: SiteSetting.site_contact_group_name) ? SiteSetting.site_contact_group_name : nil,
                       subtype: TopicSubtype.system_message,
                       skip_validations: true
                    ).create!
                }
                render json: { success: 1 }
            end
        end

        class Engine < ::Rails::Engine
            engine_name 'merge_users'
            isolate_namespace MergeUsers
        end
    end

    MergeUsers::Engine.routes.draw do
        root to: 'merge_users#index'
        post 'merge' => 'merge_users#merge'
    end

    Discourse::Application.routes.append do
        mount ::MergeUsers::Engine, at: '/admin/plugins/merge-users', constraints: StaffConstraint.new
    end

end