# Local server testing

## Create a local demo admin

Start a local MongoDB instance and make sure `MONGO_URI` in `server/.env` points to it using `localhost`, `127.0.0.1`, or `::1`. Then, from the `server` directory, run:

```powershell
$env:ALLOW_LOCAL_DEMO_SEED = "true"
npm run seed:demo-admin
```

The seeder creates `demo-admin@localhost.test` and prints a randomly generated password once. Sign in at `/login` with those credentials, then open `/Admindashbord`. To choose a different email, set `DEMO_ADMIN_EMAIL` before running the command. The seeder refuses non-local MongoDB hosts, requires explicit opt-in, and never resets an existing account's password. If that email already exists, choose another email or use the existing credentials. The dashboard's counts reflect whatever data is in the local database; this script does not copy production data.
