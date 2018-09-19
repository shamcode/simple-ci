# simple-ci

## Deploy
Create new user
```
sudo adduser ci
```
Copy `server/bin/simpleci/` to `/home/ci/simpleci` on server

Create DB & DB user:
```
sudo -u postgres createuser ci
sudo -u postgres createdb ci
```
Set permission & password
```
sudo -u postgres psql
psql=# alter user ci with encrypted password 'password';
psql=# grant all privileges on database ci to ci;
```

Run `/home/ci/simpleci` for create config.
Edit config `/home/ci/simpleci/config.cfg`

Enable apache modules:
```
a2enmod proxy
a2enmod proxy_http
a2enmod proxy_wstunnel
```

Edit apache config:
```
<VirtualHost 127.0.0.1:80>
	ServerName ci.servername.com

	ProxyPreserveHost On
    ProxyRequests off
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/

    <Location "/ws">
        ProxyPass "ws://localhost:3000/ws"
    </Location>

	ErrorLog /var/log/apache2/error.ci.log
	CustomLog /var/log/apache2/access.ci.log combined
</VirtualHost>
```
Restart apache.

Install supervisor:
```
sudo apt-get -y install supervisor
```
Create log directory 
```
sudo mkdir -p /var/log/simpleci
```

Add in supervisor config `sudo nano /etc/supervisor/supervisord.conf`:
```
[program:simpleci]
directory=/home/ci/simpleci/
command=/home/ci/simpleci/simpleci
autostart=true
autorestart=true
startsecs=10
stdout_logfile=/var/log/simpleci/stdout.log
stdout_logfile_maxbytes=1MB
stdout_logfile_backups=10
stdout_capture_maxbytes=1MB
stderr_logfile=/var/log/simpleci/stderr.log
stderr_logfile_maxbytes=1MB
stderr_logfile_backups=10
stderr_capture_maxbytes=1MB
environment = HOME="/home/ci", USER="ci"
user = ci
```

Restart supervisor:
```
sudo service supervisor restart
```