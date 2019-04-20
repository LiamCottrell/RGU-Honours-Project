AFRAME.registerComponent('ship-events', {
    init: function () {
        const el = this.el;  // <a-box>
        el.addEventListener('click', function () {
            // alert('test');
            // console.log('test');
            //  0.00001 0.00001
            $('#shipPopup').modal('show');
            // el.setAttribute('scale', {x: 0.0001, y: 0.0001, z: 0.0001});
            let test = el.getAttribute('MMSI');
            let test3 = $("a-gltf-model[mmsi='" + test +"']").data('ship');
            let test2 = el.getAttribute('data-ship');
            $('#shipContent').html(JSON.stringify(test3));
            console.error(test3);
        });
    }
});