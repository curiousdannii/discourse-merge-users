# discourse-merge-users

With this plugin you can easily merge two users together.

![Screenshot of the Merge Users admin panel](screenshot.png)

## Installation

Just add one line to your app.yml:

```
hooks:
  after_code:
    - exec:
        cd: $home/plugins
        cmd:
          - git clone https://github.com/discourse/docker_manager.git
          - git clone https://github.com/curiousdannii/discourse-merge-users.git
```

Then rebuild the container:

```
cd /var/discourse
sudo ./launcher rebuild app
```

See [the Discourse forum for more on installing plugins](https://meta.discourse.org/t/install-plugins-in-discourse/19157).