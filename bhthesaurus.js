// Alliterative Thesaurus by Tom Dehnel
// Words API from BigHugeLabs
// https://words.bighugelabs.com/api.php

var versionNumber = "0.3";
window.onload = function versionNumberUpdate () {
  document.getElementById("version").innerHTML = versionNumber;
  document.getElementById("formWordOne").focus();
};


var word1 = "noun";
var word2 = "noun";

var spellingErrorMessage = "Word(s) not found. Please check your spelling."
var noMatchErrorMessage = "No matches found."
var reloadingMessage = "If you see this message for longer than a few seconds, there was a problem with your submission.  Make sure you are submitting the correct kind of word(s)."

var openButtonLoader = function() {
  document.getElementById("buttonloader").style.display = "block";
  document.getElementById("submitButton").style.display = "none";
  document.getElementById("reloadmessage").innerHTML = reloadingMessage;
  document.getElementById("reloadmessage").style.display = "flex";
}

var closeButtonLoader = function() {
  document.getElementById("buttonloader").style.display = "none";
  document.getElementById("submitButton").style.display = "block";
  document.getElementById("reloadmessage").style.display = "none";
}

function searchKeyPress(e) {
    e = e || window.event;
    if (e.keyCode == 13) {
        document.getElementById('submitButton').click();
        return false;
    }
    return true;
}

var matcher = function(words1, words2) {  //find all alliterative two-word pairs
  var results = [];
  for (var i = 0; i < words1.length; i++) {
    var words1Word = words1[i];
    var words1Letter = words1[i].charAt(0);
      for (var x = 0; x  < words2.length; x++) {
        var words2Word = words2[x];
        var words2Letter = words2[x].charAt(0);
        if (words1Letter === words2Letter) {
        results.push("<div class='result'><span class='adjective'>" +
        words1Word + " </span><span class='noun'>" + words2Word + "</span></div>");
      }
    }
  }
  results = results.join("");
    if (results.length < 1) {
      closeButtonLoader();
      document.getElementById("errormessage").style.display = "block";
      document.getElementById("errormessage").innerHTML = noMatchErrorMessage;
    }
    else {
      document.getElementById("demo").innerHTML = results;
      closeButtonLoader();
      event.preventDefault();
    }
}


function run() {

  openButtonLoader();

  document.getElementById("errormessage").style.display = "none";
  document.getElementById("demo").innerHTML = "";
  var word1 = document.getElementById("formWordOne");  //find word synonyms, related, similar words
  var xhr = new XMLHttpRequest();
  var requestString = ("http://words.bighugelabs.com/api/2/bac061666f478f09f3ecdf573de053a9/" + word1.value + "/json");
  xhr.open("GET", requestString, false);
  xhr.send();

  if (xhr.status === 404 || xhr.status === 500) {
    closeButtonLoader();
    document.getElementById("errormessage").innerHTML = spellingErrorMessage;;
    document.getElementById("errormessage").style.display = "block";
  }

  else if (xhr.status === 200 || xhr2.status === 303) {
    var thesaurusResponse1 = JSON.parse(xhr.responseText);
    var word1Value = word1.value;

    var word1Syn = [].concat(thesaurusResponse1.noun.syn); //gets noun synonyms
    var word1Rel = [].concat(thesaurusResponse1.noun.rel); //gets noun related words
    var word1Sim = [].concat(thesaurusResponse1.noun.sim); //gets noun similar words

    var allword1 = word1Syn.concat(word1Rel).concat(word1Sim); //combines above words into a single array
    var allword1Clean = allword1.filter(function(e){return e});
    allword1Clean.unshift(word1Value);  //adds user submitted word to beginning of synonym string

    var word2 = document.getElementById("formWordTwo");  //find word synonyms, related, similar words
    var xhr2 = new XMLHttpRequest();
    var requestString = ("http://words.bighugelabs.com/api/2/bac061666f478f09f3ecdf573de053a9/" + word2.value + "/json");
    xhr2.open("GET", requestString, false);
    xhr2.send();
  }

  if (xhr2.status === 404 || xhr2.status === 500) {
    closeButtonLoader();
    document.getElementById("errormessage").innerHTML = spellingErrorMessage;
    document.getElementById("errormessage").style.display = "block";
  }

  else if (xhr2.status === 200 || xhr2.status === 303) {
    var thesaurusResponse2 = JSON.parse(xhr2.responseText);
    var word2Value = word2.value;

    var word2Syn = [].concat(thesaurusResponse2.noun.syn); //gets noun synonyms
    var word2Rel = [].concat(thesaurusResponse2.noun.rel); //gets noun related words
    var word2Sim = [].concat(thesaurusResponse2.noun.sim); //gets noun similar words

    var allword2 = word2Syn.concat(word2Rel).concat(word2Sim); //combines above words into a single array
    var allword2Clean = allword2.filter(function(e){return e});
    allword2Clean.unshift(word2Value);  //adds user submitted word to beginning of synonym string

    matcher(allword1Clean, allword2Clean);

    return;
}
}
