from datetime import datetime

from flask import Blueprint, jsonify, redirect, request

from db import db
from index.entities import Creation, Tag


admin_blueprint = Blueprint('admin', __name__)


@admin_blueprint.route('/creation/get/<id>', methods=['GET'])
def get_creation(id):    
    query = db.select(Creation).where(Creation.id==id)
    result = db.session.execute(query).one_or_none()
    
    if not result:
        return 'Not found', 404
    
    creation = get_model(result)

    return jsonify(creation);


@admin_blueprint.route('/create', methods=['POST'])
def create():
    creation = Creation(title=request.form['title'], content=request.form['content'])

    db.session.add(creation)
    db.session.commit()

    return redirect(f'/creation.html?id={creation.id}')


@admin_blueprint.route('/publish/<id>', methods=['POST'])
def publish(id):
    query = db.select(Creation).where(Creation.id==id)
    result = db.session.execute(query).one_or_none()

    if not result:
        return 'Not found', 404
    
    creation = get_model(result)
    creation.is_public = True
    creation.published_date = datetime.now()

    db.session.add(creation)
    db.session.commit()

    return 'Success', 200


@admin_blueprint.route('/unpublish/<id>', methods=['POST'])
def unpublish(id):
    query = db.select(Creation).where(Creation.id==id)
    result = db.session.execute(query).one_or_none()

    if not result:
        return 'Not found', 404
    
    creation = get_model(result)
    creation.is_public = False
    creation.published_date = None

    db.session.add(creation)
    db.session.commit()

    return 'Success', 200


@admin_blueprint.route('/save/<id>', methods=['POST'])
def save(id):
    query = db.select(Creation).where(Creation.id==id)
    result = db.session.execute(query).one_or_none()

    if not result:
        return 'Not found', 404
    
    creation = get_model(result)
    creation.title = request.json['title']
    creation.content = request.json['content']
    creation.tags = get_or_create_tags(request.json['tags'])

    db.session.add(creation)
    db.session.commit()

    return 'Success', 200


def get_or_create_tags(strings):
    query = db.select(Tag).where(Tag.name.in_(strings))
    query_result = db.session.execute(query).all()
    tags = get_models(query_result)
    found_tags = {tag.name : tag for tag in tags}

    result = []
    for string in strings:
        if string in found_tags:
            result.append(found_tags[string])
        else:
            result.append(Tag(name=string))

    return result


def get_models(obj):
    return [row[0] for row in obj]


def get_model(obj):    
    return obj[0]
