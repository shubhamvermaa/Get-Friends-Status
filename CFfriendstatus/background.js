// Fetch the user handle from local storage
chrome.storage.local.get(['userHandle'], function(result) {
    if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        return;
    }
    
    var userHandle = result.userHandle || "random"; // Default to "random" if not set

    (function() {
        'use strict';

        // console.log("hello world!!");

        // Extract contestId and index from the URL
        const url = window.location.href;
        const match = url.match(/problemset\/problem\/(\d+)\/([A-Z])/);
        let contestId = null;
        let index = null;

        if (match) {
            contestId = match[1];
            index = match[2];
            console.log(`Contest ID: ${contestId}, Index: ${index}`);
        } else {
            console.log("URL does not match the problem pattern.");
            return;
        }

        // URL to fetch JSON data
        const apiUrl = `https://codeforces.com/api/user.status?handle=${userHandle}&from=1&count=100000`;

        // Global flag variable to track if any verdict is "OK"
        let anyOKVerdict = 0;

        // Fetch the JSON data
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.status === "OK") {
                    // Filter results to match the extracted contestId and index
                    const filteredResults = data.result.filter(item => {
                        return item.contestId == contestId && item.problem.index == index;
                    }).map(item => {
                        // If any verdict is "OK", set the flag to 1
                        if (item.verdict === "OK") {
                            anyOKVerdict = 1;
                        }
                        return {
                            verdict: item.verdict
                        };
                    });

                    // console.log(filteredResults); // Log the filtered results to the console
                    console.log("Any OK Verdict:", anyOKVerdict); // Log the value of the flag
                    
                    var toInsert;
                    if(anyOKVerdict) {
                        toInsert = `<p style="font-weight: bold; color: green;">Friend's Status: DONE</p>`
                    } else {
                        toInsert = `<p style="font-weight: bold; color: red;">Friend's Status: NOT DONE YET</p>`
                    }
                    const getProblemBox = document.createElement("div");
                    getProblemBox.innerHTML = toInsert;
                    document.querySelector("#sidebar").prepend(getProblemBox);
                } else {
                    console.error('Error in API response:', data);
                }
            })
            .catch(error => {
                console.error('Error fetching the data:', error);
            });

    })();
});
