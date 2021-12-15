import os
import traceback

import psycopg2


class PG_DBConnector:
    def __init__(self, db_req=os.environ.get(f"ENV")):
        self.db_req = db_req.upper()
        self.__connect()

    def __connect(self):
        try:
            self.conn = psycopg2.connect(
                database=os.environ.get(f"PG_DB_{self.db_req}"),
                user=os.environ.get(f"PG_USERNAME_{self.db_req}"),
                password=os.environ.get(f"PG_PASSWORD_{self.db_req}"),
                host=os.environ.get(f"PG_HOST_{self.db_req}"),
                port=os.environ.get(f"PG_PORT_{self.db_req}"),
            )

            self.cursor = self.conn.cursor()
        except Exception as e:
            self.conn = psycopg2.connect(
                database="postgres",
                user="postgres",
                password="postgres",
                host="localhost",
                port=2517,
            )
            self.cursor = self.conn.cursor()

    def close(self):
        if self.conn and not self.conn.closed:
            self.conn.close()

    def __str__(self):
        return str(self.conn)


class QueryManager:
    def __init__(self, collection_name, table, db_req=os.environ.get(f"ENV")):
        self.db_req = db_req
        self.conn_obj = PG_DBConnector(db_req)
        self.collection = collection_name
        self.table = table

    def fetch_rows_by_a_column(
        self, collection, table, column_values, column="clean_hash", no_of_items=1
    ):
        if not column_values:
            return []

        skeleton = f"""
                SELECT * FROM {collection}.{table}
                WHERE {column} IN %({column})s
                LIMIT %(no_of_items)s
                """
        values = {f"{column}": tuple(column_values), "no_of_items": no_of_items}

        try:
            self.conn_obj.cursor.execute(skeleton, values)
        except:
            self.conn_obj = PG_DBConnector(self.db_req)
            self.conn_obj.cursor.execute(skeleton, values)

        columns = [y[0] for y in self.conn_obj.cursor.description]

        rows = self.conn_obj.cursor.fetchall()
        rows = [dict(zip(columns, row)) for row in rows]

        return rows

    def fetch_query_direct_query(self, query):
        try:
            self.conn_obj.cursor.execute(query)
        except:
            self.conn_obj = PG_DBConnector(self.db_req)
            self.conn_obj.cursor.execute(query)

        columns = [y[0] for y in self.conn_obj.cursor.description]

        rows = self.conn_obj.cursor.fetchall()
        rows = [dict(zip(columns, row)) for row in rows]

        return rows

    def pg_handle_session_insert(self, data_dict, commit=True):
        """
        A function like this is being made with the goal
        to have one agreed upon function for all Postgres inserts.
        Important pre-requisites:
            - The input is always a python dictionary
        Params:
            - conn: Psycopg2 connection object
            - cur: Psycopg2 cursor object
            - collection: Name of the Postgres collection
            - table: Name of the table
            - data_dict: The updated raw in the form of a dictionary
        """
        columns = data_dict.keys()
        skel_columns = f"({', '.join(columns)})"
        skel_percentized_columns = [f"%({col})s" for col in columns]
        skel_values = f"({', '.join(skel_percentized_columns)})"

        skeleton = f"""
                INSERT INTO users.sessions {skel_columns}
                VALUES {skel_values} RETURNING session_id
                """

        """
        The following is where the real utility should lie (hopefully).
        We simply pass a dictionary here not worried about any
        Postgres statement implementation and let Psycopg2 handle it.
        No tuples, nothing, just a plain old data_dict.
        """
        try:
            op = self.conn_obj.cursor.execute(skeleton, data_dict)
            print(op)
            session_id = self.conn_obj.cursor.fetchone()[0]
        except Exception as e:
            traceback.print_exc()
            self.conn_obj.conn.rollback()
            """
            This helper function will actually raise
            an exception and let what's calling it take
            care of what to do
            """
            raise e
        else:
            self.conn_obj.conn.commit()

        return session_id

    def pg_handle_insert(self, data_dict, unique_constraint="", commit=True):
        """
        A function like this is being made with the goal
        to have one agreed upon function for all Postgres inserts.
        Important pre-requisites:
            - The input is always a python dictionary
        Params:
            - conn: Psycopg2 connection object
            - cur: Psycopg2 cursor object
            - collection: Name of the Postgres collection
            - table: Name of the table
            - data_dict: The updated raw in the form of a dictionary
        """
        columns = data_dict.keys()
        skel_columns = f"({', '.join(columns)})"
        skel_percentized_columns = [f"%({col})s" for col in columns]
        skel_values = f"({', '.join(skel_percentized_columns)})"
        if unique_constraint:
            skeleton = f"""
                    INSERT INTO {self.collection}.{self.table} {skel_columns}
                    VALUES {skel_values}
                    ON CONFLICT ON CONSTRAINT {unique_constraint}
                    DO NOTHING
                        """
        else:
            skeleton = f"""
                    INSERT INTO {self.collection}.{self.table} {skel_columns}
                    VALUES {skel_values}
                        """

        """
        The following is where the real utility should lie (hopefully).
        We simply pass a dictionary here not worried about any
        Postgres statement implementation and let Psycopg2 handle it.
        No tuples, nothing, just a plain old data_dict.
        """
        try:
            self.conn_obj.cursor.execute(skeleton, data_dict)
        except Exception as e:
            traceback.print_exc()
            self.conn_obj.conn.rollback()
            """
            This helper function will actually raise
            an exception and let what's calling it take
            care of what to do
            """
            raise e
        else:
            if commit:
                self.conn_obj.conn.commit()

        return self.conn_obj.cursor.rowcount

    def pg_index_search_text(self):
        query = """
            UPDATE user_content.cards d1
            SET search_tokens = to_tsvector(d1.for_search)
            FROM user_content.cards d2;
        """
        try:
            self.conn_obj.cursor.execute(query)
        except Exception as e:
            traceback.print_exc()
            self.conn_obj.conn.rollback()
            """
            This helper function will actually raise
            an exception and let what's calling it take
            care of what to do
            """
            raise e
        else:
            self.conn_obj.conn.commit()

    def __str__(self):
        return str(self.conn_obj)
