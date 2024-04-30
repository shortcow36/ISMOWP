let lastKnownGradeLength = null;

// use setInterval to make a request to the LMS platform's GET /grades endpoint every 5 seconds
setInterval(() => {
    fetch('http://localhost:3000/grades')
        .then(res => res.json())
        .then(data => {
            const newGradesCount = data.length - lastKnownGradeLength;

            if (newGradesCount > 0) {
                // Make a request to the Gradebook platform's POST /grades endpoint
                const newGrades = data.slice(data.length - newGradesCount);

                console.info("THERE HAVE BEEN SOME CHANGES!")
                console.info(`I SEE ${newGradesCount} NEW GRADES!`)
                console.info(newGrades)

                lastKnownGradeLength = data.length;
            } else {
                console.info(`No new grades found. Still only ${lastKnownGradeLength} grades.`)
            }
        })
}, 5000)