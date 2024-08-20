// fronted vanila js

const socket=io();
 
socket.on('connect', () => {
  console.log('Connected to Socket.IO');
});

socket.on('disconnect', () => {
  console.log('Disconnected from Socket.IO');
});

socket.on('error', (error) => {
  console.error('Socket.IO error:', error);
});

if(navigator.geolocation){
    navigator.geolocation.watchPosition(
    (position)=>{
        const {latitude,longitude} = position.coords;
        socket.emit("send-location",{latitude,longitude});
    },
    (error)=>{
        console.error(error);
    },
    {
        enableHighAccuracy:true,
        timeout:5000,
        maximumAge:0
    }
     );
}

  

const map=L.map("map").setView([0,0],16);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution:"OpenStreetMap"

}).addTo(map)

 




const markers={};

socket.on("receive-location",(data)=>{
    const {id,latitude,longitude}=data;
    map.setView([latitude,longitude],18);

    if(markers[id]){
        markers[id].setLatLng([latitude,longitude]);
    }
    else{
        //  original 
        markers[id]=L.marker([latitude,longitude]).addTo(map);
   
   
    }
})


socket.on("user-disconnect",(id)=>{
  if(markers[id]){
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});

// update user 

socket.on("update-users", (users) => {
    Object.keys(users).forEach((id) => {
      const { latitude, longitude } = users[id];
      if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
      } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
      }
    });
  });