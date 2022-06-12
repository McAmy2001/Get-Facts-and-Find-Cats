const catDisplayEl = document.getElementById("cat-display");
const submitBtnEl = document.getElementById("submit-btn");
const zipInputEl = document.getElementById("zip-code");
const pastZipsEl = document.getElementById("pastZips");

// FUNCTION for displaying cat search results
var displayCats = function(array) {
  console.log(array);
  var catInfoCard = document.createElement("div");
  catInfoCard.className = "cat-info-card";

  var catPic = document.createElement("img");
  catPic.src = array[1];
  catPic.className = "cat-pic";
  catInfoCard.appendChild(catPic);

  var catTitle = document.createElement("p");
  catTitle.textContent = array[0];
  catTitle.className = "cat-name";
  catInfoCard.appendChild(catTitle);

  var catWhere = document.createElement("p");
  catWhere.innerHTML = "Location:<br/>" + array[2] + "<br/>" + array[3] + "<br/>Phone:<br/>" + array[4];
  catWhere.className = "cat-where";
  catInfoCard.appendChild(catWhere);

  catDisplayEl.appendChild(catInfoCard);
}

// FUNCTION for mapping locations from search results
 var mapCats = function(loc) {
   console.log(loc);
 }


 // FUNCTION for searching for cats
var searchForCats = function(zip) {
  console.log(zip);
  // Required headers for RescueGroups API
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/vnd.api+json");
  myHeaders.append("Authorization", "XVgJPmtQ");

  // Filters for searching by distance from zip code
  var raw = JSON.stringify({
    "data": {
      "filterRadius": {
        "miles": 30,
        "postalcode": zip
      }
    }
  });

  // Request options package for fetch request
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  // Initial fetch request by distance from zip code
  fetch("https://api.rescuegroups.org/v5/public/animals/search/available/cats/haspic/?sort=random&limit=9", requestOptions)
    .then(function(response) {
      if (response.ok) {
        response.json().then(function(data) {
          console.log(data.data);

          var initialArray = data.data;
          for (var i = 0; i < initialArray.length; i++) {
          // Get ID number for follow up fetch
          catIDNum = (data.data[i].id);
          // Second fetch by ID, required for location data
          fetch("https://api.rescuegroups.org/v5/public/animals/" + catIDNum + "/?include=locations", {
            method: 'GET',
            headers: myHeaders
          })
          .then(function(response) {
            if (response.ok) {
              response.json().then(function(data) {
                console.log(data);

                // Declare variables from data for catArray
                var catName = (data.data[0].attributes.name);
                var catImgUrl = (data.data[0].attributes.pictureThumbnailUrl);
                var catStreet = data.included[0].attributes.street
                var catCity = data.included[0].attributes.citystate;
                var catLocation = catStreet + ", " + catCity;
                // If location data is present send to mapCats function
                if (data.included[0].attributes.street !== undefined && data.included[0].attributes.citystate !== undefined) {
                  mapCats(catLocation);
                };
                catPhone = data.included[0].attributes.phone;

                // Declare carArray to send to displayCats function
                catArray = [catName, catImgUrl, catStreet, catCity, catPhone];
                displayCats(catArray);
              })
            }
          })
        }
      })
      } else {
        alert("Please enter a zip code.")
      }
    })
    .catch(function(error) {
      alert("Unable to connect to RescueGroups.")
    });
  };    

var saveZip = function(zip) {
    const storageZips = localStorage.getItem("savedZips");
    const currentZip = {zip: zip};
  
    if (storageZips === null) {
      localStorage.setItem("savedZips", JSON.stringify([currentZip]));
    } else {
      var zipsArray = JSON.parse(storageZips);
      zipsArray.push(currentZip);
      localStorage.setItem("savedZips", JSON.stringify(zipsArray));
    }
  };

  // List past zip code searches on page initialization
var listZips = function() {
  const storageZips = localStorage.getItem("savedZips");const listedZips = JSON.parse(storageZips);

  if (listedZips) {
  for (var i = 0; i < listedZips.length; i++) {
    var zipListEl = document.createElement("button");
    zipListEl.className = "past-zip-btn";
    zipListEl.textContent = listedZips[i].zip;
    pastZipsEl.appendChild(zipListEl);
  }
}
};
listZips();

var pastZipHandler = function(e) {
  e.preventDefault();
  var zip = e.target.textContent;
  //var zipNum = parseInt(zip);
  console.log(zip);
  searchForCats(zip);
};


var submitBtnHandler = function(event){
  event.preventDefault();
  var zipCode = zipInputEl.value.trim();
  searchForCats(zipCode);
  saveZip(zipCode);
  zipInputEl.value = '';
};

submitBtnEl.addEventListener("click", submitBtnHandler);
pastZipsEl.addEventListener("click", pastZipHandler);