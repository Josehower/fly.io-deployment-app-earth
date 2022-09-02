## Earth

1. Create your Next,js repo as usual following the learning platform instructions.
2. Get the flyctl auth token:
   - [Create a fly.io account](https://fly.io/app/sign-up)
3. On your terminal Install flyctl cli with brew `brew install flyctl`
   - Login to your fly account with `flyctl auth login`
   - Get a new fly token with `flyctl auth token`
   - Add The secret to github under the name `FLY_API_TOKEN` https://github.com/<username>/<project-slug>/settings/secrets/actions/new
4. Create a fly app with `flyctl apps create`
   - Add the name of the project that you preffer
5. Create the volume for the app with `flyctl volumes create postgres -s 1`
   - Verify the volume is created with `flyctl volumes list`
6. Copy to your project the files .dockerignore, Dockerfile and fly.toml from the configuration files repo
   - Modify `fly.toml` with the name app you choose in step 1
7. Deploy first version of the app with `flyctl deploy`
   - User Frankfurt server location
   - Verify the app is running with `flyctl status`
8. Add secrets with the database credentials to the project (this are production credentials please make them secure)
   - Run `flyctl secrets set PGHOST=localhost PGDATABASE=database_name PGPASSWORD=this-should-be-a-secure-password PGUSERNAME=user_name`
9. Stablish a shh connection with the app with `flyctl ssh console`

   - Check the secrets are correct with `printenv`
   - Create data and run directories in the postgres volume with `mkdir /postgres-volume/data /postgres-volume/run` (create run dir probably not needed)
   - Add permisions for postgres user with `chown postgres:postgres /postgres-volume/data /postgres-volume/run`
   - Switch to postgres user with `su postgres -`
   - Initialize database with `initdb -D /postgres-volume/data`
   - Update data/postgresql.conf to update unix_socket_directories line to `unix_socket_directories = '/postgres-volume/run'`
     - open vi editor with `vi /postgres-volume/data/postgresql.conf`
     - move down with arrow keys until the line that contains the porperty `unix_socket_directories`
     - Update the value to `/postgres-volume/run` (don't forget to activate the insert mode by pressing `i`)
     - close the insert mode by pressing `Esc`
     - close vi typing the command `:wq` and hit return/Enter
   - Start the postgres server with `pg_ctl start -D /postgres-volume/data`
   - Start the database cli with `psql -U postgres postgres`
   - Setup database with secure credentials you added as secrets on step 5
     ```sql
       CREATE DATABASE <database name>;
       CREATE USER <user name> WITH ENCRYPTED PASSWORD '<user password>';
       GRANT ALL PRIVILEGES ON DATABASE <database name> TO <user name>;
     ```
   - Test the credentials and the database is workign as expected by running `psql`
   - You should start the psql cli in the database you just created not in postgres root:

   Good: ✅

   ```sh
     / $ psql
     psql (14.5)
     Type "help" for help.

     database_name=#
   ```

   Bad: ❌

   ```sh
     / $ psql
     psql (14.5)
     Type "help" for help.

     postgres=#
   ```

   - close ssh connection

10. Create `flypostbuild` yarn script with the value of `su postgres -c 'pg_ctl start -D /postgres-volume/data' && yarn migrate up && yarn start`
11. Update the Dockerfile to use the `flypostbuild` script
12. Redeploy with `flyctl deploy`

    - The app should deploy with no porblems and the database records should be now available on production

13. Copy to your project the directory .github with all its content from the configuration files repo
14. Perform some changes to the app commit and push the changes to the repo. Github actions should deploy a new version of your app successfully
