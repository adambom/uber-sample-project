# all the imports
from flask import Flask, request, render_template, flash, jsonify
from datetime import datetime
from lib.shared import db
from lib.location import Location
from lib.utils import *

app = Flask(__name__)
app.config.from_pyfile('app.cfg', silent=True)
db.init_app(app)

@app.route('/')
def index():
    debug = request.args.get('debug')

    if debug == None:
        debug = False

    return render_template('main.html', bootstrap=get_serialized_locations(), debug=debug)

@app.route('/locations/', methods=['GET'])
def read_locations():
    page = request.args.get('page')

    if page == None:
        page = 1

    page_length = request.args.get('pageLength')

    if page_length == None:
        page_length = 5

    page = int(page)
    page_length = int(page_length)

    q = request.args.get('q')

    if q == None:
        q = ''

    sort = request.args.get('sort')

    locations = get_serialized_locations(page, page_length, q, sort)

    # TODO: Figure out how to set content type to JSON
    return jsonify(data=locations['data'], pages=locations['pages'], total=locations['total'])

@app.route('/locations/', methods=['POST'])
def add_entry():
    l = Location(
        request.json['lat'],
        request.json['lng'],
        request.json['address'],
        request.json['nickname']
    )

    db.session.add(l)
    db.session.commit()

    return jsonify(l.serialize())

@app.route('/locations/<int:location_id>', methods=['DELETE'])
def remove_entry(location_id):
    l = Location.query.get(location_id)

    db.session.delete(l)
    db.session.commit()

    return 'Record Deleted'

@app.route('/locations/<int:location_id>', methods=['PUT'])
def update_entry(location_id):
    l = Location.query.get(location_id)

    for k in request.json:
        setattr(l, k, request.json[k])

    setattr(l, 'last_modified', datetime.utcnow())
    db.session.commit()

    return jsonify(l.serialize())

if __name__ == '__main__':
    app.run(debug=True)
