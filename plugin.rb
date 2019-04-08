# name: discourse-merge-users
# about: Adds an admin option to merge users
# version: 0.1.0
# authors: Dannii Willis
# url: https://github.com/curiousdannii/discourse-merge-users

add_admin_route 'merge-users.title', 'merge-users'

register_asset 'stylesheets/merge-users.scss'

Discourse::Application.routes.append do
    get '/admin/plugins/merge-users' => 'admin/plugins#index', constraints: StaffConstraint.new
end

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

        end

        class Engine < ::Rails::Engine
            engine_name 'merge_users'
            isolate_namespace MergeUsers
        end
    end

    MergeUsers::Engine.routes.draw do
        root to: 'merge_users#index'
        get 'check' => 'merge_users#check'
    end

    Discourse::Application.routes.append do
        mount ::MergeUsers::Engine, at: '/admin/plugins/merge-users', constraints: StaffConstraint.new
    end

end