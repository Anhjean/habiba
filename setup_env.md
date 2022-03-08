How to install habiba ERP : https://www.odoo.com/documentation/14.0/administration/install/install.html#id7
1. Install Python 3.7 and nodejs
    - dnf install python3 python3-dev libxml2-dev libxslt1-dev libldap2-dev libsasl2-dev \
                  libtiff5-dev libjpeg8-dev libopenjp2-7-dev zlib1g-dev libfreetype6-dev \
                  liblcms2-dev libwebp-dev libharfbuzz-dev libfribidi-dev libxcb1-dev libpq-dev \
                  libxslt-devel bzip2-devel openldap-devel git curl unzip -y
    - dnf install https://github.com/wkhtmltopdf/wkhtmltopdf/releases/download/0.12.5/wkhtmltox-0.12.5-1.centos8.x86_64.rpm
    -  Install nodejs and : sudo npm install -g rtlcss
2. Install PostgresSQL
    - dnf install postgresql postgresql-server postgresql-contrib -y
    - postgresql-setup initdb
    - systemctl start postgresql
    - systemctl enable postgresql
    - Create Postgres user: su - postgres -c "createuser -s habiba"
3. Clone source code and we need to create a new system user for our Odoo installation. Make sure the username is the same as the PostgreSQL user we created in the previous step (username maybe different ):
    - useradd -m -U -r -d /opt/habiba -s /bin/bash habiba
    - su - habiba
    - git clone https://github.com/Anhjean/odoo15.git /opt/habiba
4. Install python dev by Virtual Env and setup Bean Bakery ERP
    - install env lib: pip install virtualenv
    - cd /opt/habiba && python3 -m venv habiba-venv
    - source habiba-venv/bin/activate
    - pip3 install setuptools wheel
    - pip3 install -r ./requirements.txt
    - deactivate && exit
5. Make odoo public folder and system user
    - sudo mkdir /opt/.local && sudo mkdir /opt/.local/habiba
    - sudo chmod 777 /opt/.local/habiba -R
6. Running Bean Bakery ERP
    - cd /CommunityPath
    - sudo cp ./config/habiba.service /etc/systemd/system
    - sudo systemctl start habiba
    - sudo systemctl enable habiba
    - sudo systemctl status habiba
    

7. Install nginx
    - dnf install nginx -y
    - sudo nano /etc/nginx/conf.d/yourdomain.com.conf
    - add following code
    ''''
        #odoo server
          upstream odoobean {
            server 127.0.0.1:8071;
          }
          upstream odoobeanchat {
            server 127.0.0.1:8073;
          }

          # http -> https
          server {
            listen 80;
            #server_name habiba.vn www.habiba.vn nhadaubakery.com;
            #rewrite ^(.*) https://habiba.vn permanent;
            server_name *.habiba.vn habiba.vn;
            rewrite ^(.*) https://$host$1 permanent;
          }
          server {
            listen 443 ssl;
            server_name erp.habiba.vn habiba.vn;

              proxy_read_timeout 720s;
              proxy_connect_timeout 720s;
              proxy_send_timeout 720s;

          # Add Headers for odoo proxy mode
              proxy_set_header X-Forwarded-Host $host;
              proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
              proxy_set_header X-Forwarded-Proto $scheme;
              proxy_set_header X-Real-IP $remote_addr;

          # SSL parameters
          # ssl on;
            ssl_certificate /etc/ssl/habiba_origin_cert.pem;
            ssl_certificate_key /etc/ssl/habiba.key;
            ssl_session_timeout 30m;
            ssl_protocols TLSv1.2;
            ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES$
            ssl_prefer_server_ciphers off;

          # log
            access_log /var/log/nginx/odoo.access.log;
            error_log /var/log/nginx/odoo.error.log;

          #Others config
            client_max_body_size 100M;

          # Redirect longpoll requests to odoo longpolling port
            location /longpolling {
              proxy_pass http://odoobeanchat;
            }

          # Redirect requests to odoo backend server
            location / {
              proxy_redirect off;
              proxy_pass http://odoobean;
            }


          # Cache static files
            location ~* /web/static/ {
              proxy_cache_valid 200 90m;
              proxy_buffering on;
              expires 864000;
              proxy_pass http://odoobean;
            }
              
          # common gzip
            gzip_types text/css text/scss text/plain text/xml application/xml application/json application/javascript;
            gzip on;
        }
    ''''

8. Fix some error for odoo command cli on MACOS
    - When running "scaffold" command
      - Check addons path at: "/Users/[username]/.odoorc", and make sure it match the current Odoo folder.
    - When postgres reject connection just delete the pid file
      - rm -rf /usr/local/var/postgresql@13/postmaster.pid

9. server update code (remote command executive):
  Note: Must make sure that your create system as above, if you use your own app path and system user, your must change the app pathh and system user in below script.
  - B1: create script file (ex: habiba_update_code.sh) to update code in "~" directory
    ````
    #!/bin/bash
      sudo systemctl stop habiba.service
      cd /opt/habiba/
    # Run git pull be user: Bean Bakery
      sudo runuser -l  habiba  -c 'git pull'
      cd ~
      sudo systemctl start habiba.service  
      tail -f /opt/.local/habiba/log/odoo15.log
     ````
  - B2: give permission to script file (ex: habiba_update_code.sh)
    - chmod +x habiba_update_code.sh

  - B3: run the script from remote server with ssh and ssh key (must learn how to use ssh key):
    - ssh [server_user]@[user_IP] ./[script-name]
      Ex: ssh centos@1.2.3.4 ./habiba_update_code.sh
  