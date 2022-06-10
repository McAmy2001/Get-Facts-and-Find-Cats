var displayCats = function(array) {
  console.log(array);
}


var searchForCats = function() {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/vnd.api+json");
  myHeaders.append("Authorization", "XVgJPmtQ");

  var zipCode = prompt("What is your zip code?");

  var raw = JSON.stringify({
    "data": {
      "filterRadius": {
        "miles": 20,
        "postalcode": zipCode
      }
    }
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch("https://api.rescuegroups.org/v5/public/animals/search/available/cats/haspic/?sort=random&limit=3", requestOptions)
    .then(function(response) {
      if (response.ok) {
        response.json().then(function(data) {
          //console.log(data.data);

          var initialArray = data.data;
          for (var i = 0; i < initialArray.length; i++) {
          //catName = (data.data[i].attributes.name);
          //console.log(catName);
          //catImgUrl = (data.data[i].attributes.pictureThumbnailUrl);
          //console.log(catImgUrl);
          catIDNum = (data.data[i].id);
          //console.log(catIDNum);
          //console.log(data.data[0].relationships.locations.data[0].id);
          //catArray = [catName, catImgUrl];
          //console.log(catArray);
          fetch("https://api.rescuegroups.org/v5/public/animals/" + catIDNum + "/?include=locations", {
            method: 'GET',
            headers: myHeaders
          })
          .then(function(response) {
            if (response.ok) {
              response.json().then(function(data) {
                console.log(data);
                //console.log(data.included[0].attributes.street);
                catName = (data.data[0].attributes.name);
                catImgUrl = (data.data[0].attributes.pictureThumbnailUrl);
                catLocation = data.included[0].attributes.street + ", " + data.included[0].attributes.citystate;
                //console.log(catLocation);
                catArray = [catName, catImgUrl, catLocation];
                console.log(catArray);
                displayCats(catArray);
              })
            }
          })
          
        }
      })
      }
    })
  }


    //.then(response => response.json())
    //.then(data => console.log(data.data[0]))
    //.catch(error => console.log('error', error));
    

searchForCats(); 