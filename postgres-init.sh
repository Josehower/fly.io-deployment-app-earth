#! /bin/sh

if [ ! -d "../postgres-volume" ]
then
  mkdir -p /run/postgresql/data/
  chown postgres:postgres /run/postgresql/data /run/postgresql/
  su postgres -c "initdb -D /run/postgresql/data"
  echo "host all all 0.0.0.0/0 trust" >> /run/postgresql/data/pg_hba.conf
  echo "listen_addresses='*'" >> /run/postgresql/data/postgresql.conf
  su postgres -c "pg_ctl start -D /run/postgresql/data"
  psql -U postgres postgres --command="CREATE USER upleveled PASSWORD 'upleveled'"
  createdb -U postgres --owner=upleveled upleveled
else
  su postgres -c 'pg_ctl start -D /postgres-volume/data'
fi
