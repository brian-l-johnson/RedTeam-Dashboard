#
# $Id$
#

require 'net/http'
require 'net/https'
require 'uri'
require 'json'


module Msf
    class Plugin::DashboardReporter < Msf::Plugin
    
      class ConsoleCommandDispatcher
        include Msf::Ui::Console::CommandDispatcher

        @dashboard_user = nil
        @dashboard_pass = nil
        @dashboard_url  = nil
        @dashboard_cookies = nil
    
        #
        # The dispatcher's name.
        #
        def name
          "DashboardReporter"
        end

              # Send notification when a session is created
        def on_session_open(session)
            print_status("Session opened send notification to dashboard")
            print_status(session.exploit_uuid)
            print_status(session.exploit.name)
            print_status(session.target_host)
            print_status(session.target_port)
            puts(session.inspect)
            return
        end

        def dashboard_login()
            uri = URI.parse(@dashboard_url+"auth/login")
            http = Net::HTTP.new(uri.host, uri.port)
            req = Net::HTTP::Post.new(uri.path, 'Content-Type' => 'application/json')
            req.body = {email: @dashboard_user, password: @dashboard_pass}.to_json
            res = http.request(req)
            print_status(res.code)
            if(res.code == "200")
                print_good("login successful")
                @dashboard_cookies = res.response['set-cookie']
                print_status(@dashboard_cookies)
                return true
            else
                print_error("login failed")
                return false
            end
        rescue => e
            print_error("failed #{e}")
            return false
        end

        def get_dashboard_permissions()
            if(@dashboard_cookies == nil)
                if(!dashboard_login())
                    return nil
                end
            end
            uri = URI.parse(@dashboard_url+"auth/permissions")
            http = Net::HTTP.new(uri.host, uri.port)
            req = Net::HTTP::Get.new(uri.request_uri)
            req['Cookie'] = @dashboard_cookies
            resp = http.request(req)
            puts resp.body
        end

    
        #
        # Returns the hash of commands supported by this dispatcher.
        #
        def commands
          {
            "sample" => "A sample command added by the sample plugin",
            "notifier_start"                => "Start session watcher",
            "notifier_stop"                 => "Stop session watcher",
            "notifier_set_user"             => "Set Dashboard user name",
            "notifier_set_pass"             => "Set Dashboard password",
            "notifier_set_dashboard_url"    => "Set Dashboard base URL",
            "notifier_show_config"          => "Show notifier config",
            "notifier_dashboard_login"      => "Log in to dashboard",
            "notifier_dashboard_permissions"    => "Get dashbaord user permissions"
          }
        end
    
        #
        # This method handles the sample command.
        #     
        def cmd_sample(*args)
          print_line("You passed: #{args.join(' ')}")
        end

        def cmd_notifier_start(*args)
            print_status("starting session watcher")
            self.framework.events.add_session_subscriber(self)
        end

        def cmd_notifier_stop(*args)
            print_status("stopping session watcher")
            self.framework.remove_session_subscriber(self)
        end

        def cmd_notifier_set_user(*args)
            if args.length > 0
                @dashboard_user = args[0]
            else
                print_error("Please supply a user")
            end
        end

        def cmd_notifier_set_pass(*args)
            if args.length > 0
                @dashboard_pass = args[0]
            else
                print_error("Please supply a password")
            end
        end

        def cmd_notifier_set_dashboard_url(*args)
            if args.length > 0
                @dashboard_url = args[0]
            else
                print_error("Please supply a URL")
            end
        end

        def cmd_notifier_show_config(*args) 
            print_status("Dashboard Notifier config")
            if(@dashboard_url == nil) 
                print_error("Dashboard URL not set!")
            else
                print_good("Dashboard URL: #{@dashboard_url}")
            end
            if(@dashboard_user == nil)
                print_error("Dashboard user name not set!")
            else
                print_good("Dashboard user: #{@dashboard_user}")
            end
            if(@dashboard_pass == nil)
                print_error("Dashboard password not set")
            else
                print_good("Dashboard password: #{@dashboard_pass}")
            end
        end

        def cmd_notifier_dashboard_login(*args)
            dashboard_login()
        end

        def cmd_notifier_dashboard_permissions(*args)
            get_dashboard_permissions()
        end
      end
    
      def initialize(framework, opts)
        super
    
        add_console_dispatcher(ConsoleCommandDispatcher)
    
        print_status("DashboardReporter plugin loaded.")
      end
    
      def cleanup
        remove_console_dispatcher('DashboardReporter')
      end
    
      def name
        "DashboardReporter"
      end
    
      #
      # This method returns a brief description of the plugin.  It should be no
      # more than 60 characters, but there are no hard limits.
      #
      def desc
        "Demonstrates using framework plugins"
      end
    
    protected
    end
    
end
    