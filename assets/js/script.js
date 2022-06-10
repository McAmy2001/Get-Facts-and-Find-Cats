var practiceApi = function() {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/vnd.api+json");
  myHeaders.append("Authorization", "XVgJPmtQ");

  var raw = JSON.stringify({
    "data": {
      "filterRadius": {
        "miles": 20,
        "postalcode": 55128
      }
    }
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch("https://api.rescuegroups.org/v5/public/animals/search/available/cats/haspic/?sort=random&limit=5", requestOptions)
    .then(function(response) {
      if (response.ok) {
        response.json().then(function(data) {
          console.log(data.data);
          console.log(data.data[0].attributes.name);
          console.log(data.data[0].attributes.pictureThumbnailUrl);
          console.log(data.data[0].id);
          console.log(data.data[0].relationships.locations.data[0].id);
        })
      }
    })



    //.then(response => response.json())
    //.then(data => console.log(data.data[0]))
    //.catch(error => console.log('error', error));
    
}
practiceApi(); 