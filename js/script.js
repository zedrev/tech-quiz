import {InitializeQuizApp, ErrorState} from "./main.js";

fetch("./question.json")
    .then(response => {
        if (!response.ok) throw new Error("There was a problem with the server or network. Please check your internet connection or try again later.");
        return response.json();
    })
    .then((data) => {
        InitializeQuizApp(document.getElementById("root"), data);        
    })
    .catch(err => {        
        switch (err.name ) {
            case "SyntaxError":
                ErrorState("Oops! There was a problem in the main sourc code of the program. Please try reporting this problem as soon as possible.");
                    break;        
            case "URIError":
                ErrorState("Oops! A URI error occurred. This typically happens when you use invalid characters in a URI. Please try reporting this problem as soon as possible.");
                break;
                default:
                ErrorState("Oops! An error occurred. Try reporting this problem as soon as possible and try again later.");
        }
        console.log(err);
        console.log(err.message);
    });