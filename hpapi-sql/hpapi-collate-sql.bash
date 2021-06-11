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
