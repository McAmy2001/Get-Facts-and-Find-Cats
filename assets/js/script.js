const catDisplayEl = document.getElementById("cat-display");
const submitBtnEl = document.getElementById("submit-btn");
const zipInputEl = document.getElementById("zip-code");
const pastZipsEl = document.getElementById("pastZips");
const clearPastZipsEl = document.getElementById("clear-saved-zips");
const enterZipModal = document.getElementById("enter-zip");
const errorModal = document.getElementById("api-error");
const progressBarEl = document.getElementById("#progress-bar");

// FUNCTION for displaying cat search results
var displayCats = function (array) {

  console.log(array);
  var catInfoCard = document.createElement("div");
  catInfoCard.className = "cat-info-card card m-1 p-3 equal-height column is-one-third has-text-centered has-background-info-dark is-shadow";

  var catPicDiv = document.createElement("div");
  catPicDiv.className = "card-image has-text-centered";
  var catPicFigure = document.createElement("figure");
  catPicFigure.className = "image is-rounded is-inline-block is-shadow";
  var catPic = document.createElement("img");
  catPic.src = array[1];
  catPic.className = "cat-pic media";
  catPicFigure.appendChild(catPic);
  catPicDiv.appendChild(catPicFigure);
  catInfoCard.appendChild(catPicDiv);

  var catTitle = document.createElement("p");
  catTitle.textContent = array[0];
  catTitle.className = "cat-name title has-text-black is-centered is-3";
  catInfoCard.appendChild(catTitle);

  var catWhere = document.createElement("p");
  catWhere.innerHTML = "Location:<br/><b>" + array[2] + "<br/>" + array[3] + "</b><br/><br/>Phone:<br/><b>" + array[4] + "</b>";
  catWhere.className = "cat-where column is-half is-offset-one-quarter has-background-link-dark has-text-white is-centered is-shadow";
  catInfoCard.appendChild(catWhere);

  catDisplayEl.appendChild(catInfoCard);
}

// FUNCTION for mapping locations from search results
var mapCats = function (loc) {
  console.log(loc);
}


// FUNCTION for searching for cats
var searchForCats = function (zip) {
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
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
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
              .then(function (response) {
                if (response.ok) {
                  response.json().then(function (data) {
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
        //alert("Please enter a zip code.")
        enterZipModal.classList.add("is-active");
      }
    })
    .catch(function (error) {
      //alert("Unable to connect to RescueGroups.")
      errorModal.classList.add("is-active");
    });
};

function closeModal($el) {
  $el.classList.remove('is-active');
}

// Add a click event on various child elements to close the parent modal
// Citation: This is taken from the example in the Bulma documentation for modals
(document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
  const $target = $close.closest('.modal');

  $close.addEventListener('click', () => {
    closeModal($target);
  });
});

//----------------------------- Cat Fact Section ---------------------------------//
var catFactCounter = 0;
const apiUrl = "https://cat-fact.herokuapp.com/facts";
var displayCatFacts = function (array) {
  console.log(array);
  //console.log(array[0])
  console.log(array[catFactCounter]);
  var catFactCard = document.getElementById("cat-fact-card");
  var catFactMsg = document.getElementById("cat-fact");
  catFactMsg.textContent = array[catFactCounter];
  catFactCard.classList.remove("is-hidden");
  catFactCounter = catFactCounter + 1;
  if (catFactCounter > 4) {
    catFactCounter = 0;
  }
}

var catFacts = function () {
  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          //console.log(data);
          var catFactsArray = [];
          for (var i = 0; i < data.length; i++) {
            //console.log(data[i].text);
            catFactsArray.push(data[i].text);
            //console.log(catFactsArray); 
          }
          displayCatFacts(catFactsArray);
        })
      }
    })
};



// FUNCTION for saving zip code searches to local storage
var saveZip = function (zipCode) {
  const storageZips = localStorage.getItem("savedZips");
  const currentZip = { zip: zipCode };
  var zipsArray = JSON.parse(storageZips);

  if (zipCode.length === 5) {
    if (storageZips === null) {
      localStorage.setItem("savedZips", JSON.stringify([currentZip]));
    } else if (zipsArray.find(e => e.zip === zipCode)) {
      localStorage.setItem("savedZips", JSON.stringify(zipsArray));
    } else {
      zipsArray.push(currentZip);
      localStorage.setItem("savedZips", JSON.stringify(zipsArray));
    }
  }
  listZips();
};

// FUNCTION for listing past zip code searches on page initialization and after search
var listZips = function () {
  while (pastZipsEl.firstChild) {
    pastZipsEl.removeChild(pastZipsEl.firstChild);
  }
  const storageZips = localStorage.getItem("savedZips"); const listedZips = JSON.parse(storageZips);

  if (listedZips) {
    clearPastZipsEl.classList.remove("is-hidden");
    for (var i = 0; i < listedZips.length; i++) {
      var zipListEl = document.createElement("button");
      zipListEl.className = "past-zip-btn button is-small";
      zipListEl.textContent = listedZips[i].zip;
      pastZipsEl.appendChild(zipListEl);
    }
  }
};
listZips();

// FUNCTION to handle click of a past zip search
var pastZipHandler = function (e) {
  var zip = e.target.textContent;
  zipInputEl.textContent = zip;

  while (catDisplayEl.firstChild) {
    catDisplayEl.removeChild(catDisplayEl.firstChild);
  }

  searchForCats(zip);
  catFacts();
};

// FUNCTION to handle click of submit button for zip code search
var submitBtnHandler = function (event) {
  event.preventDefault();
  var zipCode = zipInputEl.value.trim();

  while (catDisplayEl.firstChild) {
    catDisplayEl.removeChild(catDisplayEl.firstChild);
  }
  searchForCats(zipCode);
  saveZip(zipCode);
  zipInputEl.value = '';
  catFacts();
};

// FUNCTION to clear past zip search history
var clearHistory = function () {
  localStorage.clear();
  while (pastZipsEl.hasChildNodes()) {
    pastZipsEl.removeChild(pastZipsEl.firstChild);
  }
};

// Event Listeners
submitBtnEl.addEventListener("click", submitBtnHandler);
pastZipsEl.addEventListener("click", pastZipHandler);
clearPastZipsEl.addEventListener("click", clearHistory);



let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 46.7296, lng: 94.6859 },
    zoom: 10,
  });
}

window.initMap = initMap;

