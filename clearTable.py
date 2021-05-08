# clearTable.py
# Testing only; clears table after prompting user
# Prints contents if table is not cleared

from sqlalchemy import create_engine, text
import sys

user='acraig1225'
pw='#$%cse115a#$%'
host='highlanderdb.cjnqiycyzhsl.us-east-2.rds.amazonaws.com'
db_name='testing'
conn_string = f"postgresql://{user}:{pw}@{host}/{db_name}"
engine = create_engine(conn_string)

# table = 'JobIDTable'
table = 'Test'

result = engine.execute(text(f"SELECT * FROM {table}"))
if result.rowcount == 0:
    print('That table is empty')
    sys.exit()

ans = input(f'{result.rowcount} entries found in {table}; clear? (Y/N)\n').lower()

if ans == 'y':
    engine.execute(text(f"DELETE FROM {table}"))
elif ans == 'n':
    for row in result:
        print(row)
        