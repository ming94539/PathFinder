from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session, sessionmaker
from os.path import dirname, join, realpath
import sys

class DBConnection(object):
    def __init__(self):
        user='acraig1225'
        pw='#$%cse115a#$%'
        host='highlanderdb.cjnqiycyzhsl.us-east-2.rds.amazonaws.com'
        db_name='testing'
        conn_string = f"postgresql://{user}:{pw}@{host}/{db_name}"

        self.engine = create_engine(conn_string)
	
    def execute(self, query):
        Session = sessionmaker(self.engine)
        session = Session()

        try:
            session.execute(text(query))
            session.commit()
        except Exception as e:
            print(e, file=sys.stderr)
            session.rollback()

        session.close()