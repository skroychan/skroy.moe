from flask import Flask

import config
from db import db


app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = config.get_connection_string()
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
