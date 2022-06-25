# Docker MongoDB Initialization

The files in this directory are mounted to MongoDB docker containers during startup. If MongoDB is starting a new, uninitialized container instance, these files are run in alphabetical order to initialize the MongoDB database.

These files are run by the MongoDB root account. The connection is automatically created and provided via the `db` variable.

## Resetting the MonboDB Data

To reset the MongoDB container data, forcing a re-initialization on the next startup, remove the Docker volume containing the MongoDB data.

List the volumes:

```
docker volume ls
```

Remove the volume:

```
docker volume rm <volume-name>

e.g.

docker volume rm mission-data-db
```
