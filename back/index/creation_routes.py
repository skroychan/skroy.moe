from flask import Blueprint, jsonify

from db import db
from index.entities import Creation


creations_blueprint = Blueprint('creation', __name__)


@creations_blueprint.route('/get/<id>', methods=['GET'])
def get_creation(id):    
    query = db.select(Creation).where(Creation.id==id)
    result = db.session.execute(query).one_or_none()
    
    if not result:
        return 'Not found', 404
    
    creation = get_model(result)

    return jsonify(creation);


@creations_blueprint.route('/latest', methods=['GET']) 
def latest():
    query = db.select(Creation).where(Creation.is_public).order_by(Creation.priority.desc(), Creation.published_date.desc()).limit(50)
    result = db.session.execute(query).all()
    creations = get_models(result)

    return jsonify(creations);


def get_models(obj):
    return [row[0] for row in obj]


def get_model(obj):    
    return obj[0]
