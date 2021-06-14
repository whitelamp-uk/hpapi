
# hpapi

HTTP POST API for client-server JSON interactions.

```bash

# You can get the entire SQL required to initialise a data model:
bash ~/hpapi/whitelamp-uk/hpapi-sql/hpapi-collate-sql.bash ~/hpapi BurdenAndBurden > bab.sql

# Or just one vendor's contribution to one model:
bash ~/hpapi/whitelamp-uk/hpapi-sql/hpapi-collate-sql.bash ~/hpapi/burden-and-burden HpapiModel > HpapiModel.burden-and-burden.sql

# Or just a file listing of either of the above:
bash ~/hpapi/whitelamp-uk/hpapi-sql/hpapi-collate-sql.bash -q ~/hpapi HpapiModel

# List of files that might contain Hpapi access permissions:
bash ~/hpapi/whitelamp-uk/hpapi-sql/hpapi-collate-sql.bash -q ~/hpapi HpapiModel | grep rows.sql

# To collate all SQL that might contain Hpapi access permissions:
for file in $(bash ~/hpapi/whitelamp-uk/hpapi-sql/hpapi-collate-sql.bash -q ~/hpapi HpapiModel | grep rows.sql) ; do cat $file >> access.sql ; done
cat access.sql

```

### The key rules for SQL are:
 * tables.sql files should always be non-destructive and tolerant of columns added later
 * rows.sql files should be tolerant of existing rows and never delete rows
 * functions.sql and routines.sql files should be destructive but tolerant of missing routines

### In other words use these SQL forms:
 * tables.sql     - CREATE TABLE IF NOT EXISTS
 * tables.sql     - ALTER TABLE ADD COLUMN IF NOT EXISTS
 * rows.sql       - INSERT IGNORE INTO
 * rows.sql       - UPDATE [but no update of primary or foreign keys]
 * functions.sql  - DROP FUNCTION IF EXISTS
 * routines.sql   - DROP PROCEDURE IF EXISTS

The idea is that, without damage, one can execute the SQL over and again to keep the database compatible with the evolving PHP/bash code (eg a new column gets added). Not wonderful version control but then no version control is very good at databases...

In production, however, one would tend to freshly install in a staging area with new database clones, do a fresh install and execute the SQL on the new databases. Rollback is achieved by simple reverting the live instance to the previous staging area. Only SQL activity since the upgrade is left orphaned in the old database requiring manual action and nothing gets lost.


## Upgrade Hpapi model

### Before running:
 * reconfigure stage 3 to use new databases
 * clone the new databases from the old

```bash

cd ~/hpapi-stage-3/whitelamp-uk
# Just in case branch has been changed:
git checkout stable
# Update PHP and SQL:
git pull
#
# Update one or more data models
cd ~/hpapi-stage-3/burden-and-burden
git checkout stable
git pull
#
# Collate SQL
cd ~/hpapi-stage-3
bash ./whitelamp-uk/hpapi-sql/hpapi-collate-sql.bash . HpapiModel > /tmp/hpapi.sql
bash ./whitelamp-uk/hpapi-sql/hpapi-collate-sql.bash . BurdenAndBurden > /tmp/bab.sql
#
# Execute SQL
sudo mariadb hpapi < /tmp/hpapi.sqlsudo mariadb bab_model < /tmp/bab.sql
#
# Put stage 3 live
cd /var/www/html
sudo rm myservice
sudo ln -s ~/hpapi-stage-3/whitelamp-uk/hpapi-server myservice
#
# Revert
cd /var/www/html
sudo rm myservice
sudo ln -s ~/hpapi-stage-2/whitelamp-uk/hpapi-server myservice

```
