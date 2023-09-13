from datetime import datetime

from flask import Blueprint, redirect, request

from db import db
from index.entities import Creation


admin_blueprint = Blueprint('admin', __name__)


@admin_blueprint.route('/create', methods=['POST'])
def create():
    creation = Creation(title=request.form['title'], content=request.form['content'])

    db.session.add(creation)
    db.session.commit()

    return redirect(f'/admin/creation.html?id={creation.id}')


@admin_blueprint.route('/publish/<id>', methods=['POST'])
def publish(id):
    query = db.select(Creation).where(Creation.id==id)
    result = db.session.execute(query).one_or_none()

    if not result:
        return 'Not found', 404
    
    creation = get_model(result)
    creation.is_public = True;
    creation.published_date = datetime.now()

    db.session.add(creation)
    db.session.commit()

    return redirect(f'/creation.html?id={creation.id}')


@admin_blueprint.route('/unpublish/<id>', methods=['POST'])
def unpublish(id):
    query = db.select(Creation).where(Creation.id==id)
    result = db.session.execute(query).one_or_none()

    if not result:
        return 'Not found', 404
    
    creation = get_model(result)
    creation.is_public = False;
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
    creation.title = request.json['title'];
    creation.content = request.json['content']
    creation.file_path = request.json['file_path']

    db.session.add(creation)
    db.session.commit()

    return 'Success', 200


def get_model(obj):
    return obj[0]
