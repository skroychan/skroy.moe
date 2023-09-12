from dataclasses import dataclass
from datetime import datetime

from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func

from db import db


creation_tag = db.Table('creation_tag',
    db.Column('creation_id', db.BigInteger, db.ForeignKey('creation.id')),
    db.Column('tag_id', db.BigInteger, db.ForeignKey('tag.id'))
)


@dataclass
class Creation(db.Model):
    __tablename__ = 'creation'

    id: Mapped[int] = mapped_column(db.BigInteger, primary_key=True)
    created_date: Mapped[datetime] = mapped_column(db.DateTime(timezone=False), server_default=func.now())
    published_date: Mapped[datetime] = mapped_column(db.DateTime(timezone=False))
    title: Mapped[str] = mapped_column(db.String(1024))
    content: Mapped[str] = mapped_column(db.Text)
    file_path: Mapped[str] = mapped_column(db.String(256))
    is_public: Mapped[bool] = mapped_column(db.Boolean)
    category_id = mapped_column(db.BigInteger, db.ForeignKey('category.id'))
    category: Mapped['Category'] = db.relationship('Category', back_populates='creations')
    tags = db.relationship('Tag', secondary=creation_tag, back_populates='creations')

    def __repr__(self):
        return f'<Creation "{self.id}">'


@dataclass
class Tag(db.Model):
    __tablename__ = 'tag'
    
    id: Mapped[int] = mapped_column(db.BigInteger, primary_key=True)
    created_date: Mapped[datetime] = mapped_column(db.DateTime(timezone=False), server_default=func.now())
    name: Mapped[str] = mapped_column(db.String(256), nullable=False)
    is_visible: Mapped[bool] = mapped_column(db.Boolean)
    creations = db.relationship('Creation', secondary=creation_tag, back_populates='tags')

    def __repr__(self):
        return f'<Tag "{self.name}">'


@dataclass
class Category(db.Model):
    __tablename__ = 'category'

    id: Mapped[int] = mapped_column(db.BigInteger, primary_key=True)
    created_date: Mapped[datetime] = mapped_column(db.DateTime(timezone=False), server_default=func.now())
    name: Mapped[str] = mapped_column(db.String(256))
    creations = db.relationship('Creation', back_populates='category')

    def __repr__(self):
        return f'<Category "{self.name}">'
