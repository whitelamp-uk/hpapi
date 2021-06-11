# To collate the initialisation SQL for ~/hpapi/whitelamp-uk:
#   bash ~/hpapi/whitelamp-uk/hpapi-sql/hpapi-collate-sql.bash
# To collate the initialisation SQL for any given vendor
#   bash ~/hpapi/whitelamp-uk/hpapi-sql/hpapi-collate-sql.bash ~/hpapi/some-vendor/some-sql
# To collate the entire initialisation SQL for the entire Hpapi system
#   bash ~/hpapi/whitelamp-uk/hpapi-sql/hpapi-collate-sql.bash ~/hpapi
# If you just want the file paths, use -q as the first argument
if [ "$1" = "-q" ]
then
    quiet="1"
    shift
fi
if [ "$1" ]
then
    if [ ! -d "$1" ]
    then
        echo "'$1' is not a directory"
        exit 101;
    fi
    dirs="$(realpath $1)"
else
    dirs="$(dirname $(realpath "$0"))"
fi
if [ "$2" ]
then
    if [ ! "$quiet" ]
    then
        echo -e "\n-- ############ COLLATED SQL MODEL: $2 ############\n"
    fi
    dirs="$(find $dirs -type d -iname $2)"
fi

for type in tables.sql rows.sql functions.sql routines.sql
do
    if [ ! "$quiet" ]
    then
        echo -e "\n-- ############ COLLATED SQL: $2 $type ############\n"
    fi
    for dir in $dirs
    do
        for file in $(find -L "$dir" -type f -iname $type)
        do
            if [ "$quiet" ]
            then
                echo $file
                continue
            fi
            if [ ! "$quiet" ]
            then
                echo -e "\n-- ############ $2 $type $file ############\n" ;
            fi
            cat "$file"
        done
    done
done
