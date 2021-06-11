# To collate the initialisation SQL for ~/hpapi/whitelamp-uk:
#   bash ~/hpapi/whitelamp-uk/hpapi-sql/hpapi-collate-sql.bash
# To collate the initialisation SQL for any given vendor
#   bash ~/hpapi/whitelamp-uk/hpapi-sql/hpapi-collate-sql.bash ~/hpapi/some-vendor/some-sql
# To collate the entire initialisation SQL for the entire Hpapi system
#   bash ~/hpapi/whitelamp-uk/hpapi-sql/hpapi-collate-sql.bash ~/hpapi
if [ "$1" ]
then
    if [ ! -d "$1" ]
    then
        echo "'$1' is not a directory"
        exit;
    fi
    dir="$(realpath $1)"
else
    dir="$(dirname $(realpath "$0"))"
fi
echo -e "\n\n-- ############ $dir COLLATED SQL ############\n\n"
find "$dir" -iname 'tables.sql' -print0         |  while IFS= read -r -d '' line
do echo -e "\n\n-- ############ $line ############" ; cat "$line" ; done
find "$dir" -iname 'rows.sql' -print0           |  while IFS= read -r -d '' line
do echo -e "\n\n-- ############ $line ############" ;  cat "$line" ; done
find "$dir" -iname 'functions.sql.sql' -print0  |  while IFS= read -r -d '' line
do echo -e "\n\n-- ############ $line ############" ;  cat "$line" ; done
find "$dir" -iname 'routines.sql' -print0       |  while IFS= read -r -d '' line
do echo -e "\n\n-- ############ $line ############" ;  cat "$line" ; done
