module.exports.deg2rad = (deg) => {
    return deg*Math.PI/180;
};

module.exports.calcGeoDistance = (lat1, long1, lat2, long2) => {
    var earth_radius = 6400;
    var delta_lat = this.deg2rad(lat2 - lat1);
    var delta_long = this.deg2rad(long2 - long1);

    var a = (Math.sin(delta_lat/2)*Math.sin(delta_lat/2))
        + (Math.cos(this.deg2rad(lat1))*Math.cos(this.deg2rad(lat2))*Math.sin(delta_long/2)*Math.sin(delta_long/2));
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var distance = earth_radius*c;
    return distance;
};