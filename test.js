<html>
<head>
<title>AV_Gate event stream demo rev.6</title>
<style>
.ok { color: lightgreen; }
.error { color: red; }
.invisible { display: none; }
.highlight { background-color: yellow; }
table {
    border-left-width: 0px; border-right-width: 0px;
    border-collapse: collapse;
}
th {
    text-align: left;
    margin-left: 0px; margin-right: 0px;
    padding-left: 1em; padding-right: 1em;
}
th:nth-child(2) {
    text-align: center;
}
td {
    margin-left: 0px; margin-right: 0px;
    padding-left: 1em; padding-right: 1em;
}
td:nth-child(2) {
    text-align: center;
}
div#curtain {
    background-color: black; display: none; height: 100%; left: 0; margin: 0;
    opacity: 0.4; padding: 0; position: fixed; top: 0; width: 100%; z-index: 100;
}
div#popup {
    background-color: white; border: none;
    display: none; height: 98%; left: 1%; margin: 0; overflow: auto; padding: 0;
    position: fixed; text-align: center; top: 1%; width: 98%; z-index: 101;
}

/* Solution for centering image both vertically and horizontally is found here:
   https://stackoverflow.com/a/18869078
*/

div#popup img {
    border: none; bottom: 0; height: auto; left: 0;
    margin: auto; /*max-height: 100%; max-width: 100%;*/ position: absolute;
    right: 0; top: 0; width: auto;
}
</style>
<script>
let MaxTableRows = 1000;
let HighlightDuration = 3;

var camera_names = [];

var event_source;
var highlight_timer;
var highlight_counter = 0;

function cameraName( id ) {
    var name = camera_names[id];
    return name ? ( "(" + id + ") " + name ) : ( "" + id );
}

function tsToTime( s, ms ) {
    var date = new Date( s*1000 + ms ).toString();
    return date.replace( /(\s*\(.*\))/g, "" ).substr( 4 );
}

function eventTsToTime( event ) {
    return tsToTime( event.ts.s, event.ts.ms );
}

function addRow() {
    var events_table = document.getElementById( "events" );
    if( events_table.rows.length > MaxTableRows )
        events_table.deleteRow( -1 );
    var row = events_table.rows.item( 1 );
    if( row )
        row.className = "";
    row = events_table.insertRow( 1 );
    row.className = "highlight";
    return row;
}

function addEventRow( time, type, camera, data ) {
    var row = addRow();
    var cell = row.insertCell();
    cell.appendChild( document.createTextNode( time ) );
    cell = row.insertCell();
    cell.appendChild( document.createTextNode( type ) );
    cell = row.insertCell();
    cell.appendChild( document.createTextNode( camera ) );
    cell = row.insertCell();
    cell.appendChild( document.createTextNode( data ) );
    highlight_counter = 0;
    return row;
}

function addMessageRow( message, className ) {
    var row = addRow();
    var cell = row.insertCell();
    cell.colSpan = 4;
    cell.appendChild( document.createTextNode( message ) );
    if( className )
        cell.className = className;
    highlight_counter = 0;
}

function addMd( event ) {
    addEventRow( eventTsToTime( event ), event.event,
        cameraName( event.data.camera.id ), "zone " + event.data.zone.id );
}

function addVca( event ) {
    addEventRow( eventTsToTime( event ), event.event,
        cameraName( event.data.camera.id ),
        "zone " + event.data.zone.id + " " + event.data.type );
}

function addNpr( event ) {
    addEventRow( eventTsToTime( event ), event.event,
        cameraName( event.data.camera.id ), "[" + event.data.number + "]" );
}

function addNprl( event ) {
    addEventRow( eventTsToTime( event ), event.event,
        cameraName( event.data.camera.id ),
        "[" + event.data.number + "] " + event.data.list.name );
}

function addTnpr( event ) {
    var row = addEventRow( eventTsToTime( event ), event.event,
        cameraName( event.data.camera.id ), "[" + event.data.number + "]" );
    var extra_cell = row.insertCell();
    if( event.data.image ) {
        var photo_link = document.createElement( "a" );
        photo_link.href = "javascript:void(0)";
        photo_link.text = "photo";
        photo_link.onclick = function() {
            document.getElementById( "number" ).innerText = event.data.number;
            document.getElementById( "photo" ).src =
                "data:image/jpeg;base64," + event.data.image;
            showPopup();
        };
        extra_cell.appendChild( photo_link );
    } else {
        extra_cell.appendChild( document.createTextNode( "no photo" ) );
    }
}

function addError( event ) {
    addMessageRow( event.id + ": " + event.message, "error" );
}

function makeAdder( add_func ) {
    return function( event ) {
        try {
            add_func( JSON.parse( event.data ) );
        }
        catch( ex ) {
            addMessageRow( ex, "error" );
        }
    }
}

function removeHighlight() {
    if( ++highlight_counter >= HighlightDuration ) {
        var events_table = document.getElementById( "events" );
        var row = events_table.rows.item( 1 );
        if( row )
            row.className = "";
        highlight_counter = 0;
    }
}

function makeEventSource() {
    event_source = new EventSource( "/cvgate/v1/event-stream" );
    event_source.onopen = function() {
        queryCameras();
        var status_field = document.getElementById( "status" );
        status_field.className = "invisible";
        status_field.innerText = "";
        var events_table = document.getElementById( "events" );
        events_table.className = "";
        highlight_timer = setInterval( removeHighlight, 1000 );
    };
    event_source.onerror = function() {
        var status_field = document.getElementById( "status" );
        status_field.className = "error";
        status_field.innerText = "EventSource error";
        this.close();
        setTimeout( makeEventSource, 5000 );
    };
    event_source.addEventListener( "md", makeAdder( addMd ) );
    event_source.addEventListener( "vca", makeAdder( addVca ) );
    event_source.addEventListener( "npr", makeAdder( addNpr ) );
    event_source.addEventListener( "nprl", makeAdder( addNprl ) );
    event_source.addEventListener( "tnpr", makeAdder( addTnpr ) );
    event_source.addEventListener( "source-error", makeAdder( addError ) );
    event_source.addEventListener( "source-failure", function( event ) {
        makeAdder( addError )( event );
        this.close();
    });
}

function populateCameras() {
    if( this.readyState == 4 && this.status == 200 ) {
        var cameras = JSON.parse( this.responseText );
        cameras.forEach( function( value ) {
            camera_names[value.id] = value.name;
        } );
    }
}

function queryCameras() {
    var crq = new XMLHttpRequest();
    crq.onreadystatechange = populateCameras;
    crq.open( "GET", "/cvgate/v1/cameras", true );
    crq.setRequestHeader( "Accept", "application/json" );
    crq.send( null );
}

function loaded() {
    makeEventSource();
}

function showPopup() {
    document.getElementById( "curtain" ).style.display = 'block';
    document.getElementById( "popup" ).style.display = 'block';
}

function hidePopup() {
    document.getElementById( "curtain" ).style.display = 'none';
    document.getElementById( "popup" ).style.display = 'none';
}

</script>
</head>
<body onload="loaded()">
<div id="curtain" onclick="hidePopup()"></div>
<div id="popup" onclick="hidePopup()">
<h2 id="number"></h2>
<img id="photo">
</div>
<div id="status">Connecting...</div>
<table id="events" class="invisible">
<thead>
<tr><th>Time</th><th>Type</th><th>Camera</th><th>Data</th></tr>
</thead>
<tbody>
</tbody>
</table>
</body>
</html>