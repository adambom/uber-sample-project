from shared import db
from datetime import datetime


class Location(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    lat = db.Column(db.Float)
    lng = db.Column(db.Float)
    address = db.Column(db.Text)
    nickname = db.Column(db.String(80))
    last_modified = db.Column(db.DateTime)

    def __init__(self, lat, lng, address, nickname, last_modified=None):
        self.lat = lat
        self.lng = lng
        self.address = address
        self.nickname = nickname
        if last_modified is None:
            last_modified = datetime.utcnow()
        self.last_modified = last_modified

    def __repr__(self):
        return '<Location %r>' % self.address

    def serialize(l):
        return {
            'id': l.id,
            'lat': l.lat,
            'lng': l.lng,
            'address': l.address,
            'nickname': l.nickname,
            'lastModified': l.last_modified
        }

    pass
