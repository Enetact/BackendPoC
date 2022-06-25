const dbName = 'mission';

db = db.getSiblingDB(dbName);

db.createUser({
  user: 'missionapi',
  pwd: 'Miss10Ns3cure!',
  roles: [
    {
      role: 'readWrite',
      db: dbName,
    },
  ],
});
