from flask import Flask

import config
from db import db
from index.creation_routes import creations_blueprint
from index.admin_routes import admin_blueprint


app = Flask(__name__)

app.register_blueprint(creations_blueprint, url_prefix='/creation')
app.register_blueprint(admin_blueprint, url_prefix='/admin')

app.config['SQLALCHEMY_DATABASE_URI'] = config.get_connection_string()
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
