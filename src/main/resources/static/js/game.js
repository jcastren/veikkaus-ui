function loadFragTeams(id) {
    var homeTeamUrl = "getFragHomeTeams";
    var awayTeamUrl = "getFragAwayTeams";
    homeTeamUrl = homeTeamUrl + "/" + id;
    $("#homeTeamDiv").load(homeTeamUrl);
    awayTeamUrl = awayTeamUrl + "/" + id;
    $("#awayTeamDiv").load(awayTeamUrl);
}

$("#selTournament").change(function () {
    loadFragTeams($("#selTournament").val());
});

$(document).ready(function () {
    loadFragTeams(0);
});