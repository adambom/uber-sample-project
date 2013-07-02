(function (App, undefined) {
App["tmpl"] = App["tmpl"] || {};
App["tmpl"]["createLocation"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<form action="/locations/" method="POST" class="navbar-form pull-right form-inline">\n    <input type="text" name="nickname" id="inputName" value="" placeholder="Name">\n\n    <input type="text" class="input-xlarge" name="address" id="inputAddress" value="" autocomplete="off" placeholder="Address">\n\n    <input type="hidden" name="lat" id="inputLat">\n    <input type="hidden" name="lng" id="inputLon">\n    <button type="submit" id="submitNewLocation" class="btn btn-primary">Add Favorite</button>\n\n</form>';

}
return __p
};
App["tmpl"]["editLocation"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<td><input class="edit-nickname input-block-level" type="text" value="' +
((__t = ( nickname )) == null ? '' : __t) +
'" placeholder="Nickname"></td>\n<td><input class="edit-address input-block-level" type="text" value="' +
((__t = ( address )) == null ? '' : __t) +
'" placeholder="Address"></td>\n<td><a href="javascript: void(0);" class="btn btn-primary save" data-location-id="' +
((__t = ( id )) == null ? '' : __t) +
'">Save</a></td>\n<td><a href="javascript: void(0);" class="cancel" data-location-id="' +
((__t = ( id )) == null ? '' : __t) +
'">Cancel</a></td>\n<input type="hidden" class="edit-lat" value="' +
((__t = ( lat )) == null ? '' : __t) +
'">\n<input type="hidden" class="edit-lng" value="' +
((__t = ( lng )) == null ? '' : __t) +
'">';

}
return __p
};
App["tmpl"]["infoWindow"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<h3>' +
((__t = ( nickname )) == null ? '' : __t) +
'</h3>\n<p><abbr>' +
((__t = ( address )) == null ? '' : __t) +
'</abbr></p>\n<p><a href="javascript: void(0);">Request Über Here</p>';

}
return __p
};
App["tmpl"]["locationsList"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<table class="table table-striped">\n    <thead>\n        <tr>\n            <th>Name</th>\n            <th>Address</th>\n            <th>Edit</th>\n            <th>Delete</th>\n        </tr>\n    </thead>\n    <tbody>\n        ';
 if (!locations.length) { ;
__p += '\n            <tr>\n                <td colspan="4">Nothing here! Time to get started.</td>\n            </tr>\n        ';
 } ;
__p += '\n        ';
 _.each(locations, function (location) { ;
__p += '\n            <tr>\n                <td>' +
((__t = ( location.nickname )) == null ? '' : __t) +
'</td>\n                <td>' +
((__t = ( location.address )) == null ? '' : __t) +
'</td>\n                <td><a href="javascript: void(0);" class="edit" data-location-id="' +
((__t = ( location.id )) == null ? '' : __t) +
'">Edit</a></td>\n                <td><a href="javascript: void(0);" class="delete" data-location-id="' +
((__t = ( location.id )) == null ? '' : __t) +
'">Delete</a></td>\n            </tr>\n        ';
 }); ;
__p += '\n    </tbody>\n</table>\n<div class="paging"></div>';

}
return __p
};
App["tmpl"]["pagination"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="pagination">\n    <ul>\n        ';
 if (!firstPage) { ;
__p += '<li><a href="javascript: void(0);" class="prevPage">Prev</a></li>';
 } ;
__p += '\n        ';
 _.each(pagination, function (page) { ;
__p += '\n            <li class="' +
((__t = ( page.className )) == null ? '' : __t) +
'"><a href="javascript: void(0);" class="page" data-page="' +
((__t = ( page.label )) == null ? '' : __t) +
'" >' +
((__t = ( page.label )) == null ? '' : __t) +
'</a></li>\n        ';
 }); ;
__p += '\n        ';
 if (!lastPage) { ;
__p += '<li><a href="javascript: void(0);" class="nextPage">Next</a></li>';
 } ;
__p += '\n    </ul>\n</div>';

}
return __p
};
App["tmpl"]["search"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<a href="javascript: void(0);" class="clear hidden">Clear</a>\n<input type="text" class="input-xlarge q" placeholder="Search Locations">';

}
return __p
};
})( this["UBER"]);