AFRAME.registerComponent('ship-events', {
    init: function () {
        const el = this.el;  // <a-box>
        el.addEventListener('click', function () {

            $('#shipPopup').modal('show');

            let mmsi = el.getAttribute('data-MMSI');
            let ship = document.querySelector("a-entity[data-mmsi='"+ mmsi +"']");

            $('#shipContent').html(JSON.stringify(ship.dataset));
        });
    }
});