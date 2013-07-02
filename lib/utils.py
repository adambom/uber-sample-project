from location import *

def get_locations(page=1, page_length=5, q='', sort={ 'lastModified': -1 }):
    pag = Location.query \
        .filter(Location.nickname.like('%' + q + '%')) \
        .order_by(Location.last_modified.desc()) \
        .paginate(page, page_length, False)

    return { 'data': pag, 'pages': pag.pages, 'total': pag.total }

def serialize_locations(locations):
    return [l.serialize() for l in locations.items]

def get_serialized_locations(page=1, page_length=5, q='', sort={ 'lastModified': -1 }):
    locations = get_locations(page, page_length, q, sort)
    return { 'data': serialize_locations(locations['data']), 'pages': locations['pages'], 'total': locations['total'] }
