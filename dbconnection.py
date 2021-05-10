from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session, sessionmaker
import sys

class DBConnection(object):
    def __init__(self):
        """Initialize DBConnection object to interact with database"""
        
        user='acraig1225'
        pw='#$%cse115a#$%'
        host='highlanderdb.cjnqiycyzhsl.us-east-2.rds.amazonaws.com'
        db_name='testing'
        conn_string = f"postgresql://{user}:{pw}@{host}/{db_name}"

        self.engine = create_engine(conn_string)
        self.stmts = []
	
    def execute(self):
        """
        Sequentially execute each SQL statement, then 
        clear list of statements
        """
        Session = sessionmaker(self.engine)
        session = Session()

        for stmt in self.stmts:
            try:
                session.execute(text(stmt))
                session.commit()
            except Exception as e:
                print(e, file=sys.stderr)
                session.rollback()

        self.stmts = []
        session.close()

    def add_stmt(self, stmt):
        self.stmts.append(stmt)

    def query(self, query):
        """Executes a query and returns list of results"""
        return list(self.engine.execute(text(query)))
