$.getJSON("../data/export.10000.json", function(data) {
    const sorted = _.sortBy(data, function (o) {
        return o.RecvTime.$date;
    });
    const id = _.where(sorted, { MMSI: 992351085 });
    // console.log(sorted);
    // console.log(id);

    const unique = _.countBy(sorted, function (o) {
        return o.MMSI
    });
    // console.log(unique);

    const result = _.reduce(sorted, function(prev, curr) {
        let found = _.find(prev, function(el) { return el.RecvTime.$date === curr.RecvTime.$date; });
        found ? (found.total += curr.total) : prev.push(_.clone(curr));
        return prev;
    }, []);
    // console.log(result);
});




