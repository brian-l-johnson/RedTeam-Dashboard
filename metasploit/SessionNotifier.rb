####
###Author: Brian Johnson
###
###Based off ShellHerder
####
##
###require 'open-uri'
###require 'net/http'
###require 'net/https'
##
#
##
## $Id$
##
#module Msf
#    Class Plugin::Notify < Msf::Plugin
#        include Msf::SessionEvent
#
#        # Checks if the constant is already set, if not set it
#        if not defined?(Notify_yaml)
#            Notify_yaml = "#{Msf::Config.get_config_root}/Nofiy.yaml"
#        end
#
#        # Initialize the Class
#        def initialize(framework, opts)
#            super
#            add_console_dispatcher(NofiyDispatcher)
#        end
#
#        # Clean up the event subscriber on unload
#        def cleanup
#            self.framework.events.remove_session_subscriber(self)
#            remove_console_dispatcher('notify')
#        end
#
#        # Set the name of the plugin
#        def name
#            "notify"
#        end
#
#        # Set the description of the plugin

#
#        class NofiyDispatcher
#            include Msf::Ui::Console::CommandDispatcher
#
#            @webhook_url = nil
#            @dashboard_user = nil
#            @dashboard_pass = nil
#            $source = nil
#            $opened = Array.new
#            $closed = Array.new
#
#            # Send notification when a session is created
#            def on_session_open(session)
#                print_status("Session opened send notification to dashboard")
#                return
#            end
#
#            def name
#                "notify"
#            end
#
#            def read_settings
#                read = nil
#                if File.exist?("#{Notify_yaml}")
#                    ldconfig = YAML.load_file("#{Notify_yaml}")
#                    @webhook_url = ldconfig['webhook_url']
#                    @dashboard_user = ldconfig['dashboard_user']
#                    @dashboard_pass = ldconfig['dashboard_pass']
#                    read = true
#                else
#                    print_error("You must create a YAML file with the options")
#                    print_error("as: #{Notify_yaml}")
#                    return read
#                end
#                return read
#            end
#
#            def commands
#                {
#                    'notify_help'               => "Displays help",
#                    'notify_start'              => "Start the notify plugin",
#                    'notify_stop'               => "Stop the notify plugin",
#                    'notify_test'               => "Send a test message",
#                    'notify_set_webhook'        => "Set the dashboard webhook",
#                    'notify_set_user'           => "Set the dashboard user",
#                    'notify_set_pass'           => "Set the dashboard password",
#                    'notify_show_options'       => "Show the currently set parameters"
#                }
#            end
#
#            def cmd_notify_help
#                puts "Run notify_set_webhook, notify_set_user and notify_set_pass to setup notification plugin.  When new sessions are created this will notify the dashboard.  If the session was created by the attack automation it will mark the exploitation attempt as successful"
#            end
#
#            def cmd_notify_start
#                print_status "Session activity will be reported to #{@webhook_url}"
#                if read_settings()
#                    self.framework.events.add_session_subscriber(self)
#                    print_good("Notify Plugin Started, monitoring for new sessions")
#                else
#                    print_error("Could not start Notify plugin")
#                end
#            end
#
#            def cmd_notify_stop
#                print_status "Stopping monitoring sessions"
#                self.framework.events.remove_session_subscriber(self)
#
#            def cmd_notify_save
#                print_status("Saving options to config file")
#                if @dashboard_user and @dashboard_pass and @webhook_url
#                    config = {'dashboard_user' => @dashboard_user, 'dashboard_pass' => @dashboard_pass, 'webhook_url' => @webhook_url}
#                    File.open(Notify_yaml, 'w') do |out|
#                        YAML.dump(config, out)
#                    end
#                    print_good("Settings saved to #{Notify_yaml}")
#                else
#                    print_error("All required parameters not provided!")
#                end
#            end
#
#            def cmd_notify_set_user(*args)
#                if args.length > 0
#                    print_status("setting user to #{args[0]}")
#                    @dashboard_user = args[0]
#                else
#                    print_error("Please provide a username")
#                end
#            end
#
#            def cmd_notify_set_pass(*args)
#                if args.length > 0
#                    print_status("setting password to #{args[0]}")
#                    @dashboard_pass = args[0]
#                else
#                    print_error("Please provide a password")
#                end
#            end
#
#            def cmd_notify_set_webhook(*args)
#                if args.length > 0
#                    print_status("setting webhook to #{args[0]}")
#                    @webhook_url = args[0]
#                else
#                    print_error("Please provide a URL")
#                end
#            end
#
#            def notify_show_options
#                print_status("Parameters:")
#                print_good(" Webhook URL: #{@webhook_url}")
#                print_good(" Dashboard user: #{@dashboard_user}")
#                print_good(" Dashboard pass: #{@dashboard_pass}")
#            end
#        end
#    end
#end


require 'open-uri'
require 'net/http'
require 'net/https'

module Msf

	class Plugin::Notify < Msf::Plugin
		include Msf::SessionEvent

		# Checks if the constant is already set, if not it is set
		if not defined?(Notify_yaml)
			Notify_yaml = "#{Msf::Config.get_config_root}/Notify.yaml"
		end


		# Initialize the Class
		def initialize(framework, opts)
			super
			add_console_dispatcher(NotifyDispatcher)
		end


		# Cleans up the event subscriber on unload
		def cleanup
			self.framework.events.remove_session_subscriber(self)
			remove_console_dispatcher('notify')
		end


		# Sets the name of the plguin
		def name
			"notify"
		end


    def desc
      "Notify CCDC Dashboard when shells are created"
    end

		# Notify Dispatcher Class
		class NotifyDispatcher
			include Msf::Ui::Console::CommandDispatcher

      @webhook_url = nil
      @dashboard_user = nil
      @dashboard_pass = nil
      $source = nil
      $opened = Array.new
      $closed = Array.new


      # Send notification when a session is created
      def on_session_open(session)
          print_status("Session opened send notification to dashboard")
          return
      end

			# Sets the name of the plguin
			def name
				"notify"
			end

      def read_settings
          read = nil
          if File.exist?("#{Notify_yaml}")
              ldconfig = YAML.load_file("#{Notify_yaml}")
              @webhook_url = ldconfig['webhook_url']
              @dashboard_user = ldconfig['dashboard_user']
              @dashboard_pass = ldconfig['dashboard_pass']
              read = true
          else
              print_error("You must create a YAML file with the options")
              print_error("as: #{Notify_yaml}")
              return read
          end
          return read
      end


      def commands
          {
              'notify_help'               => "Displays help",
              'notify_start'              => "Start the notify plugin",
              'notify_stop'               => "Stop the notify plugin",
              'notify_test'               => "Send a test message",
              'notify_set_webhook'        => "Set the dashboard webhook",
              'notify_set_user'           => "Set the dashboard user",
              'notify_set_pass'           => "Set the dashboard password",
              'notify_show_options'       => "Show the currently set parameters"
          }
      end

    def cmd_notify_help(*args)
        puts "Run notify_set_webhook, notify_set_user and notify_set_pass to setup notification plugin.  When new sessions are created this will notify the dashboard.  If the session was created by the attack automation it will mark the exploitation attempt as successful"
    end
    def cmd_notify_start(*args)
        print_status "Session activity will be reported to #{@webhook_url}"
        if read_settings()
            self.framework.events.add_session_subscriber(self)
            print_good("Notify Plugin Started, monitoring for new sessions")
        else
            print_error("Could not start Notify plugin")
        end
    end

    def cmd_notify_stop(*args)
        print_status "Stopping monitoring sessions"
        self.framework.events.remove_session_subscriber(self)
    end

    def cmd_notify_save(*args)
        print_status("Saving options to config file")
        if @dashboard_user and @dashboard_pass and @webhook_url
            config = {'dashboard_user' => @dashboard_user, 'dashboard_pass' => @dashboard_pass, 'webhook_url' => @webhook_url}
            File.open(Notify_yaml, 'w') do |out|
                YAML.dump(config, out)
            end
            print_good("Settings saved to #{Notify_yaml}")
        else
            print_error("All required parameters not provided!")
        end
    end

    def cmd_notify_set_user(*args)
        if args.length > 0
            print_status("setting user to #{args[0]}")
            @dashboard_user = args[0]
        else
            print_error("Please provide a username")
        end
    end

    def cmd_notify_set_pass(*args)
        if args.length > 0
            print_status("setting password to #{args[0]}")
            @dashboard_pass = args[0]
        else
            print_error("Please provide a password")
        end
    end

    def cmd_notify_set_webhook(*args)
        if args.length > 0
            print_status("setting webhook to #{args[0]}")
            @webhook_url = args[0]
        else
            print_error("Please provide a URL")
        end
    end

    def notify_show_options
        print_status("Parameters:")
        print_good(" Webhook URL: #{@webhook_url}")
        print_good(" Dashboard user: #{@dashboard_user}")
        print_good(" Dashboard pass: #{@dashboard_pass}")
    end
		
		end
	end
end
