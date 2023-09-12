from configparser import ConfigParser


def get_connection_string():
    db_protocol = config.get('database', 'protocol')
    db_user = config.get('database', 'user')
    db_password = config.get('database', 'password')
    db_host = config.get('database', 'host')
    db_port = config.get('database', 'port')
    db_name = config.get('database', 'name')

    return f'{db_protocol}://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}'


config = ConfigParser()
config.read('config.ini')
