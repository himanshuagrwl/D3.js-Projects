function fnGender() {
    document.getElementsByClassName("active")[0].className = "";
    document.getElementById("btnGender").className = "active";
    document.getElementById("mysvg").innerHTML = "";
    drawBar(gender, "Gender");
}

function fnHanded() {
    document.getElementsByClassName("active")[0].className = "";
    document.getElementById("btnHanded").className = "active";
    document.getElementById("mysvg").innerHTML = "";
    drawBar(handed, "Hand Use");

}

function fnBirthMonth() {
    document.getElementsByClassName("active")[0].className = "";
    document.getElementById("btnBirthMonth").className = "active";
    document.getElementById("mysvg").innerHTML = "";
    drawBar(birthmonth, "Birthday Month");

}

function fnFavSubject() {
    document.getElementsByClassName("active")[0].className = "";
    document.getElementById("btnFavSubject").className = "active";
    document.getElementById("mysvg").innerHTML = "";
    drawBar(favSubject, "Favourite Subjects");
}

function fnAgeyears() {
    document.getElementsByClassName("active")[0].className = "";
    document.getElementById("btnAgeyears").className = "active";
    document.getElementById("mysvg").innerHTML = "";
    activeAttributeName = "Age";
    activeFeature = ageyears;
    drawBarChart(activeFeature, 10, activeAttributeName);

}

function fnHeight() {
    document.getElementsByClassName("active")[0].className = "";
    document.getElementById("btnHeight").className = "active";
    document.getElementById("mysvg").innerHTML = "";
    activeFeature = height;
    activeAttributeName = "Height in centimeter(cm)";
    drawBarChart(activeFeature, 10, activeAttributeName);
}

function fnTraveltoschool() {
    document.getElementsByClassName("active")[0].className = "";
    document.getElementById("btnTraveltoschool").className = "active";
    document.getElementById("mysvg").innerHTML = "";
    activeFeature = traveltimetoschool;
    activeAttributeName = "Travel time to School (minutes)";
    drawBarChart(activeFeature, 10, activeAttributeName);
}

function fnScoreMemory() {
    document.getElementsByClassName("active")[0].className = "";
    document.getElementById("btnScoreMemory").className = "active";
    document.getElementById("mysvg").innerHTML = "";
    activeFeature = scorememory;
    activeAttributeName = "Score In Memory Game";
    drawBarChart(activeFeature, 10, activeAttributeName);
}

function fnSleepHour() {
    document.getElementsByClassName("active")[0].className = "";
    document.getElementById("btnSleepHour").className = "active";
    document.getElementById("mysvg").innerHTML = "";
    activeFeature = sleephours;
    activeAttributeName = "Sleep Hours During School Time"
    drawBarChart(activeFeature, 10, activeAttributeName);
}

function fnHomeOcc() {
    document.getElementsByClassName("active")[0].className = "";
    document.getElementById("btnHomeOcc").className = "active";
    document.getElementById("mysvg").innerHTML = "";
    activeFeature = homeocc;
    activeAttributeName = "Total Home Occupants"
    drawBarChart(activeFeature, 10, activeAttributeName);
}

function fnHomeworkHour() {
    document.getElementsByClassName("active")[0].className = "";
    document.getElementById("btnHomeworkHour").className = "active";
    document.getElementById("mysvg").innerHTML = "";
    activeFeature = homeworkhour;
    activeAttributeName = "Hours spent doing Homework"
    drawBarChart(activeFeature, 10, activeAttributeName);
}

function fnOutdoor() {
    document.getElementsByClassName("active")[0].className = "";
    document.getElementById("btnOutdoor").className = "active";
    document.getElementById("mysvg").innerHTML = "";
    activeFeature = outdoor;
    activeAttributeName = "Hours spent for Outdoor Activities"
    drawBarChart(activeFeature, 10, activeAttributeName);
}

function fnVideoGame() {
    document.getElementsByClassName("active")[0].className = "";
    document.getElementById("btnVideoGame").className = "active";
    // noOfBins = document.getElementById("slider").value;
    document.getElementById("mysvg").innerHTML = "";
    activeFeature = videogame;
    activeAttributeName = "Hours spent on Video Games"
    drawBarChart(activeFeature, 10, activeAttributeName);
}

function fnComputeruse() {
    document.getElementsByClassName("active")[0].className = "";
    document.getElementById("btnComputeruse").className = "active";
    // noOfBins = document.getElementById("slider").value;
    document.getElementById("mysvg").innerHTML = "";
    activeFeature = computeruse;
    activeAttributeName = "Computer Usage in Hours"
    drawBarChart(activeFeature, 10, activeAttributeName);
}

function fnWatchtv() {
    document.getElementsByClassName("active")[0].className = "";
    document.getElementById("btnWatchtv").className = "active";
    document.getElementById("mysvg").innerHTML = "";
    activeFeature = watchtv;
    activeAttributeName = "Time spent Watching TV in Hours"
    drawBarChart(activeFeature, 10, activeAttributeName);
}

var gender = [];
var handed = [];
var birthmonth = [];
var favSubject = [];
var ageyears = [];
var height = [];
var traveltimetoschool = [];
var scorememory = [];
var sleephours = [];
var homeocc = [];
var homeworkhour = [];
var outdoor = [];
var videogame = [];
var computeruse = [];
var watchtv = [];

d3.csv("NY_student_clean.csv", function (csvdata) {
    csvdata.map(function (d) {
        gender.push(d.Gender);
        handed.push(d.Handed);
        birthmonth.push(d.Birth_month);
        favSubject.push(d.Favorite_School_Subject);
        ageyears.push(+d.Ageyears);
        height.push(+d.Height_cm);
        traveltimetoschool.push(+d.Travel_time_to_School);
        scorememory.push(+d.Score_in_memory_game);
        sleephours.push(+d.Sleep_Hours_Schoolnight);
        homeocc.push(+d.Home_Occupants);
        homeworkhour.push(+d.Doing_Homework_Hours);
        outdoor.push(+d.Outdoor_Activities_Hours);
        videogame.push(+d.Video_Games_Hours);
        computeruse.push(+d.Computer_Use_Hours);
        watchtv.push(+d.Watching_TV_Hours);
    });
    drawBar(birthmonth, "Birthday Month");
});