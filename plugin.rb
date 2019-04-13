# name: discourse-merge-users
# about: Adds an admin option to merge users
# version: 0.1.0
# authors: Dannii Willis
# url: https://github.com/curiousdannii/discourse-merge-users

add_admin_route 'merge-users.title', 'merge-users'

register_asset 'stylesheets/merge-users.scss'

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

                source_user = User.find_by_username(params[:source])
                target_user = User.find_by_username(params[:target])

                if params[:check].present?
                    return render json: {
                        source: !!source_user,
                        target: !!target_user,
                    }
                end

                UserMerger.new(source_user, target_user).merge!
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