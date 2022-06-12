const catDisplayEl = document.getElementById("cat-display");



// FUNCTION for displaying cat search results
var displayCats = function (array) {
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
var mapCats = function (loc) {
    console.log(loc);
}


// FUNCTION for searching for cats
var searchForCats = function () {
    // Required headers for RescueGroups API
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/vnd.api+json");
    myHeaders.append("Authorization", "XVgJPmtQ");

    // Get zip code, needs to be changed to from input
    var zipCode = prompt("What is your zip code?");

    // Filters for searching by distance from zip coe
    var raw = JSON.stringify({
        "data": {
            "filterRadius": {
                "miles": 20,
                "postalcode": zipCode
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
    fetch("https://api.rescuegroups.org/v5/public/animals/search/available/cats/haspic/?sort=random&limit=3", requestOptions)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    //console.log(data.data);

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
                alert("Please enter a zip code.")
            }
        })
        .catch(function (error) {
            alert("Unable to connect to RescueGroups.")
        });
};

// Event listener on input form will call this function:
searchForCats(); 
//------------------------------- Cat Fact Section ---------------------------------//
const catFactsEl = document.getElementById('cat-facts');
const loadFactBtn = document.getElementById('load-more');

const loadSomeCatFact = (numberOfFacts = 1) => {
const catUrl = "https://cat-fact.herokuapp.com/facts?number=${numberOfFacts}"; 
fetch(catUrl)
    .then(response => response.json())
    .then(responseJSON => {
        // TODO: display facts on page
        for (let { text } of responseJSON) {
            const catFact = document.createElement("p");
            catFact.innerText = text;
            catFactsEl.append(catFact);
        }
    })
}
loadFactBtn.addEventListener('click', () => {
    loadSomeCatFact(1)
});

